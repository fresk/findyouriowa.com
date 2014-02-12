var gulp = require('gulp');
var jshint = require('gulp-jshint');
var watch = require('gulp-watch');
var browserify = require('gulp-browserify');  
var stylus = require('gulp-stylus');
var imagemin = require('gulp-imagemin');
var livereload = require('gulp-livereload');
var lr = require('tiny-lr');
var nodemon = require('gulp-nodemon');



//just build by default
gulp.task('default', ['build']);

//lint everything and build client
gulp.task('build', ['lint', 'client', 'stylus', 'images']);

//build and serve using nodemon.
gulp.task('serve', ['build'], function () {
  nodemon({ script: 'app.js'});
});

//run devserver with livereload.
gulp.task('develop', ['livereload', 'serve']);


var paths = {
  all: ['./**/*.js', '!./node_modules/**','!./client/js/vendor/**'],
  stylesheets: './**/*.styl' ,
  images: './client/img/**/*'
};


// lint all the js things belonging to us
gulp.task('lint', function () {
  jsfiles = ['./**/*.js', '!./node_modules/**','!./client/js/vendor/**'];
  return gulp.src(jsfiles)
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});


// build client app into client/js
gulp.task('client', function() {
  return gulp.src('./client/js/main.js')
    .pipe(browserify())
    .pipe(gulp.dest('./client/js'));
});


// compile and copy any stylus or css files to client/css fodler
gulp.task('stylus', function(){
  return gulp.src("./client/css/**/*.styl")
    .pipe(stylus())
    .pipe(gulp.dest('./client/css'));
});


// optimize and opy all static images to client/img
gulp.task('images', function() {
 return gulp.src('./client/img/*')
    .pipe(imagemin({optimizationLevel: 5}))
    .pipe(gulp.dest('./build/img'));
});


gulp.task('livereload', function(next){
  // watch client sources to rebuild on change
  gulp.watch('./client/css/*', ['stylus']);

  //run livereload server to auto refresh browser
  var lr_server = lr();
  lr_server.listen(35729, function(err) {
    if (err) return console.error(err);
    next();
  });  
  
  //notify livereload server of changes on frontend files
  gulp.src(['./client/**/*.css', './client/**/*.html', './views/**/*.jade'])
    .pipe(watch())
    .pipe(livereload(lr_server));

});



