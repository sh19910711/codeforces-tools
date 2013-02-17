$(function() {
	var login_flag = false;
	var current_tab_id = 0;
	var current_url = '';
	var current_url_prefix = '';
	var current_host = '';
	var current_contest_id = '';
	var current_problem_id = '';
	var current_problem_key = '';
	var last_send_response = undefined;
	var submissions_list = [];
	var solved_info_list = []; // 0: Accepted, 1: Rejected, 2: No Submission
	var sample_io_list = [];
	var waited_request = undefined;
	var clipboard_buffer = undefined;

	(function() {
		var model = Settings.get('codeforces_host');
		if ( ! model )
			model = Settings.create({
				id: 'codeforces_host',
				value: ''
			});
		var codeforces_host = model.get('value');
		if ( codeforces_host )
			Codeforces.set_codeforces_host( codeforces_host );
	})();

	check_login(function() {});
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
	 		} else if ( type === 3 ) {
		 		return {
		 			color : 'rgba(102,102,102,0.75)',
		 			text : '/'
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
	 function set_current_url(tab_id, callback) {
	 	chrome.tabs.getSelected(function(tab) {
	 		current_url = tab.url;
	 		current_url_prefix = Utils.get_url_prefix(current_url);
	 		if (Codeforces.is_problem_page_url(current_url)) {
	 			current_contest_id = Codeforces.get_contest_id_from_url(current_url);
	 			current_problem_id = Codeforces.get_problem_id_from_url(current_url);
	 			current_problem_key = current_contest_id + ',' + current_problem_id;
	 		}
	 		if (callback instanceof Function) {
	 			callback();
	 		}
	 	});
	 }

	/**
	 * 残っていたリクエストを更新する
	 */
	 function update_waited_request() {
	 	if (waited_request instanceof Function) {
	 		if (Codeforces.is_problem_page_url(current_url)) {
	 			current_contest_id = Codeforces.get_contest_id_from_url(current_url);
	 			current_problem_id = Codeforces.get_problem_id_from_url(current_url);
	 			current_problem_key = current_contest_id + ',' + current_problem_id;

	 			if ((typeof (submissions_list[current_contest_id]) === 'undefined') || !(submissions_list instanceof Array)) {
	 				return;
	 			}

	 			var submissions = submissions_list[current_contest_id].filter(function(submission) {
	 				return submission.problem_id === current_problem_id;
	 			});

	 			try {
	 				waited_request({
	 					success : true,
	 					submissions : submissions,
	 					contest_id : current_contest_id,
	 					problem_id : current_problem_id,
	 					url_prefix : current_url_prefix
	 				});
	 			} catch (e) {
	 				waited_request = undefined;
	 			}

	 			waited_request = undefined;
	 		}
	 	}
	 }

	/**
	 * コンテキストメニューを設定する
	 */
	 function set_context_menu( current_tab_id, current_url, current_problem_key, depth ) {
	 	chrome.contextMenus.removeAll();
	 	if (!Codeforces.is_problem_page_url(current_url)) {
	 		return;
	 	}

	 	if (typeof (sample_io_list[current_problem_key]) === 'undefined') {
	 		if ( depth < 3 )
		 		setTimeout( function() {
		 			set_context_menu(current_tab_id, current_url, current_problem_key, depth+1); 
		 		}, 1000 );
	 		return;
	 	}

	 	var places = [ 'page', 'selection' ];
	 	var sample_input = sample_io_list[current_problem_key].sample_input;
	 	var sample_output = sample_io_list[current_problem_key].sample_output;
	 	var sample_io_count = sample_io_list[current_problem_key].sample_input.length;

	 	chrome.contextMenus.create({
	 		title : 'Copy All Sample Input to clipboard',
	 		contexts : places,
	 		onclick : function() {
	 			var data = sample_input.join('\n');
	 			copy_to_clipboard(data);
	 		}
	 	});

	 	chrome.contextMenus.create({
	 		title : 'Copy All Sample Output to clipboard',
	 		contexts : places,
	 		onclick : function() {
	 			var data = sample_output.join('\n');
	 			copy_to_clipboard(data);
	 		}
	 	});

	 	for ( var i = 0; i < sample_io_count; ++i) {
	 		(function(i) {
	 			var test_case_id = chrome.contextMenus.create({
	 				title : 'Test Case ' + (i + 1),
	 				contexts : places
	 			});
	 			chrome.contextMenus.create({
	 				title : 'Copy Input to clipboard',
	 				contexts : places,
	 				onclick : function() {
	 					var data = sample_input[i];
	 					copy_to_clipboard(data);
	 				},
	 				parentId : test_case_id
	 			});
	 			chrome.contextMenus.create({
	 				title : 'Copy Output to clipboard',
	 				contexts : places,
	 				onclick : function() {
	 					var data = sample_output[i];
	 					copy_to_clipboard(data);
	 				},
	 				parentId : test_case_id
	 			});
	 		})(i);
	 	}
	 }

	/**
	 * タブが選択されたり更新されたときに実行される関数
	 */
	 function set_tab(tab_id) {
	 	set_current_url(tab_id, function() {
	 		current_tab_id = tab_id;
	 		set_page_action_icon(tab_id);
	 		update_waited_request();
	 		set_context_menu(current_tab_id, current_url, current_problem_key, 0);
	 	});
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

	 	Codeforces.get_submissions_with_contest_id(contest_id, function(ret) {
	 		var submissions = ret.submissions;
	 		solved_info_list[tab_id] = (function() {
	 			if (typeof (submissions) === 'undefined') {
	 				return 2;
	 			}
	 			if (!(submissions instanceof Array)) {
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
	 			var rejected = ! submissions.some(function(submission) {
	 				if (submission.problem_id !== problem_id) {
	 					return false;
	 				}
	 				cnt++;
	 				return submission.status === Codeforces.STATUS_TESTING;
	 			});
	 			if (cnt == 0) {
	 				return 2;
	 			}
	 			return accepted ? 0 : ( rejected ? 1 : 3 );
	 		})();

	 		submissions_list[contest_id] = submissions;
	 		set_tab(tab_id);
	 		send_response({
	 			success : true
	 		});
	 	});

	 }

	/**
	 * 提出状況を返す
	 */
	 function get_submissions(info, send_response) {
	 	if ((typeof (submissions_list[current_contest_id]) === 'undefined') || !(submissions_list instanceof Array)
	 		|| !(submissions_list[current_contest_id] instanceof Array)) {
			// データが更新されるのを待つ
		waited_request = send_response;
		send_response({
			success : false
		});
	} else {
			// 現在の問題IDに一致するものだけを返す
			var submissions = submissions_list[current_contest_id].filter(function(submission) {
				return submission.problem_id === current_problem_id;
			});
			send_response({
				success : true,
				submissions : submissions,
				contest_id : current_contest_id,
				problem_id : current_problem_id,
				url_prefix : current_url_prefix
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
	 	var problem_key = info.contest_id + ',' + info.problem_id;
	 	var sample_input = info.sample_input;
	 	var sample_output = info.sample_output;

	 	sample_io_list[problem_key] = {
	 		sample_input : sample_input,
	 		sample_output : sample_output
	 	};

	 	send_response({
	 		success : true
	 	});
	 }

	 function check_login( callback ) {
	 	if ( login_flag ) {
	 		callback({
	 			login: true
	 		});
	 		return;
	 	}
	 	Codeforces.check_login(function(ret) {
	 		callback(ret);
	 	});
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
	 	} else if (type === 'update settings') {
	 		Settings.fetch();
	 		Codeforces.set_codeforces_host(Settings.get('codeforces_host').get('value'));
	 	} else if (type === 'check login') {
	 		check_login(send_response);
	 	}

	 	return true;
	 }

	 function copy_to_clipboard(data) {
	 	$('#clipboard_buffer').empty().text(data);
	 	$('#clipboard_buffer')[0].select();
	 	document.execCommand('copy');
	 }

	/**
	 * イベントとかを設定する
	 */
	 $(window).on('load', function() {
	 	$('body').empty().append('<textarea id="clipboard_buffer"></textarea>');
	 	clipboard_buffer = $('#clipboard_buffer');
	 	chrome.tabs.onHighlighted.addListener(after_tab_highlight);
	 	chrome.tabs.onUpdated.addListener(after_tab_updated);
	 	chrome.extension.onRequest.addListener(do_check_message);
	 });
	});