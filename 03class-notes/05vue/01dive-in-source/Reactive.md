## Vue的响应式处理

### 前提概念 

Watcher & Dep

```js
// 发布者-目标-dependency
class Dep {
  constructor() {
    // 记录所有的订阅者
    this.subs = []
  }
  // 添加订阅者
  addSub(sub) {
    if (sub && sub.update) {
      this.subs.push(sub)
    }
  }
  // 发布通知
  notify() {
    this.subs.forEach((sub) => {
      sub.update()
    })
  }
}
// 订阅者-观察者 收到通知后 进行更新
class Watcher {
  // 观察者内部有实现update的方法，供发布者调用
  update() {
    console.log("update")
  }
}

// 测试
let dep = new Dep()
let watcher = new Watcher()

dep.addSub(watcher)
dep.notify()
```

从视图和数据的角度来看，视图是Watcher 实现 update方法，数据收集来自视图的订阅，当数据更新的时候，notify所有的Watcher进行视图更新



## 具体实现

Vue源码中响应式的实现比较复杂，因为要考虑的比较全面，理解起来会有些吃力

核心思想是一致的

通过Watcher来更新视图 通过Dep来收集依赖

observe -> Observe ->  defineReactive 设置get & set方法 将Watcher & Dep联系起来实现响应式



看下更新的时候,注意调用栈，async进行视图统一更新的，需要单独打断点

![image-20201207214654556](http://picbed.sedationh.cn/image-20201207214654556.png)



写了个mindnode

![image-20201214212546304](http://picbed.sedationh.cn/image-20201214212546304.png)

###  Watcher

- 没有静态方法，$watch要用到Vue的实例
- 创建顺序
  - 1 计算属性
  - 2 用户（侦听器
  - 3 渲染

打断点在Watcher的构造函数上

![image-20201205212353062](http://picbed.sedationh.cn/image-20201205212353062.png)

![image-20201205212412771](http://picbed.sedationh.cn/image-20201205212412771.png)

![image-20201205212428937](http://picbed.sedationh.cn/image-20201205212428937.png)



### $nextTick

- Vue更新Dom是异步执行的，批量处理
- 所以我们对数据的修改在函数执行过程中不能立刻反应在视图了，想要在函数中对视图对数据变动产生相应后获取相关信息，就要异步处理，等待视图更新后异步执行

```js
callbacks.push(function () {
  if (cb) {
    try {
      cb.call(ctx);
    } catch (e) {
      handleError(e, ctx, 'nextTick');
    }
  } else if (_resolve) {
    _resolve(ctx);
  }
});
if (!pending) {
  pending = true;
  timerFunc();
}
```

```js
// 异步处理 降级

// Here we have async deferring wrappers using microtasks.
// In 2.5 we used (macro) tasks (in combination with microtasks).
// However, it has subtle problems when state is changed right before repaint
// (e.g. #6813, out-in transitions).
// Also, using (macro) tasks in event handler would cause some weird behaviors
// that cannot be circumvented (e.g. #7109, #7153, #7546, #7834, #8109).
// So we now use microtasks everywhere, again.
// A major drawback of this tradeoff is that there are some scenarios
// where microtasks have too high a priority and fire in between supposedly
// sequential events (e.g. #4521, #6690, which have workarounds)
// or even between bubbling of the same event (#6566).
var timerFunc;

// The nextTick behavior leverages the microtask queue, which can be accessed
// via either native Promise.then or MutationObserver.
// MutationObserver has wider support, however it is seriously bugged in
// UIWebView in iOS >= 9.3.3 when triggered in touch event handlers. It
// completely stops working after triggering a few times... so, if native
// Promise is available, we will use it:
/* istanbul ignore next, $flow-disable-line */
if (typeof Promise !== 'undefined' && isNative(Promise)) {
  var p = Promise.resolve();
  timerFunc = function () {
    p.then(flushCallbacks);
    // In problematic UIWebViews, Promise.then doesn't completely break, but
    // it can get stuck in a weird state where callbacks are pushed into the
    // microtask queue but the queue isn't being flushed, until the browser
    // needs to do some other work, e.g. handle a timer. Therefore we can
    // "force" the microtask queue to be flushed by adding an empty timer.
    if (isIOS) { setTimeout(noop); }
  };
} else if (!isIE && typeof MutationObserver !== 'undefined' && (
  isNative(MutationObserver) ||
  // PhantomJS and iOS 7.x
  MutationObserver.toString() === '[object MutationObserverConstructor]'
)) {
  // Use MutationObserver where native Promise is not available,
  // e.g. PhantomJS, iOS7, Android 4.4
  // (#6466 MutationObserver is unreliable in IE11)
  var counter = 1;
  var observer = new MutationObserver(flushCallbacks);
  var textNode = document.createTextNode(String(counter));
  observer.observe(textNode, {
    characterData: true
  });
  timerFunc = function () {
    counter = (counter + 1) % 2;
    textNode.data = String(counter);
  };
} else if (typeof setImmediate !== 'undefined' && isNative(setImmediate)) {
  // Fallback to setImmediate.
  // Technically it leverages the (macro) task queue,
  // but it is still a better choice than setTimeout.
  timerFunc = function () {
    setImmediate(flushCallbacks);
  };
} else {
  // Fallback to setTimeout.
  timerFunc = function () {
    setTimeout(flushCallbacks, 0);
  };
}

function nextTick (cb, ctx) {
  var _resolve;
  callbacks.push(function () {
    if (cb) {
      try {
        cb.call(ctx);
      } catch (e) {
        handleError(e, ctx, 'nextTick');
      }
    } else if (_resolve) {
      _resolve(ctx);
    }
  });
  if (!pending) {
    pending = true;
    timerFunc();
  }
  // $flow-disable-line
  if (!cb && typeof Promise !== 'undefined') {
    return new Promise(function (resolve) {
      _resolve = resolve;
    })
  }
}
```



## MORE

更多相关细节参考 [more](./Reactive2.md)