//
// Codeforces Library
//  this library needs jQuery
//
(function(window, namespace, undefined) {
	var Utils = {
		get_url_prefix : function(url) {
			var regexp = /(https?:\/\/[^\/\?\#]+)/;
			if (regexp.test(url) !== true) {
				return false;
			}
			return url.match(regexp)[1];
		}
	};
	window[namespace] = Utils;
})(this, 'Utils');
