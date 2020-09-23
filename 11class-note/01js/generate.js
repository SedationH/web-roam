function* foo() {
  console.log('start')
  // yield 'foo'
  let res = yield null
  console.log(`res: ${res}`)
  console.log('end')
}

const p = foo()
console.log(p)
// foo {<suspended>}
// 函数没有执行，只是返回了一个能够操作函数运行的指针

// console.log(p.next())
// start
// {value: "foo", done: false}
// 函数开始执行 返回yield后面的表达式

p.next(1)
p.next()


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
