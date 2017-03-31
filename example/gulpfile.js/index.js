﻿'use strict';
var help = '';
var gulp = require('gulp'),
			watch = require('gulp-watch'),
			sourceForTasks = require('./gulptasks/sourceForTasks'),
			lazyRequireTask = function(taskName, path, options) {
				options = options || {};
				options.taskName = taskName;
				gulp.task(taskName, function(callback) {
					var task = require(path).call(this, options);
					return task(callback);
				});
			};
for(var key in sourceForTasks) {
	help += ('- gulp ' + key + '\n');
	lazyRequireTask(key, sourceForTasks[key].taskPath, sourceForTasks[key]);
}

gulp.task('build', gulp.parallel(
		gulp.series('copy:platform', 'override:less'),
		'build:js'
));

gulp.task('watch', function() {
	watch(sourceForTasks['copy:platform'].src, gulp.series('copy:platform', 'override:less'));
	watch(sourceForTasks['override:less'].srcForWatch, gulp.series('override:less'));
	watch(sourceForTasks['build:js'].src, gulp.series('build:js'));
	watch(sourceForTasks['build:js'].templateSrc, gulp.series('build:js'));
});

gulp.task('example', gulp.series(
	'build',
	gulp.parallel('watch', 'server:example')
));

gulp.task('default', function(cb) {
	console.log('####Task is not defined!\n' +
							'####Use any of defined tasks:\n' +
							help +
							'- gulp build\n' +
							'- gulp example'
							);
	cb();
});
