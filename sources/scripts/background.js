$(function() {
	var login_flag = false;
	var current_tab_id = 0;
	var current_url = '';
	var current_contest_id = '';
	var current_problem_id = '';
	var current_problem_key = '';
	var last_send_response = undefined;
	var submissions_list = [];
	var solved_info_list = []; // 0: Accepted, 1: Rejected, 2: No Submission
	var waited_request = undefined;

	/**
	 * 角丸の矩形を描画する
	 */
	function fill_round_rect(context, left, top, width, height, r) {
		context.beginPath();
		context.arc(left + r, top + r, r, -Math.PI, -0.5 * Math.PI, false);
		context.arc(left + width - r, top + r, r, -0.5 * Math.PI, 0, false);
		context.arc(left + width - r, top + height - r, r, 0, 0.5 * Math.PI, false);
		context.arc(left + r, top + height - r, r, 0.5 * Math.PI, Math.PI, false);
		context.closePath();
		context.fill();
	}

	/**
	 * アイコンの画像を設定する
	 */
	function set_page_action_icon_image(tab_id) {
		function get_solved_style(type) {
			if (type === 0) {
				return {
					color : 'rgba(0,204,0,0.75)',
					text : 'AC'
				};
			} else if (type === 1) {
				return {
					color : 'rgba(204,51,0,0.75)',
					text : 'WA'
				};
			}
			return {
				color : 'rgba(102,102,102,0.75)',
				text : '-'
			};
		}
		var style = get_solved_style(solved_info_list[tab_id]);
		var canvas = document.createElement('canvas');
		var context = canvas.getContext('2d');

		// background
		context.fillStyle = style.color;
		fill_round_rect(context, 0, 0, 16, 16, 2);

		// text
		context.font = "9px 'Francois One'";
		context.fillStyle = 'rgba(255,255,255,0.9)';
		var metrix = context.measureText(style.text);
		var leftPos = parseInt((16 - metrix.width) / 2);
		context.fillText(style.text, leftPos, 12);

		var image_data = context.getImageData(0, 0, 16, 16);
		chrome.pageAction.setIcon({
			tabId : tab_id,
			imageData : image_data
		});
	}

	/**
	 * 指定したタブにページアクションを表示する
	 */
	function set_page_action_icon(tab_id) {
		chrome.tabs.get(tab_id, function(tab) {
			if (!login_flag) {
				return;
			}
			var url = tab.url;
			if (Codeforces.is_problem_page_url(url)) {
				set_page_action_icon_image(tab_id);
				chrome.pageAction.show(tab_id);
			}
		});
	}

	/**
	 * 現在選択されているタブのURLを取得する
	 */
	function set_current_url(tab_id) {
		chrome.tabs.get(tab_id, function(tab) {
			current_url = tab.url;
			if (Codeforces.is_problem_page_url(current_url)) {
				current_contest_id = Codeforces.get_contest_id_from_url(current_url);
				current_problem_id = Codeforces.get_problem_id_from_url(current_url);
				current_problem_key = current_contest_id + ',' + current_problem_id;
			}
		});
	}

	/**
	 * 残っていたリクエストを更新する
	 */
	function update_waited_request() {
		if (waited_request instanceof Function) {
			chrome.tabs.get(tab_id, function(tab) {
				current_url = tab.url;
				if (Codeforces.is_problem_page_url(current_url)) {
					current_contest_id = Codeforces.get_contest_id_from_url(current_url);
					current_problem_id = Codeforces.get_problem_id_from_url(current_url);
					current_problem_key = current_contest_id + ',' + current_problem_id;
					var submissions = submissions_list[current_contest_id].filter(function(submission) {
						return submission.problem_id === current_problem_id;
					});
					try {
						waited_request({
							success : true,
							submissions : submissions,
							contest_id : current_contest_id,
							problem_id : current_problem_id
						});
					} catch (e) {
						waited_request = undefined;
					}
					waited_request = undefined;
				}
			});
		}
	}

	/**
	 * タブが選択されたり更新されたときに実行される関数
	 */
	function set_tab(tab_id) {
		if (!login_flag) {
			chrome.pageAction.hide(tab_id);
		} else {
			current_tab_id = tab_id;
			set_page_action_icon(tab_id);
			set_current_url(tab_id);
			update_waited_request();
		}
	}

	/**
	 * タブが選択されたときのイベント
	 */
	function after_tab_highlight(highlight_info) {
		var tab_id = highlight_info.tabIds[0];
		set_tab(tab_id);
	}

	/**
	 * タブが更新されたときのイベント
	 */
	function after_tab_updated(tab_id, info) {
		if (info.status == 'complete') {
			set_tab(tab_id);
		} else {
			solved_info_list[tab_id] = undefined;
		}
	}

	/**
	 * 提出状況を受け取る
	 */
	function set_submissions(tab_id, info, send_response) {
		var contest_id = info.contest_id;
		var problem_id = info.problem_id;
		var submissions = info.submissions;

		solved_info_list[tab_id] = (function() {
			if (typeof (submissions) === 'undefined') {
				return 2;
			}
			var cnt = 0;
			var accepted = submissions.some(function(submission) {
				if (submission.problem_id !== problem_id) {
					return false;
				}
				cnt++;
				return submission.status === Codeforces.STATUS_ACCEPTED;
			});
			if (cnt == 0) {
				return 2;
			}
			return accepted ? 0 : 1;
		})();

		console.log('solved info', tab_id, solved_info_list[tab_id]);
		submissions_list[contest_id] = submissions;
		// TODO: page actionなどデータの更新を待ってる人にお返事を出す
		set_tab(tab_id);
		send_response({
			success : true
		});
	}

	/**
	 * 提出状況を返す
	 */
	function get_submissions(info, send_response) {
		if (typeof (submissions_list[current_contest_id]) === 'undefined') {
			// データが更新されるのを待つ
		} else {
			// 現在の問題IDに一致するものだけを返す
			var submissions = submissions_list[current_contest_id].filter(function(submission) {
				return submission.problem_id === current_problem_id;
			});
			send_response({
				success : true,
				submissions : submissions,
				contest_id : current_contest_id,
				problem_id : current_problem_id
			});
		}
	}

	function wait_submissions(tab_id, info, send_response) {
		waited_request = send_response;
	}

	/**
	 * サンプル入出力の設定
	 */
	function set_sample_io(info, send_response) {
		// TODO: 実装
		send_response({
			success : true
		});
	}

	function set_login_flag(info, send_response) {
		login_flag = info.login_flag;
	}

	/**
	 * 通信を管理する関数
	 */
	function do_check_message(request, sender, send_response) {
		var type = request.type;
		var info = request.info;

		if (type === 'set submissions') {
			set_submissions(sender.tab.id, info, send_response);
		} else if (type === 'get submissions') {
			get_submissions(info, send_response);
		} else if (type === 'wait submissions') {
			wait_submissions(sender.tab.id, info, send_response);
		} else if (type === 'set sample io') {
			set_sample_io(info, send_response);
		} else if (type === 'set login flag') {
			set_login_flag(info, send_response);
		}

		return true;
	}

	/**
	 * イベントとかを設定する
	 */
	$(window).on('load', function() {
		chrome.tabs.onHighlighted.addListener(after_tab_highlight);
		chrome.tabs.onUpdated.addListener(after_tab_updated);
		chrome.extension.onMessage.addListener(do_check_message);
	});
});