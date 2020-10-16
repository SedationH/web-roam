const { parallel, series, src, dest } = require('gulp')

const del = require('del')

// f2 rename
// const plugins.scss = require('gulp-sass')
// const plugins.babel = require('gulp-babel')
// const plugins.swig = require('gulp-swig')
// const plugins.imageMin = require('gulp-imagemin')
const plugins = require('gulp-load-plugins')()
// 更新命名方式: 驼峰 if gulp-a-bc -> plugins.aBc

const style = () =>
  src('src/assets/**/*.scss', { base: 'src' })
    // 默认不处理_开头的
    .pipe(plugins.sass())
    .pipe(dest('dist'))

const script = () =>
  src('src/**/*.js', { base: 'src' })
    .pipe(plugins.babel({ presets: ['@babel/preset-env'] }))
    .pipe(dest('dist'))

const data = {
  menus: [
    {
      name: 'Home',
      icon: 'aperture',
      link: 'index.html'
    },
    {
      name: 'Features',
      link: 'features.html'
    },
    {
      name: 'About',
      link: 'about.html'
    },
    {
      name: 'Contact',
      link: '#',
      children: [
        {
          name: 'Twitter',
          link: 'https://twitter.com/w_zce'
        },
        {
          name: 'About',
          link: 'https://weibo.com/zceme'
        },
        {
          name: 'divider'
        },
        {
          name: 'About',
          link: 'https://github.com/zce'
        }
      ]
    }
  ],
  pkg: require('./package.json'),
  date: new Date()
}

const page = () =>
  // 这里约定src根目录下的html文件才需要转换
  src('src/*.html', { base: 'src' })
    .pipe(plugins.swig(data))
    .pipe(dest('dist'))

// 压缩图片
const image = () =>
  src('src/assets/images/**', { base: 'src' })
    .pipe(plugins.imagemin())
    .pipe(dest('dist'))

const font = () =>
  src('src/assets/fonts/**', { base: 'src' })
    .pipe(plugins.imagemin())
    .pipe(dest('dist'))

const extra = () =>
  src('public/**', { base: 'public' })
    .pipe(dest('dist/public'))

const clean = () => del('dist')

const compile = parallel(style, script, page, image, font)
const build = series(clean, parallel(compile, extra))

module.exports = {
  compile,
  build,
}