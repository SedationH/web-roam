## 说说 application/json 和 application/x-www-form-urlencoded 二者之间的区别。

都是**Content-Type**的属性

在数据或者文件处理方面，常用的属性

1. **application/ x-www-form-urlencoded**
2. **multipart/form-data**
3. **application/json**

In requests, (such as [`POST`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/POST) or [`PUT`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/PUT)), the client tells the server what type of data is actually sent.

上机实践

```js
const axios = require('axios')
const qs = require('qs')

const request = axios.create({
  baseURL: 'http://localhost:3000',
})

const q1 = request.post('/', {
  name: 'SedationH',
  age: 21,
  type: 'application/json',
})

const q2 = request.post(
  '/',
  qs.stringify({
    name: 'SedationH',
    age: 21,
    type: 'application/x-www-form-urlencoded',
  })
)

const ans = Promise.all([q1, q2])

console.log(ans)
```

![image-20210127124943368](http://picbed.sedationh.cn/image-20210127124943368.png)

![image-20210127125008762](http://picbed.sedationh.cn/image-20210127125008762.png)

>  Tip:
>
> ​	axios根据我们传入数据的特点，自动进行了Content-type的设置

详细参考 [00Content-type](00Content-type)

## 说一说在前端这块，角色管理你是如何设计的。

这里的说法我理解为**权限控制**如何设计

see [access-control](access-control.md)



## @vue/cli 跟 vue-cli 相比，@vue/cli 的优势在哪？

没用过vue-cli 那就摘一下优势

Vue CLI is a full system for rapid Vue.js development, providing:

- Interactive project scaffolding via `@vue/cli`.

- Zero config rapid prototyping via `@vue/cli` + `@vue/cli-service-global`.

- A runtime dependency (

  ```
  @vue/cli-service
  ```

  ) that is:

  - Upgradeable;
  - Built on top of webpack, with sensible defaults;
  - Configurable via in-project config file;
  - Extensible via plugins

- A rich collection of official plugins integrating the best tools in the frontend ecosystem.

- A full graphical user interface to create and manage Vue.js projects.

Vue CLI aims to be the standard tooling baseline for the Vue ecosystem. It ensures the various build tools work smoothly together with sensible defaults so you can focus on writing your app instead of spending days wrangling with configurations. At the same time, it still offers the flexibility to tweak the config of each tool without the need for ejecting.



## 详细讲一讲生产环境下前端项目的自动化部署的流程。

自己还没搞过自动化部署，就说说看到的资料



先看下手动的过程

方案一

client :run buid -> zip -> ftp -> 

server: unzip -> rename & some server config

方案二

client:  git push

server: git clone/pull -> run build -> mv & some config

自动化就是针对👆的流程用软件实现，利用一些hooks

🔧  语言（任意 实现我们想要的自动化逻辑就好）  + docker 方便运维



## 你在开发过程中，遇到过哪些问题，又是怎样解决的？请讲出两点。

开发浏览器插件的时候，需要监听所有种类的用户页面操作

焦点从页面的移出和转入，页面的打开和关闭

History.back()、History.forward()、History.go()事件是会触发popstate事件的，但是History.pushState()和History.replaceState()不会触发popstate事件。

这里需要对原生的函数加个事件包装

```js
// 重写方法
const _wr = type => {
  const origin = history[type]
  return function(...args) {
    // 先调用函数，再派发事件
    Reflect.apply(origin, this, args)
    const event = new Event(type)
    window.dispatchEvent(event)
  }
}
history.pushState = _wr('pushState')
history.replaceState = _wr('replaceState')
```

但包上发现也没得用，后来才意识到content-script和webscript的环境都不一样，外面拿不到这事件的

怎么解决的？自己写demo尝试，看更多的资料



## 针对新技术，你是如何过渡到项目中？

还在踩坑，vue3就把我坑哭了，没有好用的devtools，vuex不支持



在学webpack的过程中也有类似的体验，事实发现技术只是用来解决需求的方法，新如果是必要的，显著提效/降低认知负担，那就上

还没啥发言权，做的还太少



[最近看到的一篇文章](https://refined-x.com/2019/02/27/%E7%BB%99%E5%89%8D%E7%AB%AF%E8%87%AA%E5%AD%A6%E8%80%85%E7%9A%84%E5%BB%BA%E8%AE%AE/)