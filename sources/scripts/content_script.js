(function() {
	var login_flag = false;

	/**
	 * jQueryが先に読まれるのかよく分からないので書いておく
	 */
	var count = 0;
	(function retry() {
		if (typeof (jQuery) == 'undefined') {
			if (count++ < 5) {
				setTimeout(retry, 250);
			}
		} else {
			$(start);
		}
	})();

	/**
	 * ログインしているかどうか調べる
	 */
	function check_login() {
		login_flag = false;
		$('#header div.lang-chooser a').each(function() {
			if ($(this).attr('href') === '/logout') {
				login_flag = true;
			}
		});
		chrome.extension.sendMessage({
			type : 'set login flag',
			info : {
				login_flag : login_flag
			}
		});
	}

	/**
	 * 問題の情報を取得する
	 */
	function get_problem_info(contest_id, problem_id, after_callback) {
		var sample_input = Codeforces.get_sample_input_from_html_text(document.body.innerHTML);
		var sample_output = Codeforces.get_sample_output_from_html_text(document.body.innerHTML);
		chrome.extension.sendMessage({
			type : 'set sample io',
			info : {
				contest_id : contest_id,
				problem_id : problem_id,
				sample_input : sample_input,
				sample_output : sample_output
			}
		}, function(ret) {
		});
		if (!login_flag) {
			return;
		}
		Codeforces.get_submissions_with_contest_id(contest_id, function(ret) {
			if (!login_flag) {
				return;
			}
			var submissions = ret.submissions;
			// 取得後はbackgroundにデータを送る
			chrome.extension.sendMessage({
				type : 'set submissions',
				info : {
					contest_id : contest_id,
					problem_id : problem_id,
					submissions : submissions
				}
			}, function(ret) {
				if (ret.success === false) {
					throw new Error;
				}
			});
		});

	}

	/**
	 * 最初に実行される関数
	 */
	function start() {
		check_login();
		if (!login_flag) {
			return;
		}

		var url = location.href;
		if (Codeforces.is_problem_page_url(url)) {
			var contest_id = Codeforces.get_contest_id_from_url(url);
			var problem_id = Codeforces.get_problem_id_from_url(url);
			get_problem_info(contest_id, problem_id, function() {
				// TODO: 再取得させられたい場合のためにコネクション張っておくような感じでもいいかも
			});
		}
	}

	$(window).on('beforeunload', function() {
		// TODO: ウィンドウが閉じられたときの処理
	});
})();
