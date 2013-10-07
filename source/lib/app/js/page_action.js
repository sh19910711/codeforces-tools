$(function() {
	function init() {
		var body;
		var status_text;
		var current_contest_id; // 表示している問題のコンテストID
		var current_problem_id; // 表示している問題のID
		var current_submissions = [];
		var current_url_prefix = 'http://www.codeforces.com';
		var timeout_id = false; // 提出取得時タイムアウトしたとき用

		set_html();
		set_event();

		function generate_wait_submissions() {
			chrome.extension.sendRequest({
				type : 'wait submissions',
			}, function(ret) {
				set_html();
				set_event();

				// 新しいデータが届いた
				if (ret.success) {
					ret.submissions.forEach(function(submission) {
						current_submissions[submission.id] = submission;
					});
					set_submissions(ret.submissions);
					set_submissions_event();
					current_contest_id = ret.contest_id;
					current_problem_id = ret.problem_id;
					current_url_prefix = ret.url_prefix;
					clearTimeout(timeout_id);
				} else {
					timeout_id = setTimeout(function() {
						status_text.text('Timeout.');
						$('').append('<p>hoge</p>');
					}, 1000);
				}

				generate_wait_submissions();
			});
		}

		// 表示すべきデータをもらいに行く
		chrome.extension.sendRequest({
			type : 'get submissions'
		}, function(ret) {
			// 無ければ待つ、あったら更新してさらに新しいデータが届くのを待つ
			// ページアクションが閉じたときに後者のコールバックを破棄する処理が必要かもしれない
			if (ret.success) {
				ret.submissions.forEach(function(submission) {
					current_submissions[submission.id] = submission;
				});
				set_submissions(ret.submissions);
				set_submissions_event();
				current_contest_id = ret.contest_id;
				current_problem_id = ret.problem_id;
				current_url_prefix = ret.url_prefix;
				clearTimeout(timeout_id);
			} else {
				timeout_id = setTimeout(function() {
					status_text.text('Timeout.');
					body.append('<p>The Codeforces\'s server might have been down. Please wait a moment and try again.<br>If you\'ve logged in codeforces.ru, codeforces.com or etc..., please see <a target="_blank" href="options.html">the settings page</a>.</p>');
				}, 3000);
			}
			generate_wait_submissions();
		});

		/**
		 * HTML関連の設定
		 */
		function set_html() {
			body = $('body');
			// HTML設定
			body.empty();
			body.append('<div id="status">Solved Status: <span class="text"></span></div>');
			body
					.append('<div id="footer"><a target="_blank" href="options.html">Settings</a> - Codeforces Tools Version <span class="version"></span><br>(C) Copyright 2012-2013 Hiroyuki Sano</div>');
			status_text = $('#status .text');
			$.getJSON('manifest.json', function(ret) {
				$('#footer>.version').text(ret.version);
			});
			status_text.text('Loading...');
		}

		/**
		 * イベントの設定
		 */
		function set_event() {
		}

		/**
		 * 提出したコードのページを開く
		 */
		function open_submission_page(contest_id, submission_id) {
			// http://www.codeforces.com/contest/{contest_id}/submission/{submission_id}
			var url = current_url_prefix + '/contest/' + current_contest_id + '/submission/' + submission_id;
			window.open(url);
		}

		/**
		 * 提出関連のイベント設定
		 */
		function set_submissions_event() {
			var info_text = $('#submissions .info .text');
			$('#submissions').on('click', '.submission-status', function() {
				open_submission_page(current_contest_id, $(this).data('id'));
			});
			$('#submissions').on('mouseenter', '.submission-status', function() {
				var submission_id = $(this).data('id');
				var submission = current_submissions[submission_id];
				info_text.text(Codeforces.get_status_text(submission.status) + ': ' + submission.language + ', ' + submission.time + ', ' + submission.memory);
			}).on('mouseleave', '.submission-status', function() {
				info_text.text('Click to open the solution.');
			});
		}

		/**
		 * 提出状況などを確認できるようにする
		 */
		function set_submissions(submissions) {
			$('#submissions').remove();
			if (submissions.length == 0) {
				status_text.html('No submission');
			} else {
				body
						.append('<div id="submissions"><h2 class="subject">Submissions</h2><div class="text"></div><div class="info"><span class="gray">Info:</span><br><span class="text">Click to open the solution.</span></div></div>');

				// Status
				var accepted = submissions.some(function(submission) {
					return submission.status === Codeforces.STATUS_ACCEPTED;
				});
				status_text.html(accepted ? '<span class="accepted">Accepted</span>' : '<span class="rejected">Rejected</span>');

				// Submissions
				var submissions_list = submissions.map(function(submission) {
					var res = $('<span class="submission-status"></span>');
					res.addClass(Codeforces.get_status_class(submission.status));
					res.attr('data-status', Codeforces.get_status_class(submission.status));
					res.attr('data-id', submission.id);
					return res;
				});
				$('#submissions > .text').empty().append(submissions_list);
			}
		}
	}

	$(window).on('load', init);
});
