'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var browserSync = require('browser-sync').create();
var eslint = require('gulp-eslint');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var cleanCSS = require('gulp-clean-css');
var mergeStream = require('merge-stream');

gulp.task('default', ['copy', 'sass', 'css', 'lint', 'scripts'], function() {
	gulp.watch('src/sass/**/*.scss', ['sass']);
	gulp.watch('src/css/**/*.css', ['css']);
	gulp.watch('src/js/**/*.js', ['scripts','lint']);
	gulp.watch('src/*.html', ['copy']);
	gulp.watch('./dist/index.html').on('change', browserSync.reload);

	browserSync.init({
		server: 'dist'
	});
});

gulp.task('dist', [
	'copy',
	'sass',
	'css',
	'lint',
	'scripts-dist'
]);

gulp.task('scripts', function() {
	gulp.src(['src/js/jquery.js', 'src/js/papaparse.min.js','src/js/gtfs.js','src/js/app.js'])
		.pipe(concat('all.js'))
		.pipe(uglify('all.js'))
		.pipe(gulp.dest('dist/js'));
});

// copy over index, images, data, and serviceworker.
gulp.task('copy', function() {
	return mergeStream(
    	gulp.src('src/*.html').pipe(gulp.dest('dist')),
    	gulp.src('src/img/*').pipe(gulp.dest('dist/img')),
    	gulp.src('src/data/*').pipe(gulp.dest('dist/data'))
  	);
});

gulp.task('sass', function() {
	gulp.src('src/sass/**/*.scss')
		.pipe(sass({
			outputStyle: 'compressed'
		}).on('error', sass.logError))
		.pipe(autoprefixer({
			browsers: ['last 2 versions']
		}))
		.pipe(gulp.dest('src/css'))
		.pipe(browserSync.stream());
});

gulp.task('css', function() {
	gulp.src('src/css/**/*.css')
		.pipe(concat('style.css'))
		.pipe(cleanCSS())
		.pipe(gulp.dest('dist/css'))
		.pipe(browserSync.stream());
});

gulp.task('lint', function () {
	return gulp.src(['js/**/*.js'])
		// eslint() attaches the lint output to the eslint property
		// of the file object so it can be used by other modules.
		.pipe(eslint())
		// eslint.format() outputs the lint results to the console.
		// Alternatively use eslint.formatEach() (see Docs).
		.pipe(eslint.format())
		// To have the process exit with an error code (1) on
		// lint error, return the stream and pipe to failOnError last.
		.pipe(eslint.failOnError());
});