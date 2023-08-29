
const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const webpack = require('webpack-stream');
const nodemon = require('gulp-nodemon');
const eslint = require('gulp-eslint-new');
const webpackConfig = require('./webpack.config.js');


// const sassTask = (done) => {
//     gulp.src('./scss/main.scss')
//         .pipe(sass().on('error', sass.logError))
//         .pipe(gulp.dest('./hosted'));

//     done();
// };

const jsTask = (done) => {
    webpack(webpackConfig)
        .pipe(gulp.dest('./hosted'));
    
    done();
}
  

const lintTask = (done) => {
    gulp.src('./server/**/*.js')
        .pipe(eslint({fix: true}))
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
    
    done();
}


const build = gulp.parallel( jsTask, lintTask);


const watch = (done) => {
    gulp.watch('./scss', sassTask);
    gulp.watch(['./client/*.js', './client/*.jsx'], jsTask);
    nodemon({ 
        script: './server/app.js',
        tasks: ['lintTask'],
        watch: ['./server'],
        done: done
    });
}

/*From our gulpFile, we want to export any tasks that we want
  to be able to call from our package.json or that we need to
  be called by packages like gulp-nodemon. In this case we can
  simply export all of them.

  To call a gulp task from a package.json script, we simply
  say "gulp [TASKNAME]". See examples of this in the package.json
  in this project.
*/
module.exports = {
    build,
    jsTask,
    lintTask,
    watch
};