


const sass = require('sass')


const LoadGruntTasks = require('load-grunt-tasks') 

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

module.exports = (grunt) => {
  
  grunt.initConfig({
    
    clean: {
      build: {
        src: ['dist', 'temp', '.tmp']
      }
    },
    
    sass: {
      options: {
        implementation: sass, 
        sourceMap: false, 
        outputStyle: 'expanded' 
      },
      build: {
        expand: true,
        ext: '.css',
        cwd: 'src/assets/styles',
        src: '*.scss',
        dest: 'temp/assets/styles'
      }
    },
    
    babel: {
      options: {
        sourceMap: false,
        presets: ['@babel/preset-env']
      },
      build: {
        expand: true,
        cwd: 'src/assets/scripts',
        src: '*.js',
        dest: 'temp/assets/scripts'
      }
    },
    
    swigtemplates: {
      options: {
        defaultContext: data,
        templatesDir: 'src'
      },
      build: {
        src: ['src/*.html'],
        dest: 'temp/'
      }
    },
    
    imagemin: {
      build: {
        expand: true,
        cwd: 'src/assets/images',
        src: '**',
        dest: 'dist/assets/images'
      },
      buildFont: {
        expand: true,
        cwd: 'src/assets/fonts',
        src: '**',
        dest: 'dist/assets/fonts'
      }
    },
    
    copy: {
      build: {
        expand: true,
        cwd: 'public',
        src: '**',
        dest: 'dist'
      }
    },
    
    browserSync: {
      build: {
        open: true, 
        notify: false, 
        bsFiles: {
          src: ['temp', 'src', 'public']
        },
        options: {
          watchTask: true,
          server: {
            baseDir: ['temp', 'src', 'public'],
            routes: { 
              '/node_modules': 'node_modules'
            }
          }
        }
      }
    },
    
    watch: {
      bulidScss: {
        files: 'src/assets/styles/*.scss',
        tasks: ['sass']
      },
      bulidJs: {
        files: 'src/assets/scripts/*.js',
        tasks: ['babel']
      },
      buildHtml: {
        files: 'src/*.html',
        tasks: ['swigtemplates']
      }
    },
    
    useminPrepare: {
      html: 'temp/*.html',
      options: {
        dest: 'dist',
        root: ['dist', '.'],
      }
    },
    usemin: {
      html: 'dist/*.html'
    },
    htmlmin: {
      options: {
        removeComments: true,
        collapseWhitespace: true,
        minifyCSS: true,
        minifyJS: true
      },
      build: {
        expand: true,
        cwd: 'temp',
        src: '*.html',
        dest: 'dist'
      }
    }
    
  })

  
  grunt.registerTask('compile', ['sass', 'babel', 'swigtemplates'])

  
  
  grunt.registerTask('build', [
    'clean', 
    'compile',
    'useminPrepare', 'concat', 'cssmin', 'uglify', 'usemin', 'htmlmin', 
    'copy', 'imagemin', 
  ])

  
  
  grunt.registerTask('develop', ['compile', 'browserSync', 'watch'])

  LoadGruntTasks(grunt) 
}
