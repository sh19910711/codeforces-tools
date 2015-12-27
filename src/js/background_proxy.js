(function() {
  "use strict";

  module.exports = class BackgroundProxy {
    hello() {
      chrome.runtime.sendMessage({
        type: "hello"
      });
    }
  }
})();
