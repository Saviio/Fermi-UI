const gulp = require('gulp')
const babel = require('gulp-babel')
const sass = require('gulp-sass')

const buildOption = {
    base : 'src/'
}

gulp.task('default', () => {
    gulp.src('src/**/*.js', buildOption)
        .pipe(babel({
            presets: ["stage-0", 'es2015'],
            plugins: ["transform-decorators-legacy"]
        }))
        .pipe(gulp.dest('lib'))

    gulp.src('src/index.scss', buildOption)
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('lib'))
})
