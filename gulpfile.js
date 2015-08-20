var gulp = require('gulp'),
    minifycss = require('gulp-minify-css'), 
    jade = require('gulp-jade'),
    uglify = require('gulp-uglify'), 
    sass = require('gulp-sass'),
    imagemin = require('gulp-imagemin'), 
    concat = require('gulp-concat'),
    connect = require('gulp-connect'),
    coffee = require('gulp-coffee');

var generatedResourcesDirectory = 'dist/', 
    frontendSourcesDirectory = 'markup/';

gulp.task('compress-img', function() {
    gulp.src([frontendSourcesDirectory + 'modules/**/*.png',
                     frontendSourcesDirectory + 'modules/**/*.jpg',
                     frontendSourcesDirectory + 'modules/**/*.gif',
                     frontendSourcesDirectory + 'static/**/*.jpg',
                     frontendSourcesDirectory + 'static/**/*.png',
                     frontendSourcesDirectory + 'static/**/*.gif'])
    .pipe( imagemin({progressive: true}) )
    .pipe(gulp.dest(generatedResourcesDirectory + 'img'))
    .pipe(connect.reload());
});
gulp.task('build-html', function() {
    gulp.src(frontendSourcesDirectory + 'modules/**/*.jade')
        .pipe( jade({pretty: true}) ).on('error', console.log) 
        .pipe(gulp.dest(generatedResourcesDirectory + 'templates')) 
    gulp.src(frontendSourcesDirectory + 'pages/**/*.jade')
        .pipe( jade({pretty: true}) ).on('error', console.log) 
        .pipe(gulp.dest(generatedResourcesDirectory + 'pages'))
        .pipe(connect.reload());
});
gulp.task('copy-fonts', function() {
    gulp.src([frontendSourcesDirectory + 'static/fonts/**/*.svg',
              frontendSourcesDirectory + 'static/fonts/**/*.woff',
              frontendSourcesDirectory + 'static/fonts/**/*.ttf'])
        .pipe(gulp.dest(generatedResourcesDirectory + 'fonts'))
        .pipe(connect.reload());
});
gulp.task('dev-js', function() {
    gulp.src(frontendSourcesDirectory + 'modules/**/*.coffee')
        .pipe(coffee({bare: true}).on('error', console.log))
        .pipe(gulp.dest(generatedResourcesDirectory + "tempJs"))
    gulp.src(generatedResourcesDirectory + 'tempJs')
        .pipe(concat('bundle.js'))
        .pipe(gulp.dest(generatedResourcesDirectory));
    gulp.src(frontendSourcesDirectory + 'static/vendor-js/**/*.js')
        .pipe(concat('vendor.js'))
        .pipe(gulp.dest(generatedResourcesDirectory))
        .pipe(connect.reload());
});
gulp.task('dev-css', function() {
    gulp.src([frontendSourcesDirectory + 'modules/**/*.scss'])
        .pipe(sass())
        .pipe(gulp.dest(generatedResourcesDirectory + 'tempCss'));
    gulp.src(generatedResourcesDirectory + 'tempCss')
        .pipe(concat('bundle.css'))
        .pipe(gulp.dest(generatedResourcesDirectory));
    gulp.src(frontendSourcesDirectory + 'static/vendor-css/**/*.css')
        .pipe(concat('vendor.css'))
        .pipe(gulp.dest(generatedResourcesDirectory))
        .pipe(connect.reload());
});
gulp.task('build-js', function() {
    gulp.src(frontendSourcesDirectory + 'modules/**/*.coffee')
        .pipe(coffee({bare: true}).on('error', console.log))
        .pipe(gulp.dest(generatedResourcesDirectory + "tempJs"))
    gulp.src(generatedResourcesDirectory + 'tempJs')
        .pipe(concat('bundle.js'))
        .pipe(uglify())
        .pipe(gulp.dest(generatedResourcesDirectory));
    gulp.src(frontendSourcesDirectory + 'static/vendor-js/**/*.js')
        .pipe(concat('vendor.js'))
        .pipe(uglify())
        .pipe(gulp.dest(generatedResourcesDirectory))
        .pipe(connect.reload());
});
gulp.task('build-css', function() {
    gulp.src([frontendSourcesDirectory + 'modules/**/*.scss'])
        .pipe(sass())
        .pipe(gulp.dest(generatedResourcesDirectory + 'tempCss'));
    gulp.src(generatedResourcesDirectory + 'tempCss')
        .pipe(concat('bundle.css'))
        .pipe(minifycss())
        .pipe(gulp.dest(generatedResourcesDirectory));
    gulp.src(frontendSourcesDirectory + 'static/vendor-css/**/*.css')
        .pipe(concat('vendor.css'))
        .pipe(minifycss())
        .pipe(gulp.dest(generatedResourcesDirectory))
        .pipe(connect.reload());
});
gulp.task('build', function(){
    gulp.run('copy-fonts');
    gulp.run('build-html');
    gulp.run('compress-img');
    gulp.run('build-js');
    gulp.run('build-css');
});
gulp.task('connect', function() {
    connect.server({
        root: generatedResourcesDirectory,
        livereload: true
    });
});
gulp.task('watch', function () {
    gulp.watch([frontendSourcesDirectory + 'modules/**/*.scss', frontendSourcesDirectory + 'static/vendor-css/**/*.css'], ['dev-css']);
    gulp.watch([frontendSourcesDirectory + 'modules/**/*.coffee', frontendSourcesDirectory + 'static/vendor-js/**/*.js'], ['dev-js']);
    gulp.watch([frontendSourcesDirectory + 'modules/**/*.jade', frontendSourcesDirectory + 'pages/**/*.jade'], ['build-html']);
    gulp.watch([frontendSourcesDirectory + 'modules/img/**/*', frontendSourcesDirectory + 'static/img/**/*'], ['compress-img']);
    gulp.watch([frontendSourcesDirectory + 'static/fonts/**/*.svg',
                frontendSourcesDirectory + 'static/fonts/**/*.woff',
                frontendSourcesDirectory + 'static/fonts/**/*.ttf'], ['copy-fonts']);
});
gulp.task('dev', ['connect', 'watch']);