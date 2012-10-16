// Codeforces Library
(function(window, namespace, undefined) {
	window[namespace] = {
		/**
		 * URLから問題IDを取得する
		 * 
		 * @param url
		 */
		get_problem_id_from_url : function(url) {
		},

		/**
		 * URLからコンテストIDを取得する
		 * 
		 * @param url
		 */
		get_contest_id_from_url : function(url) {
		},

		/**
		 * 問題ページのURLかどうか調べる
		 * 
		 * @param url
		 */
		is_problem_page_url : function(url) {
			// check valid
			if (/^[^:]+:\/\/[^\/]+\/problemset\/problem\/[0-9]+\/[A-Z]+\/?$/.test(url)) {
				return true;
			}
			if (/^[^:]+:\/\/[^\/]+\/contest\/[0-9]+\/problem\/[A-Z]+\/?$/.test(url)) {
				return true;
			}
			return false;
		}
	};
})(this, 'Codeforces');
