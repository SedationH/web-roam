const { curry } = require('lodash')
// setTimeout(function () {
//   var a = 'hello'
//   setTimeout(function () {
//     var b = 'lagou'
//     setTimeout(function () {
//       var c = 'IvU'
//       console.log(a + b + c)
//     }, 1000)
//   }, 1000)
// }, 1000)

// new Promise((resolve => {
//   setTimeout(() => {
//     resolve('hello')
//   }, 100);
// })).then(
//   v => new Promise(resolve => {
//     setTimeout(() => {
//       resolve(v + 'lagou')
//     }, 100);
//   })
// ).then(
//   v => new Promise(resolve => {
//     setTimeout(() => {
//       resolve(v + 'ivU')
//     }, 100);
//   })
// ).then(console.log)

// const fp = require('lodash/fp')
// //数据
// // horsepower马力, dollar_value价格,in_tock库存

// const cars =
//   [
//     { name: 'Ferrari FF', horsepower: 660, dollar_value: 700000, in_stock: true },
//     { name: 'Spyker c12 zagato', horsepower: 650, dollar_value: 648000, in_stock: false },
//     { name: 'Jaguar XKR-S', horsepower: 550, dollar_value: 132000, in_stock: false },
//     { name: 'Audi R8', horsepower: 525, dollar_value: 114200, in_stock: false },
//     { name: 'Aston Martin one-77 ', horsepower: 750, dollar_value: 1850000, in_stock: true },
//     { name: 'Pagani Huayra', horsepower: 700, dollar_value: 1300000, in_stock: false },
//   ]

// let isLastInstock = function (cars) {//获取最后一条数据
//   let last_car = fp.last(cars)
//   //获取最后一条数据的in_stock属性值
//   return fp.prop('in_stock', last_car)
// }

// const getInStockProp = fp.curry(fp.prop('in_stock'))
// const isLastInstock = fp.flowRight(getInStockProp, fp.last)

// console.log(
//   isLastInstock(cars)
// )

// const getNameProp = fp.curry(fp.prop('name'))

// const getFirstCarName = fp.flowRight(getNameProp, fp.first)
// console.log(getFirstCarName(cars))

// let _average = function (xs) {
//   return fp.reduce(fp.add, 0, xs) / xs.length
// }// <-无须改动
// let averageDollarValue = function (cars) {
//   let dollar_values = fp.map(function
//     (car) {
//     return car.dollar_values
//   }, cars)
//   return _average(dollar_values)
// }

// const getDollarValuesArray = fp.curry(fp.map(item => item.dollar_value))

// const averageDollarValue = fp.flowRight(_average,getDollarValuesArray)
// console.log(averageDollarValue(cars))

// const underscore = fp.replace(/\W+/g, '一')//<--无须改动，并在sanitizeNames中使用它

// const sanitizeNames = fp.flowRight(fp.map(fp.flowRight(underscore, fp.lowerCase)))
// console.log(
//   sanitizeNames(["Hello World", 'Big Bang'])
// )

// const fp = require('lodash/fp')
// const { Maybe, Container } = require('./functor')
// let maybe = Maybe.of([5, 6, 1])

// const add1 = fp.curry(fp.add(1))

// const ex1 = (array) => {
//   return fp.map(add1, array)
// }

// maybe.map(ex1).map(console.log)
// // [ 6, 7, 2 ]

// const fp = require('lodash/fp')
// const { Maybe, Container } = require('./functor')
// let xs = Container.of(['do', 'ray',
//   'me', 'fa', 'so', 'la', 'ti', 'do'])
// let ex2 = value => {
//   return fp.first(value)
// }

// xs.map(ex2).map(console.log)

// const fp = require('lodash/fp')
// const { Maybe, Container } = require('./functor')
// let safeProp = fp.curry(function (x, o) {
//   return Maybe.of(o[x])
// })
// let user = { id: 2, name: 'Albert' }
// const ex3 = (value) => {
//   safeProp('name', value).map(
//     fp.flowRight(fp.first, fp.split(''), fp.trim)
//   ).map(
//     v => ans = v
//   )
//   return ans
// }

// Container.of(user).map(ex3).map(console.log)

const fp = require('lodash/fp')
const { Maybe, Container } = require('./functor')
const ex4 = n => Maybe.of(n).map(parseInt)

ex4(null).map(console.log)