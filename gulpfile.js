var gulp = require('gulp');
var gutil = require('gulp-util');
var sass = require('gulp-sass');
var runSequence = require('run-sequence');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var debug = require('gulp-debug');
var ngAnnotate = require('gulp-ng-annotate');

gulp.task('sass', function () {    
    gulp.src('styles/main.scss')
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
        'showdown/**/*.*'
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
        .pipe(gulp.dest(dst_dir));
    ;
});

// {Publish !== deploy :)
gulp.task('build-and-publish-ng-app', function() {
    // JS settings
    var js_sources = [
        './src/js/angular_app/**/*.*'
    ];
    var js_target_file = 'ng-app.min.js';
    var js_output_dir = './public/static/js/angular_app/';
    
    // HTML (template) settings 
    var html_src_dir = './src/html/angular_app';
    var html_sources = [html_src_dir + '/**/*.*'];
    var html_output_dir = './public/static/html/angular_app';
    
    // ACTION !!!
    gulp.src(js_sources)
        .pipe(debug())
        .pipe(ngAnnotate())
        .pipe(uglify())
        .pipe(concat(js_target_file))
        .pipe(gulp.dest(js_output_dir))

    gulp.src(html_sources , { base: html_src_dir })
        .pipe(debug())
        .pipe(gulp.dest(html_output_dir));
    ;
});

gulp.task('watch', function() {
    gulp.watch('styles/main.scss', ['sass']);
});

gulp.task('pre-deploy', function(cb) {
    runSequence(
        [
            'sass',
            'publish-3rd-party-assets',
            'build-and-publish-ng-app'
        ], 
        cb
    );
});