
var
     gulp =require('gulp')
    ,babel =require('gulp-babel')
    ,minifyCss = require('gulp-minify-css')
    ,rename = require('gulp-rename')
    ,uglify = require('gulp-uglify')


//sudo npm install gulp-babel gulp-minify-css gulp-rename gulp-uglify --save-dev



gulp.task('compile',function(){
    return gulp.src('src/js/*.js')
        .pipe(babel())
        .pipe(uglify())
        .pipe(rename('quarkUI.min.js'))
        .pipe(gulp.dest('build'))
})

gulp.task('minify', function() {
    return gulp.src('src/css/*.css')
        .pipe(minifyCss())
        .pipe(rename('quarkUI.min.css'))
        .pipe(gulp.dest('build'));
})

gulp.task('watch',function(){
    gulp.watch('src/**/*',['minify','compile'])
})


gulp.task('default', ['watch','compile','minify']);
