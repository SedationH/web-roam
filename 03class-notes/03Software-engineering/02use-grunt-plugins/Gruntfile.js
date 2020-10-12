const sass = require('node-sass');
const loadGruntTasks = require('load-grunt-tasks')

module.exports = grunt => {
  grunt.initConfig({
    clean: {
      // **包括temp本身
      temp: 'temp/**'
    },
    sass: {
      options: {
        implementation: sass,
        sourceMap: true
      },
      dist: {
        files: {
          'dist/css/main.css': 'src/scss/main.scss'
        }
      }
    },
    babel: {
      options: {
        sourceMap: true,
        presets: ['@babel/preset-env']
      },
      main: {
        files: {
          'dist/js/app.js': 'src/js/app.js'
        }
      }
    },
    watch: {
      js: {
        files: ['src/js/*.js'],
        tasks: ['babel']
      },
      css: {
        files: ['src/scss/*.scss'],
        tasks: ['sass']
      }
    }
  })

  // 一种多目标任务
  // grunt.loadNpmTasks('grunt-contrib-clean')
  // grunt.loadNpmTasks('grunt-sass')

  // 可以使用load-grunt-tasks统一载入
  loadGruntTasks(grunt) // 自动加载所有的 grunt 插件中的任务
  grunt.registerTask('default', ['sass', 'babel', 'watch'])
}