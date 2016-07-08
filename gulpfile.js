'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');
var livereload = require('gulp-livereload');
var sassGlob = require('gulp-sass-glob');

gulp.task('sass:prod', function () {
    gulp.src('./sass/*.scss')
        .pipe(sassGlob())
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['last 2 version']
        }))
        .pipe(gulp.dest('./css'))
        .pipe(livereload());
});

gulp.task('sass:dev', function () {
    gulp.src('./sass/*.scss')
        .pipe(sassGlob())
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['last 2 version']
        }))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('./css'))
        .pipe(livereload());
});

gulp.task('sass:watch', function () {
    livereload.listen();
    gulp.watch('./sass/**/*.scss', ['sass:dev']);
});

gulp.task('default', ['sass:dev', 'sass:watch']);