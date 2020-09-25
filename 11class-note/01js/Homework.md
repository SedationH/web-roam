一、谈谈你是如何理解JS异步编程的,EventLoop、消息队列都是做什么的,什么是宏任务,什么是微任务?

[JS运行机制.md](./JS运行机制.md)

**代码题**

一、将下面异步代码使用Promise的方式改进

```js
setTimeout(function () {
  var a = 'hello'
  setTimeout(function () {
    var b = 'lagou'
    setTimeout(function () {
      var c = 'IvU'
      console.log(a + b + c)
    }, 1000)
  }, 1000)
}, 1000)
```

```js
new Promise((resolve => {
  setTimeout(() => {
    resolve('hello')
  }, 100);
})).then(
  v => new Promise(resolve => {
    setTimeout(() => {
      resolve(v + 'lagou')
    }, 100);
  })
).then(
  v => new Promise(resolve => {
    setTimeout(() => {
      resolve(v + 'ivU')
    }, 100);
  })
).then(console.log)
```

二、基于以下代码完成下面的四个练习

```js
const fp = require('lodash/fp')
//数据
// horsepower马力, dollar_value价格,in_tock库存

const cars =
  [
    { name: 'Ferrari FF', horsepower: 660, dollar_value: 700000, in_stock: true },
    { name: 'Spyker c12 zagato', horsepower: 650, dollar_value: 648000, in_stock: false },
    { name: 'Jaguar XKR-S', horsepower: 550, dollar_value: 132000, in_stock: false },
    { name: 'Audi R8', horsepower: 525, dollar_value: 114200, in_stock: false },
    { name: 'Aston Martin one-77 ', horsepower: 750, dollar_value: 1850000, in_stock: true },
    { name: 'Pagani Huayra', horsepower: 700, dollar_value: 1300000, in_stock: false },
  ]
```

练习1:使用函数组合fp.flowRight()重新实现下面这个函数

```js
let isLastInstock = function (cars) {//获取最后一条数据
  let last_car = fp.last(cars)
  //获取最后一条数据的in_stock属性值
  return fp.prop('in_stock', last_car)
}
```

```js
const getInStockProp = fp.curry(fp.prop('in_stock'))
const isLastInstock = fp.flowRight(getInStockProp, fp.last)

console.log(
  isLastInstock(cars)
)
```

练习2:使用fp.flowRight()、fp.prop()和fp.first()获取第一个car的name

```js
const getNameProp = fp.curry(fp.prop('name'))

const getFirstCarName = fp.flowRight(getNameProp, fp.first)
console.log(getFirstCarName(cars))
```

练习3:使用帮助函数_average重构averageDollarValue,使用函数组合的方式实现

```js
let _average = function (xs) {
  return fp.reduce(fp.add, 0, xs) / xs.length
}// <-无须改动
let averageDollarValue = function (cars) {
  let dollar_values = fp.map(function
    (car) {
    return car.dollar_values
  }, cars)
  return _average(dollar_values)
}
```

```js
const getDollarValuesArray = fp.curry(fp.map(item => item.dollar_value))

const averageDollarValue = fp.flowRight(_average,getDollarValuesArray)
console.log(averageDollarValue(cars))
```

练习4:使用flowRight写一个sanitizeNames()函数,返回一个下划线连接的小写字符串,把数组中的name转换为这种形式:例如:

sanitizeNames(["Hello World"]) => ["hello-world"]

```js
let underscore = fp.replace(/\W+/g, '一')//<--无须改动，并在sanitizeNames中使用它
```

```js
const sanitizeNames = fp.flowRight(fp.map(fp.flowRight(underscore, fp.lowerCase)))
console.log(
  sanitizeNames(["Hello World", 'Big Bang'])
)
```

三、基于下面提供的代码,完成后续的四个练习

使用[functor.js](./functor.js)

练习1:使用fp.add(x, y)和fp.map(f,x)创建一个能让functor里的值增加的函数ex1

```js
const fp = require('lodash/fp')
const { Maybe, Container } = require('./functor')
let maybe = Maybe.of([5, 6, 1])

const add1 = fp.curry(fp.add(1))

const ex1 = (array) => {
  return fp.map(add1, array)
}

maybe.map(ex1).map(console.log)
// [ 6, 7, 2 ]
```

练习2:实现一个函数ex2,能够使用fp.first获取列表的第一个元素

