(function() {
  "use strict";
  const BackgroundProxy = require('./background_proxy');
  const proxy = new BackgroundProxy;
  proxy.hello();
})()
