var gulp = require('gulp'),
	jshint = require('gulp-jshint'),
	stylish = require('jshint-stylish'),
	concat = require('gulp-concat'),
	uglify = require('gulp-uglify'),
	rename = require('gulp-rename'),
	notify = require('gulp-notify'),
	del = require('del');
    
var paths = ['dist/PluginDetect_AllPlugins.js', 'dist/swfobject.js', 'tracker.js'];

gulp.task('scripts', function() {
	gulp.src(paths)
		// .pipe(jshint())
		// .pipe(jshint.reporter(stylish))
		.pipe(concat('tracker.js', {newLine : '\n\n'}))
		.pipe(uglify())
		.pipe(rename({suffix: '.min'}))
		.pipe(gulp.dest('assets'))
		.pipe(notify({ message: 'Scripts task complete' }));
});

gulp.task('clean', function () {
	return del(['assets/*.js']);
});

gulp.task('watch', function () {
    /* var watcher = gulp.watch(paths, ['clean', 'scripts']);
    watcher.on('change', function(event) {
        console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
    }); */
	
    gulp.watch(paths, function (event) {
		console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
	});
	gulp.watch(paths, ['scripts']);  //'clean', 
    
});

gulp.task('default', ['clean'], function () {
	gulp.start('scripts', 'watch');
});



gulp.task('test', function () {
    gulp.src(['tracker.js'])
		.pipe(jshint())
		.pipe(jshint.reporter(stylish))
		.pipe(concat('all.js', {newLine : '\n\n'}))
		.pipe(uglify())
		.pipe(rename({suffix: '.min'}))
		.pipe(gulp.dest('assets'))
		.pipe(notify({ message: 'Scripts task complete' }));
});