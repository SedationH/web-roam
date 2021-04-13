/**
 * 这里是jQ的浅拷贝版本,方便理解
 */

; (function (global, factory) {
  factory(global)
})(window, function (window) {
  var
    jQuery = function (selector, context) {
      // 无new构造
      return new jQuery.fn.init(selector, context)
    };
  // 使用fn仅仅是为了方便
  jQuery.fn = jQuery.prototype = {
    constructor: jQuery,
    show: function () {
      console.log('这里是原型上的方法,也叫做实例方法，因为是创建出来的实例进行使用的，通常涉及dom相关')
    }
  }
  // 但jQuery中不是这样一个一个挂载的，而是通过extend函数统一挂上的
  jQuery.say = function () {
    console.log('这里是静态方法,通常与dom无关')
  }

  /**
   * extend所完成的效果，就是用来添加方法或者属性的
   * 具体api见官网，注意先了解
   * 下面先简单实现没有深copy版本的
   */
  jQuery.extend = jQuery.fn.extend = function () {
    var
      // 需要拓展进来的对象object1, object2 ...
      options,
      // object上的key
      name,
      copy,
      target = arguments[0] || {},
      i = 1,
      length = arguments.length;
    if (length === 1) {
      // 证明此时省略了tar,那么默认为jQuery or 实例 通过this动态适应
      target = this
      i--
    }
    for (; i < length; i++) {
      options = arguments[i]
      if (options !== undefined || options !== null) {
        for (name in options) {
          copy = options[name]

          // Don't bring in undefined values
          if (copy !== undefined) {
            target[name] = copy
          }
        }
      }
    }
  }

  /**
   * extend的用处很多，既可以用于写外部插件，也可以用于方便内部挂载
   */
  jQuery.extend({
    hi: function () {
      console.log('这里是通过extend挂载到jq上的 ajax就是这样子处理的')
    }
  })

  var
    init = jQuery.fn.init = function (selector, context) {
      console.log('使用时init进行初始化')
    };
  // 这样做的意义：让new init出的实例对象具有jQuery.fn上的方法
  init.prototype = jQuery.fn


  window.jQuery = window.$ = jQuery
});