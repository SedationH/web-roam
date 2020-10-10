const { compose } = require("lodash/fp")

function ajax(url) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open('GET', url)
    xhr.responseType = 'json'
    xhr.onload = function () {
      if (this.status === 200) {
        resolve(this.response)
      } else {
        reject(new Error(this.statusText))
      }
    }
    xhr.send()
  })
}

ajax('api/urls.json')
  .then(
    res => console.log(res),
    err => console.log(err)
  ).then(
    _ => new Promise.reject()
  ).catch(
    err => console.log(err)
  )

// Promise中有异常穿透，可以方便的统一捕获异常