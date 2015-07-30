
var
     gulp =require('gulp')
    ,babel =require('gulp-babel')
    ,minifyCss = require('gulp-minify-css')
    ,rename = require('gulp-rename')
    ,uglify = require('gulp-uglify')
    ,concat = require('gulp-concat')


//sudo npm install gulp-babel gulp-minify-css gulp-rename gulp-uglify --save-dev


gulp.task('compile',function(){
    return gulp.src('src/js/*.js')
        .pipe(concat('fermiUI.min.js'),{newLine:';'})
        .pipe(babel())
        //.pipe(uglify())
        //.pipe(rename('fermiUI.min.js'))
        .pipe(gulp.dest('build'))
})

gulp.task('minify', function() {
    return gulp.src('src/css/*.css')
        .pipe(concat('fermiUI.min.css'))
        .pipe(minifyCss())
        //.pipe(rename('fermiUI.min.css'))
        .pipe(gulp.dest('build'));
})

gulp.task('watch',function(){
    gulp.watch('src/**/*',['minify','compile'])
})


gulp.task('default', ['watch','compile','minify']);
