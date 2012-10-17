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
		module('提出情報のVerdict');

		test('対応する数字に変換', function() {
			var status_list = [ 'Accepted', 'Rejected', 'Wrong answer', 'Runtime error', 'Time limit exceeded', 'Memory limit exceeded', 'Compilation error',
					'Hacked', 'Judgement failed', 'Partial', 'Presentation error', 'Idleness limit exceeded', 'Security violated', 'Denial of judgement',
					'Input preparation failed', 'Skipped', 'Running' ];
			status_list.forEach(function(status, i) {
				equal(Codeforces.get_status_id(status), i, status);
			});
			equal(Codeforces.get_status_id('Wrong answer on test 1'), Codeforces.STATUS_WRONG_ANSWER);
		});

		test('対応するテキストに変換', function() {
			var status_list = [ 'Accepted', 'Rejected', 'Wrong answer', 'Runtime error', 'Time limit exceeded', 'Memory limit exceeded', 'Compilation error',
					'Hacked', 'Judgement failed', 'Partial', 'Presentation error', 'Idleness limit exceeded', 'Security violated', 'Denial of judgement',
					'Input preparation failed', 'Skipped', 'Running' ];
			status_list.forEach(function(status, i) {
				equal(Codeforces.get_status_text(i), status, status);
			});
		});

		module('サンプル出力を取得する: get_sample_output_with_problem_id()');

		test('定義されているか', function() {
			ok(typeof (Codeforces.get_sample_output_with_problem_id) !== 'undefined');
		});

		asyncTest('ちゃんと取得できているか, contest_id = 233', function() {
			Codeforces.get_sample_output_with_problem_id(233, 'A', function(ret) {
				start();
				ok(ret !== false);
				var sample_output = ret.sample_output;
				ok(sample_output !== false);
				var expected = [ '-1', '2 1', '2 1 4 3' ];
				for ( var i = 0; i < expected.length; ++i) {
					equal(sample_output[i], expected[i]);
				}
			});
		});

		asyncTest('ちゃんと取得できているか, contest_id = 1', function() {
			Codeforces.get_sample_output_with_problem_id(1, 'B', function(ret) {
				start();
				ok(ret !== false);
				var sample_output = ret.sample_output;
				ok(sample_output !== false);
				var expected = [ 'BC23\nR23C55' ];
				for ( var i = 0; i < expected.length; ++i) {
					equal(sample_output[i], expected[i]);
				}
			});
		});

		module('サンプル入力を取得する: get_sample_input_with_problem_id()');

		test('定義されているか', function() {
			ok(typeof (Codeforces.get_sample_input_with_problem_id) !== 'undefined');
		});

		asyncTest('ちゃんと取得できているか, contest_id = 233', function() {
			Codeforces.get_sample_input_with_problem_id(233, 'A', function(ret) {
				start();
				ok(ret !== false);
				var sample_input = ret.sample_input;
				ok(sample_input !== false);
				var expected = [ '1', '2', '4' ];
				for ( var i = 0; i < expected.length; ++i) {
					equal(sample_input[i], expected[i]);
				}
			});
		});

		asyncTest('ちゃんと取得できているか, contest_id = 1', function() {
			Codeforces.get_sample_input_with_problem_id(1, 'B', function(ret) {
				start();
				ok(ret !== false);
				var sample_input = ret.sample_input;
				ok(sample_input !== false);
				var expected = [ '2\nR23C55\nBC23' ];
				for ( var i = 0; i < expected.length; ++i) {
					equal(sample_input[i], expected[i]);
				}
			});
		});

		module('提出情報取得関連: get_submissions_with_contest_id()');

		test('定義されているか', function() {
			ok(typeof (Codeforces.get_submissions_with_contest_id) !== 'undefined');
		});

		asyncTest('ちゃんと取得できているか  contest_id = 1', function() {
			Codeforces.get_submissions_with_contest_id(1, function(ret) {
				start();
				ok(ret !== false);
				var submissions = ret.submissions;
				ok(submissions !== false);
			});
		});

		asyncTest('ちゃんと取得できているか contest_id=135', function() {
			Codeforces.get_submissions_with_contest_id(135, function(ret) {
				start();
				var submissions = ret.submissions;
				ok(submissions !== false);
			});
		});

		asyncTest('不正なコンテストIDで正しい値を返しているか', function() {
			Codeforces.get_submissions_with_contest_id('aiueo', function(ret) {
				start();
				ok(ret === false);
			});
		});

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
					'http://codeforces.ru/problemset/problem/233/A/', 'http://codeforces.ru/problemset/problem/1/B',
					'http://codeforces.com/contest/135/problem/A/', 'http://codeforces.com/contest/135/problem/A',
					'http://codeforces.com/contest/135/problem/B', 'http://codeforces.com/contest/135/problem/C/',
					'http://codeforces.com/contest/135/problem/D', 'http://codeforces.com/contest/135/problem/E/',
					'http://codeforces.com/problemset/problem/233/A/', 'http://codeforces.com/problemset/problem/1/B',
					'http://codeforces.com/problemset/problem/233/a/', 'http://codeforces.com/problemset/problem/1/b',
					'http://codeforces.com/problemset/problem/233/A/?test', 'http://codeforces.com/problemset/problem/1/B?foo',
					'http://codeforces.com/problemset/problem/233/a/#bar', 'http://codeforces.com/problemset/problem/1/b?foo' ];
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

		module('URL関連: get_problem_id_from_url()');

		test('定義されているか', function() {
			ok(typeof (Codeforces.get_problem_id_from_url) !== 'undefined');
		});

		test('正常なURLを与えて正しい値を返すことを確認する', function() {
			var test_cases = [ {
				url : 'http://www.codeforces.com/contest/135/problem/A/',
				expect : 'A'
			}, {
				url : 'http://www.codeforces.com/contest/135/problem/A',
				expect : 'A'
			}, {
				url : 'http://www.codeforces.com/contest/135/problem/B',
				expect : 'B'
			}, {
				url : 'http://www.codeforces.com/contest/135/problem/C/',
				expect : 'C'
			}, {
				url : 'http://www.codeforces.com/contest/135/problem/D',
				expect : 'D'
			}, {
				url : 'http://www.codeforces.com/contest/135/problem/E/',
				expect : 'E'
			}, {
				url : 'http://www.codeforces.com/problemset/problem/233/A/',
				expect : 'A'
			}, {
				url : 'http://www.codeforces.com/problemset/problem/1/B',
				expect : 'B'
			}, {
				url : 'http://www.codeforces.ru/contest/135/problem/A/',
				expect : 'A'
			}, {
				url : 'http://www.codeforces.ru/contest/135/problem/A',
				expect : 'A'
			}, {
				url : 'http://www.codeforces.ru/contest/135/problem/B',
				expect : 'B'
			}, {
				url : 'http://www.codeforces.ru/contest/135/problem/C/',
				expect : 'C'
			}, {
				url : 'http://www.codeforces.ru/contest/135/problem/D',
				expect : 'D'
			}, {
				url : 'http://www.codeforces.ru/contest/135/problem/E/',
				expect : 'E'
			}, {
				url : 'http://www.codeforces.ru/problemset/problem/233/A/',
				expect : 'A'
			}, {
				url : 'http://www.codeforces.ru/problemset/problem/1/B',
				expect : 'B'
			}, {
				url : 'http://codeforces.ru/contest/135/problem/A/',
				expect : 'A'
			}, {
				url : 'http://codeforces.ru/contest/135/problem/A',
				expect : 'A'
			}, {
				url : 'http://codeforces.ru/contest/135/problem/B',
				expect : 'B'
			}, {
				url : 'http://codeforces.ru/contest/135/problem/C/',
				expect : 'C'
			}, {
				url : 'http://codeforces.ru/contest/135/problem/D',
				expect : 'D'
			}, {
				url : 'http://codeforces.ru/contest/135/problem/E/',
				expect : 'E'
			}, {
				url : 'http://codeforces.ru/problemset/problem/233/A/',
				expect : 'A'
			}, {
				url : 'http://codeforces.ru/problemset/problem/1/B',
				expect : 'B'
			}, {
				url : 'http://codeforces.com/contest/135/problem/A/',
				expect : 'A'
			}, {
				url : 'http://codeforces.com/contest/135/problem/A',
				expect : 'A'
			}, {
				url : 'http://codeforces.com/contest/135/problem/B',
				expect : 'B'
			}, {
				url : 'http://codeforces.com/contest/135/problem/C/',
				expect : 'C'
			}, {
				url : 'http://codeforces.com/contest/135/problem/D',
				expect : 'D'
			}, {
				url : 'http://codeforces.com/contest/135/problem/E/',
				expect : 'E'
			}, {
				url : 'http://codeforces.com/problemset/problem/233/A/',
				expect : 'A'
			}, {
				url : 'http://codeforces.com/problemset/problem/1/B',
				expect : 'B'
			}, {
				url : 'http://codeforces.com/problemset/problem/233/a/',
				expect : 'A'
			}, {
				url : 'http://codeforces.com/problemset/problem/1/b',
				expect : 'B'
			}, {
				url : 'http://codeforces.com/problemset/problem/233/A/?test',
				expect : 'A'
			}, {
				url : 'http://codeforces.com/problemset/problem/1/B?foo',
				expect : 'B'
			}, {
				url : 'http://codeforces.com/problemset/problem/233/a/#bar',
				expect : 'A'
			}, {
				url : 'http://codeforces.com/problemset/problem/1/b?foo',
				expect : 'B'
			} ];
			test_cases.forEach(function(test_case) {
				equal(Codeforces.get_problem_id_from_url(test_case.url), test_case.expect, 'URL: ' + test_case.url);
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
						ok(Codeforces.get_problem_id_from_url(url) === false, '不正なURL: ' + url);
					});

				});

		module('URL関連: get_contest_id_from_url()');

		test('定義されているか', function() {
			ok(typeof (Codeforces.get_contest_id_from_url) !== 'undefined');
		});

		test('正常なURLを与えて正しい値を返すことを確認する', function() {
			var test_cases = [ {
				url : 'http://www.codeforces.com/contest/135/problem/A/',
				expect : '135'
			}, {
				url : 'http://www.codeforces.com/contest/135/problem/A',
				expect : '135'
			}, {
				url : 'http://www.codeforces.com/contest/135/problem/B',
				expect : '135'
			}, {
				url : 'http://www.codeforces.com/contest/135/problem/C/',
				expect : '135'
			}, {
				url : 'http://www.codeforces.com/contest/135/problem/D',
				expect : '135'
			}, {
				url : 'http://www.codeforces.com/contest/135/problem/E/',
				expect : '135'
			}, {
				url : 'http://www.codeforces.com/problemset/problem/233/A/',
				expect : '233'
			}, {
				url : 'http://www.codeforces.com/problemset/problem/1/B',
				expect : '1'
			}, {
				url : 'http://www.codeforces.ru/contest/135/problem/A/',
				expect : '135'
			}, {
				url : 'http://www.codeforces.ru/contest/135/problem/A',
				expect : '135'
			}, {
				url : 'http://www.codeforces.ru/contest/135/problem/B',
				expect : '135'
			}, {
				url : 'http://www.codeforces.ru/contest/135/problem/C/',
				expect : '135'
			}, {
				url : 'http://www.codeforces.ru/contest/135/problem/D',
				expect : '135'
			}, {
				url : 'http://www.codeforces.ru/contest/135/problem/E/',
				expect : '135'
			}, {
				url : 'http://www.codeforces.ru/problemset/problem/233/A/',
				expect : '233'
			}, {
				url : 'http://www.codeforces.ru/problemset/problem/1/B',
				expect : '1'
			}, {
				url : 'http://codeforces.ru/contest/135/problem/A/',
				expect : '135'
			}, {
				url : 'http://codeforces.ru/contest/135/problem/A',
				expect : '135'
			}, {
				url : 'http://codeforces.ru/contest/135/problem/B',
				expect : '135'
			}, {
				url : 'http://codeforces.ru/contest/135/problem/C/',
				expect : '135'
			}, {
				url : 'http://codeforces.ru/contest/135/problem/D',
				expect : '135'
			}, {
				url : 'http://codeforces.ru/contest/135/problem/E/',
				expect : '135'
			}, {
				url : 'http://codeforces.ru/problemset/problem/233/A/',
				expect : '233'
			}, {
				url : 'http://codeforces.ru/problemset/problem/1/B',
				expect : '1'
			}, {
				url : 'http://codeforces.com/contest/135/problem/A/',
				expect : '135'
			}, {
				url : 'http://codeforces.com/contest/135/problem/A',
				expect : '135'
			}, {
				url : 'http://codeforces.com/contest/135/problem/B',
				expect : '135'
			}, {
				url : 'http://codeforces.com/contest/135/problem/C/',
				expect : '135'
			}, {
				url : 'http://codeforces.com/contest/135/problem/D',
				expect : '135'
			}, {
				url : 'http://codeforces.com/contest/135/problem/E/',
				expect : '135'
			}, {
				url : 'http://codeforces.com/problemset/problem/233/A/',
				expect : '233'
			}, {
				url : 'http://codeforces.com/problemset/problem/1/B',
				expect : '1'
			} ];
			test_cases.forEach(function(test_case) {
				equal(Codeforces.get_contest_id_from_url(test_case.url), test_case.expect, 'URL: ' + test_case.url);
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
						ok(Codeforces.get_contest_id_from_url(url) === false, '不正なURL: ' + url);
					});

				});
	}

})();