(function() {
  /**
   * ログインしているかどうか調べる
   */
   function check_login(callback) {
     chrome.runtime.sendMessage({
       type: 'check login'
     }, function( ret ) {
       callback( ret.login );
     });
   }

  /**
   * 問題の情報を取得する
   */
  function get_problem_info(contest_id, problem_id, after_callback) {
    var sample_input = Codeforces.get_sample_input_from_html_text(document.body.innerHTML);
    var sample_output = Codeforces.get_sample_output_from_html_text(document.body.innerHTML);
    chrome.runtime.sendMessage({
      type : 'set sample io',
      info : {
        contest_id : contest_id,
        problem_id : problem_id,
        sample_input : sample_input,
        sample_output : sample_output
      }
    });
    chrome.runtime.sendMessage({
      type: 'set submissions',
      info: {
        contest_id: contest_id,
        problem_id: problem_id
      }
    });
  }

  function say_hello() {
    chrome.runtime.sendMessage({
      type: 'hello'
    })
  }

  /**
   * 最初に実行される関数
   */
  function start() {
    check_login(function(login_flag) {
      if ( login_flag ) {
        var url = location.href;
        if (Codeforces.is_problem_page_url(url)) {
          var contest_id = Codeforces.get_contest_id_from_url(url);
          var problem_id = Codeforces.get_problem_id_from_url(url);
          get_problem_info(contest_id, problem_id, function() {
          });
        }
      }
    });
    say_hello();
  }

  // run start() function
  $(start)
})();
