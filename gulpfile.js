var gulp = require('gulp');
var gutil = require('gulp-util');
var sass = require('gulp-sass');
var runSequence = require('run-sequence');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var debug = require('gulp-debug');
var ngAnnotate = require('gulp-ng-annotate');
var connect = require('gulp-connect-php');
var phpunit = require('gulp-phpunit');

gulp.task('build-and-publish-sass', function () {  
    var target_file = 'main.css';
    var src_dir = './src/scss/**/*.*';
    
    return gulp.src(src_dir)
        .pipe(debug())
        .pipe(concat(target_file))
        .pipe(sass({style: 'expanded'}))
        .on('error', gutil.log)
        .pipe(gulp.dest('public/static/css'))
    ;
});

// Move public node_modules to public sub-directory
gulp.task('publish-3rd-party-assets', function() {    
    var src_dir = './node_modules/';
    var dst_dir = 'public/static/third_party';
    
    // Define assets
    var js = [
        'angular/**/*.*',
        'angular-route/**/*.*',
        'moment/**/*.*',
        'ng-time-relative/**/*.*',
        'showdown/**/*.*',
        'font-awesome-animation/**/*.*'
    ];
    
    var css = [
        'bootstrap/**/*.*',
        'font-awesome/**/*.*'
    ];
    
    // Go for it
    var files = []
        .concat(js)
        .concat(css)
    ;
        
    files = files.map(function (file) {                
        return src_dir + file;
    });
    
    gutil.log('List of files and dirs to be moved:');
    gutil.log('----');
    
    gutil.log(files);
    
    gutil.log('----');

    return gulp.src(files , { base: src_dir })
        .pipe(gulp.dest(dst_dir))
    ;
});

// {Publish !== deploy :)
gulp.task('build-and-publish-ng-app-js', function() {
    // JS settings
    var js_sources = [
        './src/js/angular_app/**/*.*'
    ];
    var js_target_file = 'ng-app.min.js';
    var js_output_dir = './public/static/js/angular_app/';
    
    return gulp.src(js_sources)
        .pipe(debug())
        .pipe(ngAnnotate())
        .pipe(uglify())
        .pipe(concat(js_target_file))
        .pipe(gulp.dest(js_output_dir))
    ;
})

gulp.task('build-and-publish-ng-app-html', function() {  
    // HTML (template) settings 
    var html_src_dir = './src/html/angular_app';
    var html_sources = [html_src_dir + '/**/*.*'];
    var html_output_dir = './public/static/html/angular_app';  
    
    return gulp.src(html_sources , { base: html_src_dir })
        .pipe(debug())
        .pipe(gulp.dest(html_output_dir))
    ;
});

gulp.task('build-and-publish-ng-app', function() {  
    return gulp.start(
        'build-and-publish-ng-app-html',
        'build-and-publish-ng-app-js'
    );
});

gulp.task('build-and-publish-img', function() {
    // JS settings
    var img_sources = [
        './src/img/**/*.*'
    ];
    var js_output_dir = './public/static/img/';
            
    // ACTION !!!
    return gulp.src(img_sources)
        .pipe(debug())
        .pipe(gulp.dest(js_output_dir))
    ;
});

gulp.task('watch', function() {
    return gulp.watch('/src/scss/main.scss', ['build-and-publish-sass']);
});

gulp.task('build', function() {
    return runSequence(
        'build-and-publish-sass',
        'publish-3rd-party-assets',
        'build-and-publish-ng-app',
        'build-and-publish-img'
    )
});

var connect_instance = new connect();

gulp.task('run-php-webserver', function() {
    connect_instance.server({
        hostname: 'localhost',
        port: 8080,
        base: 'public/'
    });
});

gulp.task('phpunit', function() {
    return gulp.src('./phpunit.xml')
        .pipe(phpunit('./vendor/phpunit/phpunit/phpunit', {'debug': false}))
        .on('error', function () {
            // stahp
            process.exit();
        })
    ;
});

gulp.task('backend-test', function() {
    return gulp.start(
        'phpunit'
    );
});

gulp.task('test', function() {
    return gulp.start(
        'backend-test'
    );
});

gulp.task('build-test-predeploy-run', function() {
    return runSequence(
        'build',
        'test',
        'run-php-webserver'
    );
});

function killServer() {
    connect_instance.closeServer();
}

//do something when app is closing
process.on('exit', killServer);

//catches ctrl+c event
process.on('SIGINT', killServer);

// catches "kill pid" (for example: nodemon restart)
process.on('SIGUSR1', killServer);
process.on('SIGUSR2', killServer);

//catches uncaught exceptions
process.on('uncaughtException', killServer);
