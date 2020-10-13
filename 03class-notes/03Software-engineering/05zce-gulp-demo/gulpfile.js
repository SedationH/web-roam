const { parallel, series, src, dest } = require('gulp')

const sass = require('gulp-sass')
const babel = require('gulp-babel')
const swig = require('gulp-swig')

const style = () =>
  src('src/assets/**/*.scss', { base: 'src' })
    // 默认不处理_开头的
    .pipe(sass())
    .pipe(dest('dist'))

const script = () =>
  src('src/**/*.js', { base: 'src' })
    .pipe(babel({ presets: ['@babel/preset-env'] }))
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
    .pipe(swig(data))
    .pipe(dest('dist'))

const compile = () => parallel(style, script, page)


module.exports = {
  style,
  script,
  page
}