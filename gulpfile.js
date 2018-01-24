var gulp = require('gulp');
var gutil = require('gulp-util');
var sass = require('gulp-sass');
var runSequence = require('run-sequence');

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

gulp.task('watch', function() {
    gulp.watch('styles/main.scss', ['sass']);
});

gulp.task('pre-deploy', function(cb) {
    runSequence(
        [
            'sass',
            'publish-3rd-party-assets',
        ], 
        cb
    );
});