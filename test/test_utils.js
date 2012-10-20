(function() {
	var count = 0;
	(function retry() {
		if (typeof (jQuery) == 'undefined') {
			if (count++ < 5) {
				setTimeout(retry, 250);
			}
		} else {
			$(init);
		}
	})();

	function init() {
		module('URL関連');
		test(
				'URLのprefix部分（scheme://domain）までを取得する',
				function() {
					equal(
							Utils
									.get_url_prefix('https://www.google.co.jp/search?num=50&hl=ja&newwindow=1&safe=off&site=&source=hp&q=URL+regexp&oq=URL+regexp&gs_l=hp.3..0j0i10i30l3j0i30j0i10i30l4j0i30.402.1769.0.2007.10.10.0.0.0.0.145.985.3j7.10.0...0.0...1c.1j4.47RNOL2VItg'),
							'https://www.google.co.jp');
					equal(Utils.get_url_prefix('http://www.codeforces.com/'), 'http://www.codeforces.com');
					equal(Utils.get_url_prefix('http://www.codeforces.com'), 'http://www.codeforces.com');
					equal(Utils.get_url_prefix('http://www.codeforces.ru/'), 'http://www.codeforces.ru');
					equal(Utils.get_url_prefix('http://www.codeforces.ru'), 'http://www.codeforces.ru');
					equal(Utils.get_url_prefix('http://codeforces.com/'), 'http://codeforces.com');
					equal(Utils.get_url_prefix('http://codeforces.com'), 'http://codeforces.com');
					equal(Utils.get_url_prefix('http://codeforces.ru/'), 'http://codeforces.ru');
					equal(Utils.get_url_prefix('http://codeforces.ru'), 'http://codeforces.ru');
					equal(Utils.get_url_prefix('http://codeforces.com/aiueo'), 'http://codeforces.com');
					equal(Utils.get_url_prefix('http://codeforces.com?test'), 'http://codeforces.com');
					equal(Utils.get_url_prefix('http://codeforces.ru/#test'), 'http://codeforces.ru');
					equal(Utils.get_url_prefix('http://codeforces.ru?test#test'), 'http://codeforces.ru');
				});
	}

})();