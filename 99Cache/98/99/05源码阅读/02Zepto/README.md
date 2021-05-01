# Zepto

> **Zepto** is a minimalist **JavaScript library for modern browsers** with a largely **jQuery-compatible API**. *If you use jQuery, you already know how to use Zepto.*
>
> While 100% jQuery coverage is not a design goal, the **APIs provided match their jQuery counterparts**. The goal is to have a ~5-10k modular library that **downloads and executes fast**, with a **familiar and versatile API**, so you can **concentrate on getting stuff done**.



[官网](https://zeptojs.com/)

[源码阅读](https://yeyuqiudeng.gitbooks.io/reading-zepto/content/)

[视频相关（❤️强推）](https://www.imooc.com/video/13219)

[源码注视？](https://www.kancloud.cn/wangfupeng/zepto-design-srouce/173692)



## extend 函数

相较于jQ，Zepto源码中的extend函数看起来舒服很多



```js
function extend(target, source, deep) {
  for (key in source)
    if (deep && (isPlainObject(source[key]) || isArray(source[key]))) {
      if (isPlainObject(source[key]) && !isPlainObject(target[key]))
        target[key] = {}
      if (isArray(source[key]) && !isArray(target[key]))
        target[key] = []
      extend(target[key], source[key], deep)
    }
    else if (source[key] !== undefined) target[key] = source[key]
}

// Copy all but undefined properties from one or more
// objects to the `target` object.
$.extend = function (target) {
  var deep, args = slice.call(arguments, 1)
  if (typeof target == 'boolean') {
    deep = target
    target = args.shift()
  }
  args.forEach(function (arg) { extend(target, arg, deep) })
  return target
}
```

