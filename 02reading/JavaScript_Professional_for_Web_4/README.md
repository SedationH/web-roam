## 迭代器模式 

任何实现Iterable接口的数据结构都可以被实现Iterator接口的结构consume。

迭代器(iterator)是按需创建的一次性对象。



实现Iterable接口要求同时具备两种能力：

1. 支持迭代的自我识别能力
2. 创建实现Iterator接口对象的能力



通过👇的例子进行理解

说range是iterable, because range has function factory to  generate iterator

```js
const range = {
  from: 1,
  to: 5,
}

// 默认生成迭代器的工厂函数
range[Symbol.iterator] = function () {
  console.log('call once')
  // 返回一个迭代器
  return {
    current: this.from,
    last: this.to,
    next() {
      // console.log(this)
      
      // IteratorResult
      return this.current <= this.last
        ? {
            done: false,
            value: this.current++,
          }
        : {
            done: true,
            value: undefined,
          }
    },
  }
}

for (const a of range) {
  console.log(a)
}

// 和上面完成一样的效果
// 所以也就晓得this的指向了
// 每次都是指向iterator的
const iterator = range[Symbol.iterator]()
while (true) {
  const { done, value: a } = iterator.next()
  if (done) {
    break
  }
  console.log(a)
}

```



书里还提了一个return

```js
const range = {
  from: 1,
  to: 5,
}

// 默认生成迭代器的工厂函数
range[Symbol.iterator] = function () {
  console.log('call once')
  // 返回一个迭代器
  return {
    current: this.from,
    last: this.to,
    next() {
      // IteratorResult
      return this.current <= this.last
        ? {
            done: false,
            value: this.current++,
          }
        : {
            done: true,
            value: undefined,
          }
    },
    return() {
      console.log('return invoke')
      return {
        done: true,
      }
    },
  }
}

for (const a of range) {
  if (a > 3) break
  console.log(a)
}

// call once
// 1
// 2
// 3
// return invoke
```



实际写代码的时候，并不需要显式调用这个工厂函数来生成迭代器。能够接收可迭代对象的语言特性会自动调用他们的。

```js
const arr = Array.from(range)
console.log(arr)
// call once
// [ 1, 2, 3, 4, 5 ]
console.log(...range)
// call once
// 1 2 3 4 5
```

- for ... of
- 数组解构
- Array.from
- 创建Set Map
- Promise all race
- yield* 操作符 在生成器中时使用



[参考理解](https://javascript.info/iterable)

注意Array.from对iterable和array-like的处理，挺有意思

中间提到的surrogate pairs是emoji用两个utf-16来处理的。由引出js对string的处理都是utf-16，而大多是地方的交互都是utf-8，不知道这里有坑没有

```js
var len = "😀".length // 2
```

```js
function slice(str, start, end) {
  return Array.from(str).slice(start, end).join('');
}

let str = '𝒳😂𩷶';

alert( slice(str, 1, 3) ); // 😂𩷶

// the native method does not support surrogate pairs
alert( str.slice(1, 3) ); // garbage (two pieces from different surrogate pairs)
```

Objects that can be used in `for..of` are called *iterable*.

- Technically, iterables must implement the method named`Symbol.iterator`.
  - The result of `obj[Symbol.iterator]()` is called an *iterator*. It handles further iteration process.
  - An iterator must have the method named `next()` that returns an object `{done: Boolean, value: any}`, here `done:true` denotes the end of the iteration process, otherwise the `value` is the next value.
- The `Symbol.iterator` method is called automatically by `for..of`, but we also can do it directly.
- Built-in iterables like strings or arrays, also implement `Symbol.iterator`.
- String iterator knows about surrogate pairs.

Objects that have indexed properties and `length` are called *array-like*. Such objects may also have other properties and methods, but lack the built-in methods of arrays.

If we look inside the specification – we’ll see that most built-in methods assume that they work with iterables or array-likes instead of “real” arrays, **because that’s more abstract.**

