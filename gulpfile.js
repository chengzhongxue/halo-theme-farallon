'use strict';

const gulp = require('gulp');
const uglify = require('gulp-uglify');
const plumber = require('gulp-plumber');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const sass = require('gulp-sass')(require('sass'));
const rename = require('gulp-rename');
const ts = require('gulp-typescript');
function fonts() {
    return gulp.src('./src/fonts/*').pipe(gulp.dest('./templates/assets/fonts/'));
}

function images() {
    return gulp.src('./src/images/*.{png,jpg,jpeg,gif,svg}').pipe(gulp.dest('./templates/assets/images/'));
}

function css() {
    return gulp
        .src('./src/scss/app.scss')
        .pipe(plumber())
        .pipe(sass({ outputStyle: 'compressed' }))
        .pipe(rename({ suffix: '.min' }))
        .pipe(postcss([autoprefixer(), cssnano()]))
        .pipe(gulp.dest('./templates/assets/css/'));
}

// Transpile, concatenate and minify scripts
function scripts() {
    return gulp
        .src(['./src/js/extensions/*', './src/js/app.ts', './src/js/modules/*'])
        .pipe(
            ts({
                noImplicitAny: true,
                outFile: 'app.js',
                target: 'es5',
            })
        )
        .pipe(uglify())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('./templates/assets/js/'));
}

// Watch files
function watchFiles() {
    gulp.watch(['./src/js/modules/*', './src/js/app.ts'], gulp.series(scripts));
    gulp.watch(['./src/scss/app.scss', './src/scss/modules/*', './src/scss/templates/*'], gulp.series(css));
}

// define complex tasks
const js = gulp.series(scripts);
const watch = gulp.parallel(watchFiles);
const build = gulp.parallel(watch, gulp.parallel(css, fonts, js, images));

exports.css = css;
exports.js = js;
exports.build = build;
exports.watch = watch;
exports.default = build;
