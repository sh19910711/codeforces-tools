// Settings
// depends on Backbone.js and Underscore.js

// Model
(function( namespace ) {
	"use strict";
	var Setting = Backbone.Model.extend({
		initialize: function() {
		}
	});
	this[namespace] = Setting;
}).call(window, 'Setting');

// Collection
(function( namespace ) {
	"use strict";
	var Settings = Backbone.Collection.extend({
		model: Setting,
		initialize: function() {
			this.fetch();
		},
		localStorage: new Backbone.LocalStorage('settings')
	});
	var settings = new Settings();
	this[namespace] = settings;
}).call(window, 'Settings');