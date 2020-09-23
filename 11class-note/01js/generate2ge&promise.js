function ajax(url) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open('GET', url)
    xhr.responseType = 'json'
    xhr.onload = () => {
      if (xhr.status === 200) {
        resolve(xhr.response)
      } else {
        reject(new Error(xhr.statusText))
      }
    }
    xhr.send()
  })
}

function* main() {
  const users = yield ajax('/api/users.json')
  console.log(users)

  const posts = yield ajax('/api/posts.json')
  console.log(posts)

  const urls = yield ajax('/api/urls.json')
  console.log(urls)
}

const g = main()

const result = g.next()
result.value.then(
  res => {
    const result = g.next(res)
    result.value.then(
      res => {
        const result = g.next(res)
        result.value.then(
          res => {
            const result = g.next(res)
            console.log(result)
            // {value: undefined, done: true}
          }
        )
      }
    )
  }
)
// 可见这是个递归调用的过程，进行抽象

function co(generator) {
  const g = generator()

  function handleResult(result) {
    if (result.done) return // 生成器函数结束
    result.value.then(data => {
      handleResult(g.next(data))
    }, error => {
      g.throw(error)
    })
  }

  handleResult(g.next())
}

co(main)

// 还有一个比较好玩，注意看这个文件的结果，成对出现
// 这里好好再想想