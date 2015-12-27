// Settings
(function() {
  'use strict';
  const Backbone = require('backbone')
  require('backbone.localstorage');

  var Setting = Backbone.Model.extend({
    initialize: function() {
    }
  });

  module.exports = Backbone.Collection.extend({
    model: Setting,
    initialize: function() {
      this.fetch();
    },
    localStorage: new Backbone.LocalStorage('settings')
  });
}).call(window, 'Settings');
