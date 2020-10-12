module.exports = grunt => {
  grunt.initConfig({
    foo: {
      bar: 'QAQ'
    }
  })

  grunt.registerTask('foo', 'Foo Description', () => {
    const { config } = grunt
    console.log(config('foo'), '\n', config('foo.bar'))
  })

  grunt.registerTask('fun', 'Fun Description', () => {
    const { config } = grunt
    console.log('This is fun task')
  })

  // via default 合并任务
  grunt.registerTask('default', ['foo', 'fun'])

  // 也可以在任务函数中执行其他任务
  grunt.registerTask('run-other', () => {
    grunt.task.run('foo', 'fun')
    console.log('via run-other execute foo & fun')
  })

  // 异步任务 要用到this
  grunt.registerTask('async', function () {
    const done = this.async()
    setTimeout(() => {
      console.log('execute async task')
      done()
    }, 1000);
  })

  // 标记任务执行失败
  grunt.registerTask('success-task', () => {
    return true
  })
  grunt.registerTask('err-task', () => {
    return false
  })

  grunt.registerTask('test', ['err-task', 'success-task'])
  // Running "err-task" task
  // Warning: Task "err-task" failed. Use --force to continue.

  // --force
  // unning "err-task" task
  // Warning: Task "err-task" failed. Used --force, continuing.

  // Running "success-task" task

  // Done, but with warnings.

  // 标记异步任务失败
  grunt.registerTask('err-async-task', function () {
    const done = this.async()
    setTimeout(() => {
      done(false)
    }, 1000);
  })

  grunt.initConfig({
    ...grunt.config(),
    build: {
      options: {
        msg: 'task options'
      },
      foo: {
        // 子options覆盖外部的options
        options: {
          msg: 'foo target options'
        },
      },
      bar: '456'
    }
  })
  // 多目标任务,根据配置信息形成多个子任务
  grunt.registerMultiTask('build', function () {
    console.log(`task: build, target: ${this.target}\n data: ${this.data}\noptions: ${this.options()}`)
  })
}