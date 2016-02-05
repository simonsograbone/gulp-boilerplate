'use strict'

// region Imports

import del from 'del'
import gulp from 'gulp'
import sass from 'gulp-sass'
import concat from 'gulp-concat'
import uglify from 'gulp-uglify'
import streamify from 'gulp-streamify'
import imagemin from 'gulp-imagemin'
import pngquant from 'imagemin-pngquant'
import babelify from 'babelify'
import browserify from 'browserify'
import source from 'vinyl-source-stream'

// endregion Imports

// region Options

const
    SCSS_OPTIONS = {
        outputStyle: 'compressed'
    },

    BABEL_OPTIONS = {
        presets: ['es2015', 'stage-0']
    },

    BROWSERIFY_OPTIONS = {
        debug: true
    },

    IMAGEMIN_OPTIONS = {
        progressive: true,
        interlaced:  true,
        svgoPlugins: [
            { removeViewBox: false }
        ],
        use: [
            pngquant()
        ]
    }

// endregion Options

// region Tasks

// region General

/**
 * Clean 'dist' directory
 */
gulp.task('clean', () =>
    del(['dist'])
)

// endregion General

// region SCSS

/**
 * Compile and compress all project SASS files
 */
gulp.task('scss', ['clean'], () =>
    gulp.src('src/scss/**/*.scss')
        .pipe(sass(SCSS_OPTIONS).on('error', sass.logError))
        .pipe(concat('index.css'))
        .pipe(gulp.dest('dist/css'))
)

/**
 * Watch all .scss files and run the 'scss' task when modified
 */
gulp.task('scss:watch', ['scss'], () => {
    gulp.watch('src/scss/**/*.scss', ['scss'])
})

// endregion SCSS

// region JS

/**
 * Compile and compress all project JS files
 */
gulp.task('js', ['clean'], () =>
    browserify('src/js/index.js', BROWSERIFY_OPTIONS)
        .transform(babelify, BABEL_OPTIONS)
        .bundle()
        .on('error', (error) => { console.error(`Error: ${error.message}`) })
        .pipe(source('index.js'))
        .pipe(streamify(uglify()))
        .pipe(gulp.dest('dist/js'))
)

/**
 * Watch all .js files and run the 'js' task when modified
 */
gulp.task('js:watch', ['js'], () =>
    gulp.watch('src/js/**/*.js', ['js'])
)

// endregion JS

// region Images

/**
 * Optimise all project images
 */
gulp.task('images', ['clean'], () =>
    gulp.src('src/images/**/*')
        .pipe(imagemin(IMAGEMIN_OPTIONS))
        .pipe(gulp.dest('dist/img'))
)

/**
 * Watch all image files and run the 'images' task when modified
 */
gulp.task('images:watch', ['images'], () =>
    gulp.watch('src/images/**/*', ['images'])
)

// endregion Images

// endregion Tasks

// region Task runners

/**
 * Build project
 */
gulp.task('default', ['clean', 'scss', 'js', 'images'])

/**
 * Build project and set up watchers
 */
gulp.task('watch', ['clean', 'scss:watch', 'js:watch', 'images:watch'])

// endregion Task runners