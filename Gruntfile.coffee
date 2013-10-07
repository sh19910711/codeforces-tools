
# [a, b, c] -> {to_object(a), to_object(b), to_object(c)}
to_object = (list, to_object)->
  _ = require 'underscore'
  list.reduce(
    (obj, x) ->
      _.extend obj, to_object(x)
    {}
  )

module.exports = (grunt) ->
  _ = require 'underscore'
  init_config = {}

  # JavaScript files
  js_list = [
    'backbone.js'
    'backbone.localStorage.js'
    'background.js'
    'codeforces.js'
    'content_script.js'
    'jquery.js'
    'options.js'
    'page_action.js'
    'settings.js'
    'underscore.js'
    'utils.js'
  ]

  # uglify
  _.extend(init_config, {
    uglify:
      build:
        files:
          to_object(
            js_list
            (x) ->
              obj = {}
              obj['./dist/js/' + x] = './source/js/' + x
              obj
          )
  })

  # copy
  _.extend(init_config, {
    copy:
      build:
        files: [
          {
            cwd: './source'
            src: './source/manifest.json'
            dest: './dist/manifest.json'
          }
          {
            expand: true
            cwd: './source'
            src: ['js/*.js']
            dest: 'dist/'
          }
          {
            expand: true
            cwd: './source'
            src: ['css/*.css']
            dest: 'dist/'
          }
          {
            expand: true
            cwd: './source'
            src: ['html/*.html']
            dest: 'dist/'
          }
          {
            expand: true
            cwd: './source'
            src: ['img/*.png']
            dest: 'dist/'
          }
        ]
  })

  # Apply config
  grunt.initConfig init_config

  # load npm tasks
  pkg = grunt.file.readJSON 'package.json'
  for task of pkg.devDependencies when /^grunt-/.test task
    grunt.loadNpmTasks task

  grunt.registerTask(
    'build'
    [
      'copy'
    ]
  )
