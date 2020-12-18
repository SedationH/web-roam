## 参考vue-router 实现自己的router

想要达成的效果

完成 router-link 和 router-view 的对应渲染

实现嵌套路由

[Vue Router](https://router.vuejs.org/)



## 结构分析

```js
$ tree 
├── LICENSE
├── README.md
├── package.json
├── src
│   ├── components <router-view> & <router-link>
│   │   ├── link.js 
│   │   └── view.js
│   ├── create-matcher.js 根据映射关系创建matcher
│   ├── create-route-map.js 生成路由与组件的映射关系
│   ├── history 这里用了面向对象
│   │   ├── abstract.js
│   │   ├── base.js
│   │   ├── errors.js
│   │   ├── hash.js
│   │   └── html5.js
│   ├── index.js 入口
│   ├── install.js Vue的插件需要通过install方法载入
│   └── util
│       ├── async.js
│       ├── dom.js
│       ├── ... 略
└── types
    ├── ...
```



真切体会到了 **程序  = 算法 + 数据结构**

在分析一个小功能是在做什么、如何实现的时候，一个很重要的逻辑基础就是明确数据结构，在从这一点理解为什么算法要这样执行和设计



一些理解的前提分析，Vue-Router是在Vue的基础上，通过Vue.use()使用的路由插件

因此明确Vue给Vue-Router提供了什么，通过什么方式使用的Vue-Router，才能有实现的切入的思路

e.g. `mixin defineReactive component` 

分析从整体到局部，再从局部到整体。有些设计的细节是跨模块的，这些地方对理解造成了困难，需要从整体上思考。

也会感受到闭包的设计在整个过程中起到的巨大作用，还有个必要的基础 关于import的相关机制



下面展现的✍️思路，每个文件当时不一定是设计完整的，从这些入口debug来大致理解

## 自顶向下

### Vue.use

```js
function initUse (Vue) {
  Vue.use = function (plugin) {
    var installedPlugins = (this._installedPlugins || (this._installedPlugins = []));
    if (installedPlugins.indexOf(plugin) > -1) {
      return this
    }

    // additional parameters
    var args = toArray(arguments, 1);
    args.unshift(this);
    if (typeof plugin.install === 'function') {
      plugin.install.apply(plugin, args); // 因此我们实现的Vue-Router要有install方法挂在class Vue-Router上
      // 也通过这里 开始执行vue router的install 方法
      // 也让此时的install方法执行的this指向Vue-Router向上面挂参数
    } else if (typeof plugin === 'function') {
      plugin.apply(null, args);
    }
    installedPlugins.push(plugin);
    return this
  };
}
```

### install

```js
import Link from "./components/link";
import View from "./components/view";

export let _Vue = null;

export default Vue => {
  _Vue = Vue;
  _Vue.mixin({
    // 生命周期函数
    beforeCreate() {
      // 判断当前的 this 是否是根Vue实例
      if (this.$options.router) {
        this._routerRoot = this;
        this._router = this.$options.router; // 这个router是来自这里的
        // const router = new VueRouter({
        //   routes
				// });

        this._router.init(this);
        // 给vue实例增加一个响应式的属性 _route
        Vue.util.defineReactive(
          this,
          "_route",
          this._router.history.current
        );
      } else {
        this._routerRoot =
          (this.$parent && this.$parent._routerRoot) ||
          this;
      }
    }
  });

  // 注册全局组件
  _Vue.component(Link.name, Link);
  _Vue.component(View.name, View);

  Object.defineProperty(Vue.prototype, "$router", {
    get() {
      return this._routerRoot._router;
    }
  });

  Object.defineProperty(Vue.prototype, "$route", {
    get() {
      return this._routerRoot._route;
    }
  });
};
```

有些内容现在看不明白是正常的，这里只是想通过表层的调用来理解大致要做什么



## 自底向上

简单一句话 **建立映射关系，处理响应联系**



### 先来处理映射关系

就是

```js
const router = new VueRouter({
  routes
});
```

把这个routes搞成我们想要的内容，放在router中

```js
this._routes = options.routes || [];
// 匹配器对象
this.matcher = createMatcher(this._routes);
```

```js
// createRouteMap 解析路由表
// pathMap -->   { 路由地址：record对象(path, component, parent) }
const { pathList, pathMap } = createRouteMap(routes);
```

相应的数据结构

```typescript
type PathList = Array<string>
0: "/"
1: "/music"
2: "/music/pop"
3: "/music/rock"
4: "/about"
length: 5
__proto__: Array(0)


interface PathMapRecord {
  path: string;
  parentRecord: PathMapRecord;
  compont: object;
}

type PathMap = Record<string, PathMapRecord>;


/: {path: "/", component: {…}, parentRecord: undefined}
/about: {path: "/about", parentRecord: undefined, component: ƒ}
/music: {path: "/music", component: {…}, parentRecord: undefined}
/music/pop: {path: "/music/pop", component: {…}, parentRecord: {…}}
/music/rock: {path: "/music/rock", component: {…}, parentRecord: {…}}
__proto__: Object
```

parentRecord 是用来处理嵌套路由的重要数据



重要函数

```js
export default function createRouteMap(
  routes,
  oldPathList,
  oldPathMap
) {
  const pathList = oldPathList || [];
  const pathMap = oldPathMap || {};
  routes.forEach(route => {
    addRouteRecord(route, pathList, pathMap);
  });

  return {
    pathList,
    pathMap
  };
}

function addRouteRecord(
  route,
  pathList,
  pathMap,
  parentRecord
) {
  // 进行拼接 子组件 pop -> /music/pop
  const path = parentRecord
    ? `${parentRecord.path}/${route.path}`
    : route.path;

  // pathMap 的属性是 path ，值是record对象（path， component，parent）
  const record = {
    path: path,
    component: route.component,
    parentRecord: parentRecord
  };

  // 判断当前的路由表中是否已经存在对应的路径
  if (!pathMap[path]) {
    pathList.push(path);
    pathMap[path] = record;
  }

  // 判断当前的的route是否有子路由
  if (route.children) {
    route.children.forEach(subRoute => {
      addRouteRecord(subRoute, pathList, pathMap, record);
    });
  }
}

```



createMatcher 获取了 pathList & pathMap 后面导出的是两个函数

```js
import createRouteMap from "./create-route-map";
import createRoute from "./utils/route";

export default function createMatcher(routes) {
  // createRouteMap 解析路由表
  // pathMap -->   { 路由地址：record对象(path, component, parent) }
  const { pathList, pathMap } = createRouteMap(routes);
  function match(path) {
    return createRoute(pathMap[path], path);
  }

  console.log(match("/music"));
  console.log(match("/music/pop"));
  console.log(match("/foo"));

  function addRoutes(routes) {
    createRouteMap(routes, pathList, pathMap);
  }

  return {
    match,
    addRoutes
  };
}
```



测试一下

![image-20201127114457270](http://picbed.sedationh.cn/image-20201127114457270.png)



这便是match所能达到的效果，从path中可以拿到match到的所有component 并且嵌套的最外层就在match中的第一个，是有顺序的



实现起来并不复杂

这里就可以看出parentRecord在哪里使用的了

```js
export default function createRoute(record, path) {
  // 存储跟当前path 相关的所有record
  // path --> /music/path
  const matched = [];

  while (record) {
    matched.unshift(record);
    record = record.parentRecord;
  }
  return {
    matched,
    path
  };
}
```

