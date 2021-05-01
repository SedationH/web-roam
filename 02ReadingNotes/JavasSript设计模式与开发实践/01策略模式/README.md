## 基本

策略模式的定义是：

定义一系列算法，把他们一个个封装起来，并且使他们可以相互替换。



目的是：

分离算法的使用和算法的实现



组成上：

策略类，这个策略类有多个，不同的策略类自己实现自己的算法，有统一的调用接口

环境类，包含，算法执行所依赖的环境，可以使用不同的策略类进行调用。

开发者直接使用的是环境类



JS相较于传统面向对象的开发语言，特殊在于函数，函数可以作为对象直接使用。

也就是说，我们原先可能不需要new不同的策略，来让环境类进行调用

现在通过一个又一个函数就好了，函数直接作为策略类

具体来说

## CODE

### 传统

```js
function StrategyA() {}
StrategyA.prototype.calculate = function (salary) {
  return salary * 3
}

function StrategyB() {}

StrategyB.prototype.calculate = function (salary) {
  return salary * 2
}

function StrategyC() {}

StrategyC.prototype.calculate = function (salary) {
  return salary
}

function Salary(salary, strategy) {
  this.salary = salary
  this.strategy = strategy
}

Salary.prototype.getCalculatedSalary = function () {
  return this.strategy.calculate(this.salary)
}

const s1 = new Salary(100, new StrategyA())
console.log(s1.getCalculatedSalary())
```



### JS

```js
const strategy = {
  StrategyA(salary) {
    return salary * 3
  },
  StrategyB(salary) {
    return salary * 2
  },
  StrategyC(salary) {
    return salary
  },
}

function Salary(salary, strategy) {
  this.salary = salary
  this.strategy = strategy
}

Salary.prototype.getCalculatedSalary = function () {
  return this.strategy(this.salary)
}

const s1 = new Salary(100, strategy.StrategyA)
console.log(s1.getCalculatedSalary())
```



salary可以接着简化

```js
const strategy = {
  StrategyA(salary) {
    return salary * 3
  },
  StrategyB(salary) {
    return salary * 2
  },
  StrategyC(salary) {
    return salary
  },
}

function getSalary(salary, strategy) {
  return strategy(salary)
}

const s1 = getSalary(100, strategy.StrategyA)
console.log(s1)
```



## 具体场景

通过Web校验场景，考虑更加复杂的情况。

```js
const $submit = document.querySelector('#submit')
function formValidate() {
  if(校验1)
  if(校验2)
  if(校验3)
  if(校验4)
  ...
}
$submit.addEventListener('click', formValidate)
```

分析这个场景的分离需求

校验对象 validator

校验规则 rules



validator 包含当前需要进行校验目标的上下文

包含

- 校验谁？
- 调用哪些校验？

通过向validator上添加不同的rules来实现具体的校验



## 思考一等函数对象与策略模式

在传统的对象语言中

不同的算法需要依托于不同的Strategy类来实现调用



在JS中，函数即对象，不需要再依托于Strategy累来实现调用

我们可以在函数调用的时候就传入不同的函数来实现不同算法的使用

策略模式的核心是分离算法实现和Context

在函数可作为参数的编程模式中，这个语言本身就融入了策略模式。