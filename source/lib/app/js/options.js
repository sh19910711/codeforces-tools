$(function() {
	var TextSettingView = Backbone.View.extend({
		tagName: 'input',
		events: {
			'keyup': 'keyup'
		},
		keyup: function() {
			this.model.set('value', this.$el.val());
			Settings.localStorage.update(this.model);
			Settings.fetch();
			chrome.extension.sendRequest({
				type: 'update settings'
			});
		},
		initialize: function(_model) {
			_.bindAll(this, 'render', 'keyup');
			this.model = _model;
			if ( this.model === undefined ) {
				Settings.create(new Setting({
					id: name,
					value: ''
				}));
				Settings.fetch();
				this.model = Settings.get(name);
			}
		},
		render: function() {
			this.$el.attr('type', 'text');
			this.$el.val(this.model.get('value'));
			return this;
		}
	});

	var views = {
		codeforces_host: new TextSettingView(Settings.get('codeforces_host'))
	};

	var body_element = $('#outer_wrapper');
	(function() {
		var input_element = views.codeforces_host.render().$el;
		input_element.attr('placeholder', 'Default: www.codeforces.com');
		var wrapper = $('<div class="box"></div>');
		wrapper.append('<h2 class="subject">Domain name setting</h2>');
		wrapper.append(input_element);
		wrapper.append('<p><span class="info">Info</span>: Enter the domain which your account is logged in.</p>');
		body_element.append(wrapper);
	})();
});