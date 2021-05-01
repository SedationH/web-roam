; (function (global, factory) {
  factory(global)
})(window, function (window) {
  var
    jQuery = function (selector, context) {
      return new jQuery.fn.init(selector, context)
    };

  jQuery.fn = jQuery.prototype = {
    constructor: jQuery,
  }
  jQuery.isPlainObject = function (obj) {
    var proto, Ctor;

    // 排除掉明显不是obj的以及一些宿主对象如Window
    if (!obj || toString.call(obj) !== "[object Object]") {
      return false;
    }

    /**
     * getPrototypeOf es5 方法，获取 obj 的原型
     * 以 new Object 创建的对象为例的话
     * obj.__proto__ === Object.prototype
     */
    proto = Object.getPrototypeOf(obj);

    // 没有原型的对象是纯粹的，Object.create(null) 就在这里返回 true
    if (!proto) {
      return true;
    }

    /**
     * 以下判断通过 new Object 方式创建的对象
     * 判断 proto 是否有 constructor 属性，如果有就让 Ctor 的值为 proto.constructor
     * 如果是 Object 函数创建的对象，Ctor 在这里就等于 Object 构造函数
     */
    Ctor = Function.call(proto, "constructor") && proto.constructor;

    // 在这里判断 Ctor 构造函数是不是 Object 构造函数，用于区分自定义构造函数和 Object 构造函数
    return typeof Ctor === "function" && Function.toString.call(Ctor) === Function.toString.call(Object);
  }

  jQuery.extend = jQuery.fn.extend = function () {
    var
      // 需要拓展进来的对象object1, object2 ...
      options,
      // object上的key
      name,
      copy,
      // 深拷贝新增的四个变量 deep、src、copyIsArray、clone
      deep = false,
      // 源目标，需要往上面赋值的
      src,
      // 需要拷贝的值的类型是函数
      copyIsArray,
      // 用于clone src
      clone,
      // 拓展目标对象，可能为空
      target = arguments[0] || {},
      i = 1,
      length = arguments.length;
    if (typeof target === 'boolean') {
      deep = target
      target = arguments[i] || {}
      i++
    }

    if (typeof target !== 'object' && typeof target !== 'function') {
      target = {}
    }

    if (length === 1) {
      // 证明此时省略了tar,那么默认为jQuery or 实例 通过this动态适应
      target = this
      i--
    }
    for (; i < length; i++) {
      options = arguments[i]
      // 既不是null也不是undefined
      if (options != null) {
        for (name in options) {
          copy = options[name]

          // 遇到循环引用的情况就跳过
          if (target === copy) continue

          // 要递归的对象必须是 plainObject 或者数组
          if (deep && copy && jQuery.isPlainObject(copy) ||
            (copyIsArray = Array.isArray(copy))
          ) {

            // 源目标，需要把值赋在上面
            src = target[name]

            // 这里还是挺迷的，回头看
            if (copyIsArray) {
              copyIsArray = false
              clone = src && Array.isArray(src) ? src : []
            } else {
              clone = src && isPlainObject(src) ? src : {}
            }

            target[name] = jQuery.extend(deep, clone, copy)
          } else if (copy !== undefined) {
            // Don't bring in undefined values
            target[name] = copy
          }
        }
      }
    }
    return target
  }


  var
    init = jQuery.fn.init = function (selector, context) {
      console.log('使用时init进行初始化')
    };
  // 这样做的意义：让new init出的实例对象具有jQuery.fn上的方法
  init.prototype = jQuery.fn


  window.jQuery = window.$ = jQuery
});