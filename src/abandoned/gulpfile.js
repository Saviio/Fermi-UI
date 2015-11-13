
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
        .pipe(uglify())
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

/*
link(scope,elem,attr,ctrl,transcludeFn){
     //筛选所有非自定义的HTML元素
     //强行mixin所有rootscope上的元素 （？）
     /*
    var linkedClone = transcludeFn()
    console.log(linkedClone)
    for(var i=linkedClone.length-1;i>=0;i--){
        var node=linkedClone[i]
        console.log(node)
    }
    ctrl.placement=scope.placement || 'top'
    console.log(scope)

    let tmpl=popoverTmpl.replace(/#{dire}/,ctrl.placement)
    let content=this.$compile(tmpl,transcludeFn)
    elem.append(content(scope))

    const show = () =>{}
    const hide = () =>{}

    console.log(content)
}*/
