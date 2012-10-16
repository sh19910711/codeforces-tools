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
		var url = location.href;
		console.log('@content_script: url = ', url);
		if (Codeforces.is_problem_page_url(url)) {
		}
	}
})();
