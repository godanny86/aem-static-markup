// Load Gulp
var gulp = require('gulp'),
    gutil = require('gulp-util'),
    plugins = require('gulp-load-plugins')({
        rename: {
            'gulp-live-server': 'serve'
        }
    });

// Start Watching: Run "gulp"
gulp.task('default', ['watch']);

// Run "gulp server"
gulp.task('server', ['serve', 'watch']);

// Minify Custom JS: Run manually with: "gulp build-js"
gulp.task('build-js', function () {
    return gulp.src(['clientlibs/js/util.js',
                     'clientlibs/components/image/polyfills.js',
                     'clientlibs/components/image/image.js',
                     'clientlibs/components/sharing/sharing.js',
                     'clientlibs/components/search/search.js',
                     'clientlibs/components/navigation/navigation.js',
                     'clientlibs/components/teaser/teaser.js'])
        .pipe(plugins.concat('base.js'))
        .pipe(gulp.dest('build'));
});

// Less to CSS: Run manually with: "gulp build-css"
gulp.task('build-css', function () {
    return gulp.src('clientlibs/base.less')
        .pipe(plugins.plumber())
        .pipe(plugins.less())
        .on('error', function (err) {
            gutil.log(err);
            this.emit('end');
        })
        .pipe(plugins.autoprefixer({
            browsers: [
                    '> 1%',
                    'last 2 versions',
                    'firefox >= 4',
                    'safari 7',
                    'safari 8',
                    'IE 8',
                    'IE 9',
                    'IE 10',
                    'IE 11'
                ],
            cascade: false
        }))
        .pipe(gulp.dest('build')).on('error', gutil.log);
});

// Default task
gulp.task('watch', function () {
    gulp.watch('clientlibs/**/*.js', ['build-js']);
    gulp.watch('clientlibs/**/*.less', ['build-css']);
});

// Folder "/" serving at http://localhost:8888
// Should use Livereload (http://livereload.com/extensions/)
gulp.task('serve', function () {
    var server = plugins.serve.static('/', 8888);
    server.start();
    gulp.watch(['build/*'], function (file) {
        server.notify.apply(server, [file]);
    });
});
