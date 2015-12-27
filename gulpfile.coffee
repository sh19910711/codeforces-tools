gulp = require("gulp")

gulp.task "build", [
  "manifest.json"
  "js"
  "img"
  "html"
  "css"
]

gulp.task "watch", ->
  gulp.watch ["src/js/**/*.js"], ["js"]
  gulp.watch ["src/manifest.json"], ["manifest.json"]
  gulp.watch ["src/css/**/*.css"], ["css"]
  gulp.watch ["src/html/**/*.html"], ["html"]
  gulp.watch ["src/img/**/*.png"], ["img"]

gulp.task "manifest.json", ->
  gulp.src ["src/manifest.json"]
    .pipe gulp.dest("dist/")

gulp.task "js", ->
  webpack = require("gulp-webpack")
  config = require("./config/webpack")
  gulp.src ["src/js/**/*.js"]
    .pipe webpack(config)
    .pipe gulp.dest("dist/js/")

gulp.task "html", ->
  gulp.src ["src/html/**/*.html"]
    .pipe gulp.dest("dist/html/")

gulp.task "css", ->
  gulp.src ["src/css/**/*.css"]
    .pipe gulp.dest("dist/css/")

gulp.task "img", ->
  gulp.src ["src/img/**/*.png"]
    .pipe gulp.dest("dist/img/")
