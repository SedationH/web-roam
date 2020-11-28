import { initMixin } from './init'
import { stateMixin } from './state'
import { renderMixin } from './render'
import { eventsMixin } from './events'
import { lifecycleMixin } from './lifecycle'
import { warn } from '../util/index'

// 这里使用构造函数而不是class来实现，是为了保持下面
// 函数在向Vue.prototype上挂载方法时候的一致性
function Vue (options) {
  if (process.env.NODE_ENV !== 'production' &&
    !(this instanceof Vue)
  ) {
    warn('Vue is a constructor and should be called with the `new` keyword')
  }
  this._init(options)
}

// 都是在Vue.protortype上挂方法 使用的就是vue的实例

// _init 上面构造函数就在使用 用于初始化vm实例
initMixin(Vue)
// vm $data $props $set $delete $watch
stateMixin(Vue)
// $on $once $off $emit
eventsMixin(Vue)
// _uodate $forceUpdate $destroy
lifecycleMixin(Vue)
// $nextTick _render
renderMixin(Vue)

export default Vue
