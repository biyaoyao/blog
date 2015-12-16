var gulp = require('gulp'),
    rename = require('gulp-rename'),
    minifyCss = require("gulp-minify-css"),
    minifyHtml = require("gulp-minify-html"),
    uglify = require("gulp-uglify"),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant') //png图片压缩插件
;

gulp.task('default', function () {
    gulp.src('../public/js/*.js')
        .pipe(uglify()) //压缩js
        .pipe(gulp.dest('../public/js'));

    gulp.src('../public/css/*.css')
        .pipe(minifyCss()) //压缩css
        .pipe(gulp.dest('../public/css'));

    gulp.src('../views/*.ejs')
        .pipe(minifyHtml()) //压缩html
        .pipe(gulp.dest('../views/'));
    
    
    gulp.src('../public/photo/*')//压缩img
        .pipe(imagemin({
            progressive: true,
            use: [pngquant()] //使用pngquant来压缩png图片
        }))
        .pipe(gulp.dest('../public/photo/'));
    
    
});