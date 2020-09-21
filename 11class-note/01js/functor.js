const { join } = require("lodash")

class Container {
  // 省略通过new来创建对象 更加函数式
  static of(value) {
    return new Container(value)
  }

  constructor(value) {
    this._value = value
  }

  // map利用fn处理变形关系，产生新的Container
  map(fn) {
    return Container.of(fn(this._value))
  }
}

const r = Container.of(3)
  .map(x => x + 2)
  .map(x => x * x)

console.log(r)

// 由此可见，函数式编程的运算不直接操作值，而是借助函子完成
// 所谓函子就是一个实现了map，存有值的对象

// 为了解决空值异常，引入Mabe函子
class MayBe {
  static of(value) {
    return new MayBe(value)
  }

  constructor(value) {
    this._value = value
  }

  map(fn) {
    // 实际上就是在fn执行前增加了一个空值处理
    return this.isNothing() ? MayBe.of(this._value)
      : MayBe.of(fn(this._value))
  }

  isNothing() {
    return this._value === null || this._value === undefined
  }
}

const r2 = MayBe.of(null)
  .map(x => x.toLowerCase())

console.log(r2)

// 为了解决异常造成的副作用，引入Either函子

// 产生异常的情况
class Left {
  static of(value) {
    return new Left(value)
  }

  constructor(value) {
    this._value = value
  }

  // 这里让map直接返回当前函子
  map() {
    return this
  }
}

// 正常处理的情况
class Right {
  static of(value) {
    return new Right(value)
  }

  constructor(value) {
    this._value = value
  }

  map(fn) {
    return Right.of(fn(this._value))
  }
}

function parseJSON(json) {
  try {
    return Right.of(JSON.parse(json))
  } catch (e) {
    return Left.of({ message: 'error' })
  }
}

console.log(
  parseJSON('{ "name": "zs" }').map(x => x.name.toUpperCase()),
  parseJSON('{ name: "zs" }').map(x => x.name.toUpperCase())
)