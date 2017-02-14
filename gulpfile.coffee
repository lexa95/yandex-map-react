gulp 		= require 'gulp'
connect 	= require 'gulp-connect'
livereload 	= require 'gulp-livereload'
react 		= require 'gulp-react'
jasmine 	= require 'gulp-jasmine'
notify 		= require 'gulp-notify'

gulp.task 'connect', ->
	connect.server
		port: 1337
		liverelod: true
		root: './dist'

gulp.task 'style', ->
	gulp.src 'dist/style/*.css'
		.pipe do livereload

gulp.task 'html', ->
	gulp.src 'dist/*.html'
		.pipe do livereload

gulp.task 'js', ->
	gulp.src 'dist/js/*.js'
		.pipe do livereload

gulp.task 'react', ->
	gulp.src 'src/*.jsx'
		.pipe do react
		.pipe gulp.dest 'dist/js'
		.pipe do livereload

gulp.task 'watch', ->
	do livereload.listen
	gulp.watch 'dist/style/*.css', ['style']
	gulp.watch 'dist/*.html', ['html']
	gulp.watch 'dist/js/*.js', ['js']
	gulp.watch 'src/*.jsx', ['react']



gulp.task 'default', ['style', 'html', 'js', 'connect', 'watch', 'react']