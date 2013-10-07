(function() {
	/**
	 * jQueryが先に読まれるのかよく分からないので書いておく
	 */
	 var count = 0;
	 (function retry() {
	 	if (typeof (jQuery) == 'undefined' || typeof (Codeforces) == 'undefined') {
	 		if (count++ < 5) {
	 			setTimeout(retry, 250);
	 		}
	 	} else {
	 		start();
	 	}
	 })();

	/**
	 * ログインしているかどうか調べる
	 */
	 function check_login(callback) {
	 	chrome.extension.sendRequest({
	 		type: 'check login'
	 	}, function( ret ) {
	 		callback( ret.login );
	 	});
	 }

	/**
	 * 問題の情報を取得する
	 */
	 function get_problem_info(contest_id, problem_id, after_callback) {
	 	var sample_input = Codeforces.get_sample_input_from_html_text(document.body.innerHTML);
	 	var sample_output = Codeforces.get_sample_output_from_html_text(document.body.innerHTML);
	 	chrome.extension.sendRequest({
	 		type : 'set sample io',
	 		info : {
	 			contest_id : contest_id,
	 			problem_id : problem_id,
	 			sample_input : sample_input,
	 			sample_output : sample_output
	 		}
	 	});
	 	chrome.extension.sendRequest({
	 		type: 'set submissions',
	 		info: {
	 			contest_id: contest_id,
	 			problem_id: problem_id
	 		}
	 	});
	 }

	/**
	 * 順位表のデータを取得する（未使用）
	 */
	 function get_standings_data(participant_id, problem_id, callback) {
	 	var url = 'http://www.codeforces.com/data/standings';
	 	$.ajax({
	 		type : 'POST',
	 		url : url,
	 		dataType : 'json',
			// data : 'participantId=755471&problemId=1939',
			data : 'participantId=' + participant_id + '&problemId=' + problem_id,
			success : function(ret) {
				callback(ret);
			}
		});
	 }

	/**
	 * 最初に実行される関数
	 */
	 function start() {
	 	check_login(function(login_flag) {
	 		if ( login_flag ) {
	 			var url = location.href;
	 			if (Codeforces.is_problem_page_url(url)) {
	 				var contest_id = Codeforces.get_contest_id_from_url(url);
	 				var problem_id = Codeforces.get_problem_id_from_url(url);
	 				get_problem_info(contest_id, problem_id, function() {
					// TODO: 再取得させられたい場合のためにコネクション張っておくような感じでもいいかも
				});
	 			}
	 		}
	 	});
	 }
	})();
