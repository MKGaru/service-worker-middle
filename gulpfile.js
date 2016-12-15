const path = require('path');
const gulp = require('gulp');
const gulpif = require('gulp-if');
const watch = require('gulp-watch');
const pug = require('gulp-pug');
const filter = require('gulp-filter');
const emitty = require('emitty');
const emittyLess = emitty.setup('src/view/styles','less');
const emittyPug = emitty.setup('src/view', 'pug', {
    makeVinylFile: true
});
const less = require('gulp-less');

gulp.task('watch', () => {
    // Shows that run "watch" mode
    global.watch = true;

    gulp.watch('./src/view/styles/**/*.less',gulp.series('less'));
    gulp.watch('src/view/**/*.pug', gulp.series('templates'))
        .on('all', (event, filepath, stats) => {
            global.emittyChangedFile = {
                path: filepath,
                stats
            };
        });
});

gulp.task('templates', () =>
    gulp.src('src/view/*.pug', { read: false })
        .pipe(gulpif(global.watch, emittyPug.stream(global.emittyChangedFile.path, global.emittyChangedFile.stats)))
        .pipe(pug({
            pretty:true,
            client:true,
            debug:false,
            compileDebug:false
        }))
        .pipe(gulp.dest('./public/service/template/'))
);

gulp.task('less',()=>
    gulp.src('./src/view/styles/**/*.less')
        .pipe(less())
        .pipe(gulp.dest('./public/css'))
);
gulp.task('pug',()=>
    gulp
        .src(['./src/view/*.pug'])
        .pipe(pug({
            pretty:true,
            client:true,
            debug:false,
            compileDebug:false
        }))
        .pipe(gulp.dest('./public/service/template/'))
);

gulp.task('default',gulp.series('pug','less'));
