'use strict';
var $ 					= require('gulp-load-plugins')();
var argv        = require('yargs').argv;
var gulp 				= require('gulp');
var del 				= require('del');
var browserSync = require('browser-sync');
var cleanCSS    = require('gulp-clean-css');
var runSequence = require('run-sequence');

// Browsers to target when prefixing CSS
var COMPATIBILITY = [
'last 2 versions',
'ie >= 9',
'Android >= 2.3'
];

// Environment
var URL = 'XXX.local';

var PATHS = {
	scss_src: './assets/sass/',
	css_src: './',
	js_src: './assets/js/',
	img_src: './assets/images/',
	node_modules: './node_modules/',
	bower_components: './bower_components/'
};

var VENDORS = {
	js: {
		select2: PATHS.bower_components + 'select2/dist/js/select2.js',
		slick: PATHS.bower_components + 'slick-carousel/slick/slick.js',
		magnific_popup: PATHS.bower_components + 'magnific-popup/dist/jquery.magnific-popup.min.js'
	},
	css: {
		select2: PATHS.bower_components + 'select2/dist/css/select2.css',
		slick: PATHS.bower_components + 'slick-carousel/slick/slick.css',
		magnific_popup: PATHS.bower_components + 'magnific-popup/dist/magnific-popup.css'
	}
};

var ASSETS = {
	dist: {
		css: PATHS.css_src,
		js: PATHS.js_src + 'build'
	},
	source: {
		js: [
			VENDORS.js.select2,
			VENDORS.js.slick,
			VENDORS.js.magnific_popup,
			PATHS.js_src + 'vendor/**/*.js',
			PATHS.js_src + 'source/**/!(script).js',
		  PATHS.js_src + 'source/**/*.js' // must come last
	  ],
	  css: [
	    VENDORS.css.select2,
	    VENDORS.css.slick,
	    VENDORS.css.magnific_popup,
	    PATHS.scss_src + '*.scss'
    ]
  }
}

// Styles
gulp.task('sass', function () {
	gulp.src(ASSETS.source.css)
	.pipe($.plumber())
	.pipe($.sourcemaps.init())
	.pipe($.sass({
		includePaths: PATHS.sass
	}))
	.pipe($.concat('style.css'))
	.on('error', $.notify.onError({
		message: "<%= error.message %>",
		title: "Sass Error"
	}))
	.pipe($.autoprefixer({
		browsers: COMPATIBILITY
	}))
	.pipe(cleanCSS())
	.pipe($.sourcemaps.write('.'))
	.pipe(gulp.dest(ASSETS.dist.css))
	.pipe(browserSync.stream({match: '**/*.css'}))
});


// Site Scripts
gulp.task('js-scripts', function() {
	gulp.src(ASSETS.source.js)
	.pipe($.plumber())
	//.pipe($.jshint('.jshintrc'))
	//.pipe($.jshint.reporter('default'))
	.on('error', $.notify.onError({
		message: "<%= error.message %>",
		title: "JS Error"
	}))
	.pipe($.concat('main.min.js'))
	.pipe($.uglify())
	.pipe(gulp.dest(ASSETS.dist.js))
});


// Sprite
gulp.task('sprite', function() {
	return gulp.src(PATHS.img_src + 'icons/**/*.svg')
	.pipe($.svgSprite({
		mode: {
			stack: {
				sprite: 'sprite.svg',
				bust: false,
				prefix: '%s'
			}
		}
	}))
	.pipe($.flatten())
	.pipe(gulp.dest(PATHS.img_src + 'icons'));
});


// Clean
gulp.task('clean:sprite', function () {
	del.sync(PATHS.img_src + 'icons/sprite.svg'), {
		force: true
	}
});


// Browsersync task
gulp.task('browser-sync', ['default'], function() {

	var files = [
	'**/*.php',
	'assets/images/**/*.{png,jpg,gif}',
	'assets/js/build/**/*.js'
	];

	browserSync.init(files, {
		proxy: URL,
		port: 3000
	});
});


// Watch
gulp.task('watch', ['browser-sync'], function() {
	gulp.watch(PATHS.scss_src + '**/*.scss', ['sass']);
  gulp.watch(PATHS.js_src + 'source/**/*.js', ['js-scripts']);
  gulp.watch(PATHS.img_src + 'icons/sprite/**/*', ['default']);
});


// Default
gulp.task('default', function (done) {
	return runSequence(
		'clean:sprite',
		['sass', 'js-scripts', 'sprite'],
		done
		);
});
