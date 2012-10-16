//
// Codeforces Library
//  this library needs jQuery
//
(function(window, namespace, undefined) {
	var REGEXP_PROBLEMSET_PROBLEM = /^[^:]+:\/\/[^\/]+\/problemset\/problem\/([0-9]+)\/([A-Z]+)\/?$/;
	var REGEXP_CONTEST_PROBLEM = /^[^:]+:\/\/[^\/]+\/contest\/([0-9]+)\/problem\/([A-Z]+)\/?$/;

	var Codeforces = {
		/**
		 * URLから問題IDを取得する
		 * 
		 * @param url
		 */
		get_problem_id_from_url : function(url) {
			if (!Codeforces.is_problem_page_url(url)) {
				return false;
			}

			if (REGEXP_PROBLEMSET_PROBLEM.test(url)) {
				return url.match(REGEXP_PROBLEMSET_PROBLEM)[2];
			} else if (REGEXP_CONTEST_PROBLEM.test(url)) {
				return url.match(REGEXP_CONTEST_PROBLEM)[2];
			}

			return false;
		},

		/**
		 * URLからコンテストIDを取得する
		 * 
		 * @param url
		 */
		get_contest_id_from_url : function(url) {
			if (!Codeforces.is_problem_page_url(url)) {
				return false;
			}

			if (REGEXP_PROBLEMSET_PROBLEM.test(url)) {
				return url.match(REGEXP_PROBLEMSET_PROBLEM)[1];
			} else if (REGEXP_CONTEST_PROBLEM.test(url)) {
				return url.match(REGEXP_CONTEST_PROBLEM)[1];
			}

			return false;
		},

		/**
		 * 問題ページのURLかどうか調べる
		 * 
		 * @param url
		 */
		is_problem_page_url : function(url) {
			return REGEXP_PROBLEMSET_PROBLEM.test(url) || REGEXP_CONTEST_PROBLEM.test(url);
		},

		/**
		 * 与えられたHTMLデータから提出情報を取り出す
		 * 
		 * @param html_text
		 *            from http://www.codeforces.com/contest/{contest_id}/my
		 */
		get_submissions_from_html : function(html_text) {

			html_text = do_scraping(html_text);

			if ($('table.status-frame-datatable', html_text).size() == 0) {
				return false;
			}

			var res = [];
			$('table.status-frame-datatable tr[data-submission-id]', html_text).each(function() {
				res.push(get_submission_info_from_html_text($(this)));
			});
			return res;
		},

		/**
		 * [非同期] contest_idを与えると提出一覧を取得する
		 * 
		 * @param contest_id
		 * @param callback
		 *            function({submissions})
		 */
		get_submissions_with_contest_id : function(contest_id, callback) {
			if (typeof (contest_id) !== 'number') {
				callback(false);
				return;
			}
			var url = 'http://www.codeforces.com/contest/' + contest_id + '/my';
			$.ajax({
				type : 'GET',
				url : url,
				cache : false,
				success : ajax_success
			});
			function ajax_success(result) {
				var submissions = Codeforces.get_submissions_from_html(result);
				callback({
					submissions : submissions
				});
			}
		}
	};

	/**
	 * 提出情報を扱う
	 */
	var SubmissionInfo = function() {
		this.id = 0;
		this.date = '';
		this.user = '';
		this.problem_id = '';
		this.language = '';
		this.status = '';
		this.time = '';
		this.memory = '';
		this.init.apply(this, arguments);
	};

	SubmissionInfo.prototype = {
		init : function() {
			this.id = arguments[0];
			this.date = arguments[1];
			this.user = arguments[2];
			this.problem_id = arguments[3];
			this.language = arguments[4];
			this.status = arguments[5];
			this.time = arguments[6];
			this.memory = arguments[7];
		}
	};

	/**
	 * スクレイピングした提出情報をSubmissionInfoクラスに変換する
	 */
	function get_submission_info_from_html_text(html_text) {
		var list = $('td', html_text);
		var id = $.trim(list.eq(0).text());
		var date = $.trim(list.eq(1).text());
		var user = $.trim(list.eq(2).text());
		var problem_id = $.trim(Codeforces.get_problem_id_from_url(list.eq(3).children('a').data('href')));
		var language = $.trim(list.eq(4).text());
		var status = $.trim(list.eq(5).text());
		var time = $.trim(list.eq(6).text());
		var memory = $.trim(list.eq(7).text());
		return new SubmissionInfo(id, date, user, problem_id, language, status, time, memory);
	}

	/**
	 * 一部のプロパティが残っているとエラーを出すので削る
	 */
	function do_scraping(html_text) {
		return html_text.replace(/ href="/ig, ' data-href="').replace(/ src="/ig, ' data-src="');
	}

	window[namespace] = Codeforces;
})(this, 'Codeforces');
