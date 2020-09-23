function* foo() {
  console.log('start')
  // yield 'foo'
  let res = yield 'foo'
  console.log(`res: ${res}`)
  console.log('end')
  return undefined
}

const p = foo()
console.log(p)
// foo {<suspended>}

// 函数没有执行，只是返回了一个能够操作函数运行的指针

console.log(p.next())
// start
// {value: "foo", done: false}

// 函数开始执行 返回第一个yield后面的表达式

console.log(
  p.next(1)
)
// res: 1
// end
// {value: undefined, done: true}

// 参数传给刚刚停在位置的yield表达式
// 程序接着执行
// 因为下面没有yield 可以等价想为结尾有一个
// return undefined


console.log('***************')

function* gen() {
  yield 123 + 456;
}

const g = gen()
console.log(
  g.next(),
  g.next()
)
// {value: 579, done: false} {value: undefined, done: true}

function* f() {
  console.log('start')
  try {
    console.log(1)
    yield null
    console.log(2)
  } catch (err) {
    console.log(err)
  }
}

const err = f()
err.next()
// start
// 1
// 还可以通过拿到的generate向函数内部抛出异常
err.throw(new Error('Generator error'))
// 相当于让所停在的yield抛出异常,特殊的next