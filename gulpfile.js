const gulp = require('gulp'),
  nodemon = require('gulp-nodemon'),
  plumber = require('gulp-plumber'),
  livereload = require('gulp-livereload'),
  jshint = require('gulp-jshint'),
  gutil = require('gulp-util'),
  sass = require('gulp-sass'),
  fs = require('fs-extra');
const exec = require('child_process').exec;

const jsSrc = ['app.js', 'lib/**/*.js', 'app/**/*.js', './public/js/**/*.js'];

// Initialize required directories
gulp.task('init', () => {
  gutil.log('Synchronously creating required directories');
  fs.ensureDirSync('./public/');
  fs.ensureDirSync('./data/');
  fs.ensureDirSync('./logs/');
  fs.ensureDirSync('./etc/');
  fs.ensureDirSync('./etc/backup/');
  fs.ensureDirSync('./etc/backup/ssl/');
  fs.ensureDirSync('./resources/');
  // Add any other required directories here
});

// Lint Task
gulp.task('lint', () => {
  gulp.src(jsSrc)
    .pipe(jshint({ esversion: 6, node: true }))
    .pipe(jshint.reporter('default', {verbose: true}));

  // And also report file annotation counts
  exec('resources/counts.sh', (err, stdout, stderr) => {
    if (err) console.log("Couldn't run annotation counting script: ", err);
    console.log(stdout);
  });
});

gulp.task('sass', () => {
  gulp.src('./sass/style.scss')
    .pipe(plumber())
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./public/css'))
    .pipe(livereload());
});

gulp.task('watch', () => {
  gulp.watch('./sass/**/*.scss', ['sass']);
  gulp.watch(jsSrc, ['lint']);
});

gulp.task('develop', ['init'], () => {
  livereload.listen();
  nodemon({
    script: 'app.js',
    ext: 'js njk',
    ignore: ['data/', 'dist/']
  }).on('restart', () => {
    setTimeout( () => {
      livereload.changed(__dirname);
    }, 500);
  });
});

gulp.task('default', [
  'init',
  'lint',
  'sass',
  'develop',
  'watch'
]);
