module.exports =
  context: __dirname + "/../src/"
  entry:
    background: "./js/background.js"
    page_action: "./js/page_action.js"
    content_script: "./js/content_script.js"
    options: "./js/options.js"
  output:
    path: __dirname + "/../dist/js/"
    filename: "[name].js"
