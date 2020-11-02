const ora = require('ora')

const spinner = ora('start').start()

setTimeout(() => {
  spinner.succeed('succss download')
}, 200);