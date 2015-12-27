(function() {
  "use strict";

  window.BackgroundProxy = class BackgroundProxy {
    hello() {
      chrome.runtime.sendMessage({
        type: "hello"
      });
    }
  }
})();
