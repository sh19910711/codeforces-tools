//
// Codeforces Library
//  this library needs jQuery
//
(function(window, namespace, undefined) {
	var REGEXP_PROBLEMSET_PROBLEM = /^([^:]+:\/\/[^\/]+)?\/problemset\/problem\/([0-9]+)\/([0A-Za-z]+)\/?([\?#].*)?$/;
	var REGEXP_CONTEST_PROBLEM = /^([^:]+:\/\/[^\/]+)?\/contest\/([0-9]+)\/problem\/([0A-Za-z]+)\/?([\?#].*)?$/;
	var CODEFORCES_HOST = 'http://www.codeforces.com';

	var Codeforces = {
		STATUS_SHORT_NAME : [ 'AC', 'WA', 'WA', 'RE', 'TLE', 'MLE', 'CE', 'WA', 'WA', 'WA', 'PE', 'ILE', 'SV', 'DJ', 'IPF', 'SK', '?' ],
		/*
		 * remains color 'Runtime error', 'Time limit exceeded', 'Memory limit
		 * exceeded', 'Compilation error', 'Hacked', 'Judgement failed',
		 * 'Partial', 'Presentation error', 'Idleness limit exceeded', 'Security
		 * violated', 'Denial of judgement', 'Input preparation failed',
		 * 'Skipped', 'Running'
		 */
		 STATUS_COLOR : [ 'rgba(0, 204, 0, 0.75)', 'rgba(0, 0, 204, 0.65)', 'rgba(0, 0, 204, 0.65)' ],
		 STATUS_ACCEPTED : 0,
		 STATUS_REJECTED : 1,
		 STATUS_WRONG_ANSWER : 2,
		 STATUS_RUNTIME_ERROR : 3,
		 STATUS_TIME_LIMIT_EXCEEDED : 4,
		 STATUS_MEMORY_LIMIT_EXCEEDED : 5,
		 STATUS_COMPILATION_ERROR : 6,
		 STATUS_CHALLENGED : 7,
		 STATUS_FAILED : 8,
		 STATUS_PARTIAL : 9,
		 STATUS_PRESENTATION_ERROR : 10,
		 STATUS_IDLENESS_LIMIT_EXCEEDED : 11,
		 STATUS_SECURITY_VIOLATED : 12,
		 STATUS_CRASHED : 13,
		 STATUS_INPUT_PREPARATION_CRASHED : 14,
		 STATUS_SKIPPED : 15,
		 STATUS_TESTING : 16,

		 get_status_color : function(status_id) {
		 	if (typeof (Codeforces.STATUS_COLOR[status_id]) === 'undefined') {
		 		return 'rgba(0,0,0,1);';
		 	}
		 	return Codeforces.STATUS_COLOR[status_id];
		 },

		/**
		 * Status TextをIDに変換する
		 * 
		 * @param status_text
		 * @returns
		 */
		 get_status_id : function(status_text) {
		 	var status_list = [ 'Accepted', 'Rejected', 'Wrong answer', 'Runtime error', 'Time limit exceeded', 'Memory limit exceeded', 'Compilation error',
		 	'Hacked', 'Judgement failed', 'Partial', 'Presentation error', 'Idleness limit exceeded', 'Security violated', 'Denial of judgement',
		 	'Input preparation failed', 'Skipped', 'Running' ];
		 	var status_list_russian = [ 'Полное решение', 'Попытка не зачтена', 'Неправильный ответ', 'Ошибка времени', 'исполнения',
		 	'Превышено ограничение времени', 'Превышено ограничение памяти', 'Ошибка компиляции', 'Решение взломано', 'Ошибка тестирования',
		 	'Частичное', 'Ошибка представления данных', 'Решение зависло', 'Безопасность нарушена', 'Отказ тестирования',
		 	'Подготовка входных данных не удалась', 'Попытка игнорирована', 'Выполняется' ];
		 	for ( var i = 0; i < status_list.length; ++i) {
		 		if (status_text.indexOf('Pretests passed') !== -1) {
		 			return 0;
		 		} else if (status_text.indexOf(status_list[i]) !== -1) {
		 			return i;
		 		} else if (status_text.indexOf(status_list_russian[i]) !== -1) {
		 			return i;
		 		}
		 	}
		 	return false;
		 },

		/**
		 * IDを対応するStatusテキストに変換する
		 * 
		 * @param status_id
		 */
		 get_status_text : function(status_id) {
		 	var status_list = [ 'Accepted', 'Rejected', 'Wrong answer', 'Runtime error', 'Time limit exceeded', 'Memory limit exceeded', 'Compilation error',
		 	'Hacked', 'Judgement failed', 'Partial', 'Presentation error', 'Idleness limit exceeded', 'Security violated', 'Denial of judgement',
		 	'Input preparation failed', 'Skipped', 'Running' ];
		 	return status_list[status_id];
		 },

		/**
		 * IDを対応するStatus classに変換する
		 * 
		 * @param status_id
		 */
		 get_status_class : function(status_id) {
		 	var status_class = [ 'accepted', 'rejected', 'wrong-answer', 'runtime-error', 'time-limit-exceeded', 'memory-limit-exceeded', 'compilation-error',
		 	'hacked', 'judgement-failed', 'partial', 'presentation-error', 'idleness-limit-exceeded', 'security-violated', 'denial-of-judgement',
		 	'input-preparation-failed', 'skipped', 'running' ];
		 	return status_class[status_id];
		 },

		/**
		 * URLから問題IDを取得する
		 * 
		 * @param url
		 */
		 get_problem_id_from_url : function(url) {
		 	if (!Codeforces.is_problem_page_url(url)) {
		 		return false;
		 	}

		 	var problem_id = undefined;
		 	if (REGEXP_PROBLEMSET_PROBLEM.test(url)) {
		 		problem_id = url.match(REGEXP_PROBLEMSET_PROBLEM)[3].toUpperCase();
		 	} else if (REGEXP_CONTEST_PROBLEM.test(url)) {
		 		problem_id = url.match(REGEXP_CONTEST_PROBLEM)[3].toUpperCase();
		 	} else {
		 		return false;
		 	}

		 	if (problem_id === '0') {
		 		return 'A';
		 	}
		 	return problem_id;
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
		 		return $.trim(url.match(REGEXP_PROBLEMSET_PROBLEM)[2]);
		 	} else if (REGEXP_CONTEST_PROBLEM.test(url)) {
		 		return $.trim(url.match(REGEXP_CONTEST_PROBLEM)[2]);
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
		 *            from /contest/{contest_id}/my
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
		 	if (/[^0-9]/.test(contest_id)) {
		 		callback(false);
		 		return;
		 	}

		 	var url = CODEFORCES_HOST + '/contest/' + contest_id + '/my';
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
		 },

		/**
		 * 問題のサンプル出力を取得する
		 * 
		 * @param html_text
		 *            from
		 *            http://www.codeforces.com/problemset/problem/{contest_id}/{problem_id}
		 * @returns
		 */
		 get_sample_output_from_html_text : function(html_text) {
		 	html_text = do_scraping(html_text);
		 	var res = $('div.sample-test>div.output>pre', html_text).map(function(i, html_element) {
		 		return $.trim($(html_element).html().replace(/<br>/ig, '\n').replace(/&lt;/g, '<').replace(/&gt;/g, '>'));
		 	});
		 	return Array.prototype.slice.apply(res);
		 },

		/**
		 * 問題のサンプル出力を取得する
		 * 
		 * @param contest_id
		 * @param problem_id
		 * @param callback
		 */
		 get_sample_output_with_problem_id : function(contest_id, problem_id, callback) {
		 	if (is_invalid_contest_problem(contest_id, problem_id)) {
		 		callback(false);
		 		return;
		 	}

		 	var url = CODEFORCES_HOST + '/problemset/problem/' + contest_id + '/' + problem_id;
		 	$.ajax({
		 		type : 'GET',
		 		url : url,
		 		cache : false,
		 		success : ajax_success
		 	});
		 	function ajax_success(result) {
		 		var sample_output = Codeforces.get_sample_output_from_html_text(result);
		 		callback({
		 			sample_output : sample_output
		 		});
		 	}
		 },

		/**
		 * 問題のサンプル入力を取得する
		 * 
		 * @param html_text
		 *            from
		 *            http://www.codeforces.com/problemset/problem/{contest_id}/{problem_id}
		 * @returns
		 */
		 get_sample_input_from_html_text : function(html_text) {
		 	html_text = do_scraping(html_text);
		 	var res = $('div.sample-test>div.input>pre', html_text).map(function(i, html_element) {
		 		return $.trim($(html_element).html().replace(/<br>/ig, '\n').replace(/&lt;/g, '<').replace(/&gt;/g, '>'));
		 	});
		 	return Array.prototype.slice.apply(res);
		 },

		/**
		 * 問題のサンプル入力を取得する
		 * 
		 * @param contest_id
		 * @param problem_id
		 * @param callback
		 */
		 get_sample_input_with_problem_id : function(contest_id, problem_id, callback) {
		 	if (is_invalid_contest_problem(contest_id, problem_id)) {
		 		callback(false);
		 		return;
		 	}

		 	var url = CODEFORCES_HOST + '/problemset/problem/' + contest_id + '/' + problem_id;
		 	$.ajax({
		 		type : 'GET',
		 		url : url,
		 		cache : false,
		 		success : ajax_success
		 	});
		 	function ajax_success(result) {
		 		var sample_input = Codeforces.get_sample_input_from_html_text(result);
		 		callback({
		 			sample_input : sample_input
		 		});
		 	}
		 },

		/**
		 * Codeforcesのホスト名を設定する
		 */
		 set_codeforces_host: function( hostname ) {
		 	CODEFORCES_HOST = 'http://'+hostname;
		 },

		/*
		 * ログインしているかどうか調べる
		 */
		 check_login: function(callback) {
		 	$.get(CODEFORCES_HOST, function(ret) {
		 		var login_flag = false;
		 		ret = ret.replace(/href/ig, 'data-href').replace(/src/ig, 'data-src');
		 		$('#header div.lang-chooser a', ret).each(function() {
		 			if ($(this).text() === 'Logout' || $(this).text() === 'Выйти') {
		 				login_flag = true;
		 				callback({
		 					login: true
		 				});
		 			}
		 		});
		 		if ( ! login_flag )
		 			callback({
		 				login:false
		 			});
		 	});
		 }
		};

		function is_invalid_contest_problem(contest_id, problem_id) {
			return (/[^0-9]/.test(contest_id)) || (/[^A-Za-z0-9]/.test(problem_id));
		}

	/**
	 * 提出情報を扱う
	 */
	 var SubmissionInfo = function() {
	 	this.id = 0;
	 	this.date = '';
	 	this.user = '';
	 	this.problem_id = '';
	 	this.language = '';
	 	this.status = -1;
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
	 	var problem_url = list.eq(3).children('a').data('href') || list.eq(3).children('a').attr('href');
	 	var problem_id = $.trim(Codeforces.get_problem_id_from_url(problem_url));
	 	var language = $.trim(list.eq(4).text());
	 	var status = Codeforces.get_status_id($.trim(list.eq(5).text()));
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
