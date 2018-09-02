var gulp = require("gulp");
var concat = require("gulp-concat");

gulp.task("copy-index-html", function() {
  gulp.src("./index.html").pipe(gulp.dest("./dist"));
});

gulp.task("copy-restaurant-html", function() {
  gulp.src("./restaurant.html").pipe(gulp.dest("./dist"));
});

gulp.task("sw-scripts", function() {
  gulp.src("./sw.js").pipe(gulp.dest("./dist"));
});

gulp.task("swr-scripts", function() {
  gulp.src("./swRegisterer.js").pipe(gulp.dest("./dist"));
});

gulp.task("scripts", function() {
  gulp
    .src("js/*.js")
    .pipe(concat("all.js"))
    .pipe(gulp.dest("dist/js"));
});

gulp.task("copy-styles", function() {
  gulp.src("css/*").pipe(gulp.dest("./dist/css"));
});

gulp.task("copy-images", function() {
  gulp.src("img/*/*.jpg").pipe(gulp.dest("./dist/img"));
});
