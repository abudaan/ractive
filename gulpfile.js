var gulp = require('gulp')
var exec = require('gulp-exec')
var rename = require('gulp-rename')
var path = require('path')
var buffer = require('vinyl-buffer')
var source = require('vinyl-source-stream')
var ractivate = require('ractivate')
var browserify = require('browserify')
var watchify = require('watchify')
var babelify = require('babelify')
var yamlify = require('yamlify')
var livereload = require('gulp-livereload')
var sourcemaps = require('gulp-sourcemaps')
var gutil = require('gulp-util')
var _ = require('lodash')
var sass = require('gulp-sass')
var concat = require('gulp-concat')
var spawn = require('child_process').spawn


var sources = {
  // css: ['./css/*.sass'],
  css: ['./css/*.sass', './partials/**/*.sass'],
  html: './index.html',
  yaml: ['./partials/**/*.yaml', './pages/**/*.yaml', './config.yaml'],
  sass: 'styles/main.scss',
}

var targets = {
  dist: 'dist/',
}


const printRactivate = (elem, id, xs) => gutil.log(gutil.colors.blue('ractivate: ' + elem))

const logBrowserifyError = e => {
  gutil.log(gutil.colors.red(e.message))
  if(e.codeFrame){
    if(_.startsWith(e.codeFrame, 'false')){
      console.log(e.codeFrame.substr(5))
    }else{
      console.log(e.codeFrame)
    }
  }
}


const rebundle = b => {
  return b.bundle()
    .on('error', logBrowserifyError)
    .pipe(source('bundle.js'))
    .pipe(buffer())
    // .pipe(sourcemaps.init({
    //     loadMaps: true
    // }))
    // .pipe(sourcemaps.write('./dist'))
    .pipe(gulp.dest('./dist'))
    .pipe(livereload())
}


const bundle = (source_file, watch) => {
  var b
  var opts = {
    debug: true,
    //paths: ['./node_modules', './js/', './partials/**/*.html']
    paths: ['./js/', './partials/**/*.html']
  }

  if(watch){
    opts.cache = {}
    opts.packageCache = {}

    b = watchify(browserify(opts))
    b.on('update', function(){
      //console.log('update')
      rebundle(b)
    })
  }else{
    b = browserify(opts)
  }

  b.add(source_file)
  b.transform({extensions: ['.html']}, ractivate)
  //b.transform({extensions: ['.yaml']}, yamlify)
  b.on('update', ids => _.map(ids, printRactivate))
  b.transform(babelify.configure({
    compact: false,
    presets: ['es2015']
  }))

  return rebundle(b)
}


gulp.task('server', function(){
  var cmd = spawn('./node_modules/.bin/http-server', ['./dist/'], {stdio: 'inherit'});
  cmd.on('close', () => {
    gutil.log(gutil.colors.green('server running at port 8080'))
  })
  cmd.on('error', error => {
    gutil.log(gutil.colors.red(error))
  })
  cmd.on('message', message => {
    gutil.log(gutil.colors.white(message))
  })
})


gulp.task('yaml', function(){
  var cmd = spawn('./node_modules/.bin/babel-node', ['./build_scripts/languages.js'], {stdio: 'inherit'});
  cmd.on('close', () => {
    gutil.log(gutil.colors.blue('language file updated'))
    livereload()
  })
  cmd.on('error', error => {
    gutil.log(gutil.colors.red(error))
  })
})


gulp.task('html', function(){
  gulp.src(sources.html)
  .pipe(gulp.dest(targets.dist))
  .pipe(livereload())
})


gulp.task('css', function(){
  gulp.src(sources.css)
  .pipe(sass().on('error', sass.logError))
  .pipe(concat('app.css'))
  .pipe(gulp.dest(targets.dist))
  .pipe(livereload())
})


gulp.task('watch', ['yaml', 'html', 'css'], function(){
  livereload.listen()

  gulp.watch(sources.css, ['css'])
  gulp.watch(sources.html, ['html'])
  gulp.watch(sources.yaml, ['yaml'])
  return bundle('./js/main.js', true)
})

gulp.task('start', ['watch', 'server'], function(){
  //gutil.log(gutil.colors.green('started'))
  // let's dance!
})
