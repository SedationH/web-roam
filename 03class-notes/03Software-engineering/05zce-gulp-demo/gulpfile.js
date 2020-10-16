const { parallel, series, src, dest, watch } = require('gulp')

const del = require('del')
const { stream } = require('browser-sync')

// f2 rename
// const plugins.scss = require('gulp-sass')
// const plugins.babel = require('gulp-babel')
// const plugins.swig = require('gulp-swig')
// const plugins.imageMin = require('gulp-imagemin')
const plugins = require('gulp-load-plugins')()
// 更新命名方式: 驼峰 if gulp-a-bc -> plugins.aBc
// 开发服务器 hot reload
const bs = require('browser-sync').create()



const style = () =>
  src('src/assets/**/*.scss', { base: 'src' })
    // 默认不处理_开头的
    .pipe(plugins.sass())
    .pipe(dest('temp'))

const script = () =>
  src('src/**/*.js', { base: 'src' })
    .pipe(plugins.babel({ presets: ['@babel/preset-env'] }))
    .pipe(dest('temp'))

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
    .pipe(plugins.swig({ data, defaults: { cache: false } }))
    .pipe(dest('temp'))
// .pipe(bs.reload({ stream: true)})

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
    .pipe(dest('dist'))

const clean = () => del(['temp', 'dist'])

const serve = () => {
  watch('src/assets/styles/*.scss', style)

  watch('src/assets/scripts/*.js', script)
  // watch('src/*.html', page)
  // 也可以写成每个类型自动reload brower 注意看page实现
  watch('src/*.html', page)


  // watch('src/assets/ images/**', image)
  // watch('src/assets/fonts/**', font)
  // watch('public/**', extra)
  watch([
    'src/assets/images/**',
    'src/assets/fonts/**',
    'public/**'
  ], bs.reload)

  bs.init({
    // notify: false,
    port: 2080,
    files: 'temp/**',
    server: {
      // 如果在dist中不存在就向下一个找
      baseDir: ['temp', 'src', 'public'],
      routes: {
        // 如果读取到/node_modules的请求，进行重定向
        '/node_modules': 'node_modules'
      },
    },
  })
}

// 相同文件同时读写会有一方无法完成，注意分开
const useref = () =>
  src('temp/*.html', { base: 'temp' })
    // 补充ref的时候寻找位置
    .pipe(plugins.useref({ searchPath: ['temp', '.'] }))
    .pipe(plugins.if(/\.js$/, plugins.uglify()))
    .pipe(plugins.if(/\.css$/, plugins.cleanCss()))
    .pipe(plugins.if(/\.html$/, plugins.htmlmin({
      collapseWhitespace: true,
      minifyCSS: true,
      minifyJS: true
    })))
    .pipe(dest('dist'))

const compile = parallel(style, script, page)

const build = series(
  clean,
  parallel(
    series(compile, useref),
    image,
    font,
    extra,
  )
)
const develop = series(compile, serve)
// 一些重要的思考：平衡开发效率和上线效率

module.exports = {
  compile,
  build,
  develop
}