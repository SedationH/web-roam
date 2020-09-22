// resolve 和 reject的处理结果对应当前Promise状态的Fulfilled & Rejected
new Promise((resolve, reject) => {
  // 没有执行 resolve | reject的时候是pending
  setTimeout(() => {
    resolve(1)
  }, 200)
}).then(
  function onfulfiled(result) {
    console.log(result)
  },
  function onRejected(err) {
    console.log(err)
  }
)