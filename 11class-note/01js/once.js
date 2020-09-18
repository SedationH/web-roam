function once(fn) {
  let done = false
  return function (...args) {
    if (!done) {
      done = true
      return fn.apply(this, args)
    }
  }
}

const pay = once(function (money) {
  console.log(`支付${money}成功✅`)
})

pay(1)
pay(2)

/**
 * 支付1成功✅
 */