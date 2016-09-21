'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var browserSync = require('browser-sync').create();
var eslint = require('gulp-eslint');
var jasmine = require('gulp-jasmine-phantom');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var cleanCSS = require('gulp-clean-css');

gulp.task('default', ['copy-html', 'copy-images', 'sass', 'css', 'lint', 'scripts'], function() {
	gulp.watch('src/sass/**/*.scss', ['sass']);
	gulp.watch('src/css/**/*.css', ['css']);
	gulp.watch('src/js/**/*.js', ['scripts','lint']);
	gulp.watch('src/index.html', ['copy-html']);
	gulp.watch('./dist/index.html').on('change', browserSync.reload);

	browserSync.init({
		server: 'dist'
	});
});

gulp.task('dist', [
	'copy-html',
	'copy-images',
	'sass',
	'css',
	'lint',
	'scripts-dist'
]);

gulp.task('scripts', function() {
	gulp.src('src/js/**/*.js')
		.pipe(concat('all.js'))
		.pipe(gulp.dest('dist/js'));
});

gulp.task('copy-html', function() {
	gulp.src('src/index.html')
		.pipe(gulp.dest('dist'));
});

gulp.task('copy-images', function() {
	gulp.src('src/img/*')
		.pipe(gulp.dest('dist/img'));
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