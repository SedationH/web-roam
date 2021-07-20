// https://codeburst.io/what-the-hook-learn-the-basics-of-tapable-d95eb0401e2c
import { SyncHook } from 'tapable'

class Car {
  constructor() {
    this.hooks = {
      carStarted: new SyncHook(),
      radioChanged: new SyncHook(['radioStation']),
    }

    this.hooks.carStarted.intercept({
      // 在每次注册的时候添加拦截
      register: tapInfo => {
        // console.log(`${tapInfo.name} is registered`)
        // { type: 'sync', fn: [Function (anonymous)], name: 'EngineLampPlugin' }
        // 可以对里面的函数进行加工和修改
        console.log('register')
      },

      // 在每次call的时候添加拦截
      call: tapInfo => {
        console.log('cal')
      },

      // 在每次tap的时候进行拦截
      tap: tapInfo => {
        console.log('tap')
      },
    })
  }

  // 调用事件
  turnOn() {
    this.hooks.carStarted.call()
  }

  setRadioStation(radioStation) {
    this.hooks.radioChanged.call(radioStation)
  }
}

const myCar = new Car()

// 注册事件

// The first argument is the name of your plugin.
// This name is used for diagnostic/debugging information.
myCar.hooks.carStarted.tap('EngineLampPlugin', () => {
  console.log('Car started!')
})

myCar.hooks.carStarted.tap('BluetoothPlugin', () => {
  console.log('Bluetooth enabled!')
})

myCar.hooks.radioChanged.tap('RadioPlugin', radioStation => {
  console.log(`Radio changed to ${radioStation}`)
})

myCar.turnOn()
myCar.setRadioStation('100.1')
// register
// register
// cal
// tap
// Car started!
// tap
// Bluetooth enabled!
// Radio changed to 100.1