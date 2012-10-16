module('URL関連: is_problem_page_url()');

test('定義されているか', function() {
	ok(typeof (Codeforces.is_problem_page_url) !== 'undefined');
});

test('正常なURLを与えて正しい値（true）を返すことを確認する', function() {
	var url_list = [ 'http://www.codeforces.com/contest/135/problem/A/', 'http://www.codeforces.com/contest/135/problem/A',
			'http://www.codeforces.com/contest/135/problem/B', 'http://www.codeforces.com/contest/135/problem/C/',
			'http://www.codeforces.com/contest/135/problem/D', 'http://www.codeforces.com/contest/135/problem/E/',
			'http://www.codeforces.com/problemset/problem/233/A/', 'http://www.codeforces.com/problemset/problem/1/B',
			'http://www.codeforces.ru/contest/135/problem/A/', 'http://www.codeforces.ru/contest/135/problem/A',
			'http://www.codeforces.ru/contest/135/problem/B', 'http://www.codeforces.ru/contest/135/problem/C/',
			'http://www.codeforces.ru/contest/135/problem/D', 'http://www.codeforces.ru/contest/135/problem/E/',
			'http://www.codeforces.ru/problemset/problem/233/A/', 'http://www.codeforces.ru/problemset/problem/1/B',
			'http://codeforces.ru/contest/135/problem/A/', 'http://codeforces.ru/contest/135/problem/A', 'http://codeforces.ru/contest/135/problem/B',
			'http://codeforces.ru/contest/135/problem/C/', 'http://codeforces.ru/contest/135/problem/D', 'http://codeforces.ru/contest/135/problem/E/',
			'http://codeforces.ru/problemset/problem/233/A/', 'http://codeforces.ru/problemset/problem/1/B', 'http://codeforces.com/contest/135/problem/A/',
			'http://codeforces.com/contest/135/problem/A', 'http://codeforces.com/contest/135/problem/B', 'http://codeforces.com/contest/135/problem/C/',
			'http://codeforces.com/contest/135/problem/D', 'http://codeforces.com/contest/135/problem/E/', 'http://codeforces.com/problemset/problem/233/A/',
			'http://codeforces.com/problemset/problem/1/B' ];
	url_list.forEach(function(url) {
		ok(Codeforces.is_problem_page_url(url) === true, '正常なURL: ' + url);
	});
});

test(
		'不正なURLを与えて正しい値（false）を返すことを確認する',
		function() {
			var url_list = [
					'aiueo',
					'https://www.google.co.jp/webhp?hl=ja&tab=ww',
					'http://www.codeforces.com/',
					'http://www.codeforces.com/problemset/',
					'http://www.codeforces.com/contest/1/my/',
					'http://www.codeforces.com/contest/135/my/',
					'http://www.codeforces.com/contest/135/problem/',
					'http://www.codeforces.ru/contest/135/problem/',
					'http://codeforces.ru/contest/problem/A',
					'http://codeforces.com/contest/problem/A',
					'http://www.codeforces.com/contest/135/problem//',
					'http://www.codeforces.ru/contest/135/problem//',
					'http://www.codeforces.ru/contest/135/problem/A//',
					'http://www.codeforces.ru/contest//135/problem/A',
					'http://www.codeforces.ru/contest/135/problem//B',
					'http://www.codeforces.ru/contest/135/problem//C/',
					'http://www.codeforces.ru/contest//problem/A/',
					'http://www.codeforces.ru/contest/135/problems/A',
					'http://www.codeforces.ru/contest/135/problm/B',
					'http://www.codeforces.ru/contests/135/problem/C/',
					'http://lab.komadoya.com/blog/2009/06/jquery-ready.php',
					'https://www.google.co.jp/search?num=50&hl=ja&newwindow=1&safe=off&site=&source=hp&q=jQuery%E3%81%8C%E8%AA%AD%E3%81%BF%E8%BE%BC%E3%81%BE%E3%82%8C%E3%81%A6%E3%81%84%E3%82%8B%E3%81%8B&oq=jQuery%E3%81%8C%E8%AA%AD%E3%81%BF%E8%BE%BC%E3%81%BE%E3%82%8C%E3%81%A6%E3%81%84%E3%82%8B%E3%81%8B&gs_l=hp.3..0.366.4747.0.5045.27.27.0.0.0.8.177.3063.13j14.27.0...0.0...1c.1j4.H4SIvjle0N4' ];
			url_list.forEach(function(url) {
				ok(Codeforces.is_problem_page_url(url) === false, '不正なURL: ' + url);
			});
		});