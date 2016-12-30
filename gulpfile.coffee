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

# gulp.task('browserify', function () {
#   return gulp.src(['./app/**/*.js'])
#     .pipe(through2.obj(function (file, enc, next){
#       browserify(file.path)
#         .transform(reactify)
#         .bundle(function(err, res){
#           file.contents = res;
#           next(null, file);
#         });
#     }))
#     .pipe(uglify())
#     .pipe(gulp.dest('./build'))
# })

gulp.task 'react', ->
	gulp.src 'src/*.jsx'
		.pipe do react
		.pipe gulp.dest 'dist/js'
		.pipe do livereload

gulp.task 'test', ->
	gulp.src 'spec/test/*.js'
		.pipe do jasmine
		# .pipe gulp.dest 'dist/js'
		.pipe do livereload

gulp.task 'watch', ->
	do livereload.listen
	gulp.watch 'dist/style/*.css', ['style', 'test']
	gulp.watch 'dist/*.html', ['html', 'test']
	gulp.watch 'dist/js/*.js', ['js', 'test']
	gulp.watch 'src/*.jsx', ['react', 'test']
	gulp.watch 'spec/test/*.js', ['test']



gulp.task 'default', ['style', 'html', 'js', 'connect', 'watch', 'react', 'test']