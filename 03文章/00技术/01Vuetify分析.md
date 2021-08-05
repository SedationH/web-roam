## repository 整体结构

```bash
$ tree -I "node_modules" -L 2
.
├── BACKERS.md
├── CODE_OF_CONDUCT.md
├── Dockerfile
├── LICENSE.md
├── MIGRATION.md
├── README.md
├── SECURITY.md
├── crowdin.yml
├── ecosystem-win.config.js
├── ecosystem-wsl.config.js
├── ecosystem.config.js
├── eslint-local-rules.js
├── jest.config.js
├── lerna.json
├── package.json
├── packages # monorepo 管理 分了三个小 packages 分开管理
│   ├── README.md
│   ├── api-generator
│   ├── docs # 文档 packages
│   └── vuetify # vuetify 框架源代码
├── scripts
│   ├── build.js
│   ├── confirm-npm-tag.js
│   ├── converter.js
│   ├── deploy-and-alias.js
│   ├── deploy.sh
│   ├── dev.js
│   ├── lint-commit-message.js
│   ├── no-render-string-reference.js
│   ├── parse-npm-tag.js
│   ├── post-install.js
│   ├── post-release-merge.js
│   ├── prepare-commit-message.js
│   └── warn-npm-install.js
├── tsconfig.json
├── vercel.json
└── yarn.lock
```



使用yarn 的 workspace 模式进行依赖管理

`package.json`

```json
  "private": true,
  "workspaces": [
    "packages/*"
  ],
```



利用lerna 处理 三个 packages 之间的依赖 （没用过，感觉和 yarn  workspace 功能有些重合，待研究

// TODO

> The Vuetify repository is a [lerna](https://github.com/lerna/lerna) monorepo that connects the vuetify library, docs, api generator, and reduces the friction of working with multiple projects at once. The following guide is designed to get you up and running in no time.



## `/pacakges/doc`  

研究的重点放在

1. 如何处理由文档进行的路由生成
2. 可交互组件在文档中如何进行解析和渲染



```bash
# /vuetify/packages/docs/src/pages/en
$ tree -L 1
├── about
│   ├── code-of-conduct.md
│   ├── meet-the-team.md
│   ├── security-disclosure.md
│   └── sponsors-and-backers.md
├── components
│   ├── alerts.md
│   ├── app-bars.md
│   ├── application.md
│   ├── aspect-ratios.md
│   ├── autocompletes.md # 下面二级展开略
├── directives
├── features
├── getting-started
├── home.md
├── introduction
├── resources
└── styles
```

可见Vuetify的官方文档除了 API 里的内容，其他都是在这里用 `*.md` 进行写好存储的



API可能属于变动较多 并且和Vuetify内 数据组织强相关的内容，因此使用

```bash
├── packages # monorepo
│   ├── README.md
│   ├── api-generator # 这个进行生成
```



以Alert为例子

![image-20210723102230856](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b981c05f8a434a36b34e312eaaafe782~tplv-k3u1fbpfcp-zoom-1.image)

对应 

```markdown
## Usage

Alerts in their simplest form are a flat [sheets of paper](/components/sheets) that display a message.

<usage name="v-alert" />
```



大概思路知道了，路由是根据 api-generator && packages/docs/src/pages/**/*.md 进行生成的

而交互组件是根据解析md(x) 内容 -> 根据内容中的一些tag 从而引用写好的Component

(这一套在 Gatsby里有一套很完整的生态)



## routes 生成逻辑

`packages/docs/src/router/index.js`

```js
import {
  abort,
  layout,
  locale,
  redirect,
  route,
  trailingSlash,
} from '@/util/routes'

export function createRouter (vuetify, store, i18n) {
  const loadedLocales = ['en']
  const router = new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    scrollBehavior: (...args) => scrollBehavior(vuetify, store, ...args),
    routes: [
      locale([
        ...Object.keys(redirects).map(k => ({
          path: k.replace(/^\//, ''),
          redirect: () => redirects[k].replace(/^\//, ''),
        })),
        layout('Home', [route('Home')]),
        layout('Default', [route('Documentation')], ':category/:page/'),
        layout('Wireframe', [route('Wireframes', 'examples/wireframes/:wireframe/')]),
        layout('Default', [abort()]),
      ]),
     // ...

```

`/Users/sedationh/workspace/source/vuetify/packages/docs/src/util/routes.js`

```js
export function layout (name = 'Default', children = [], path = '') {
  const dir = kebabCase(name)

  return {
    children,
    component: () => import(
      /* webpackChunkName: "layout-[request]" */
      `@/layouts/${dir}/index.vue`
    ),
    path,
  }
}
  
  export function route (name, path = '', strict = true) {
  return {
    name,
    component: () => import(
      /* webpackChunkName: "views-[request]" */
      `@/views/${name}`
    ),
    path,
    pathToRegexpOptions: { strict },
  }
}
```



` layout('Default', [route('Documentation')], ':category/:page/'),`

layout('Default' -> `packages/docs/src/layouts/default/index.vue` 作为具体文档内容的父亲



内容（*.md）本身使用`packages/docs/src/views/Documentation.vue`作为模版



## mdx 解析逻辑

`packages/docs/src/views/Documentation.vue`



```js
  export default {
    name: 'DocumentationView',

    async asyncData ({ route, store }) {
      const md = await load(route)

      store.state.pages.md = md
    },
    
    // ...
    
    computed: {
      ...sync('pages', [
        'frontmatter',
        'toc',
        'md',
      ]),
      ...get('route', [
        'hash',
        'params@category',
        'params@page',
      ]),
    },
    
    async created () {
      if (IN_BROWSER && !this.$vuetify.isHydrating) {
        await this.$options.asyncData({
          route: this.$route,
          store: this.$store,
        })
      }

      this.init(this.md)
```



同时支持 ssr  和 客户端生成



拿本地文件（ api-gen 要先进行

```js
  async function load (route) {
    const { category, page } = route.params
    const isApi = category === 'api'
    const locale = localeLookup(route.params.locale)

    const context = isApi
      ? await import(
        /* webpackChunkName: "api-[request]" */
        `@/api/${locale}.js`
      )
      : await import(
        /* webpackChunkName: "documentation-[request]" */
        `@/pages/${locale}.js`
      )

    const path = ['.']

    if (!isApi) path.push(category)

    path.push(page)

    try {
      return context.default(`${path.join('/')}.md`)
    } catch (err) {
      return {
        vue: {
          component: (await error()).default,
        },
      }
    }
  }
```



可是 document 的 父是怎么拿到所有的路由的呢？

这里虽然完成了视图 和 数据(md) 的映射 但没办法完成整个列表的获取



来到 Default 的 Drawer看下处理

`packages/docs/src/layouts/default/Drawer.vue`



```
      drawer: sync('app/drawer'),
```

好吧 依赖于 store 

`packages/docs/src/store/modules/app.js`

```js
// Data
const state = {
  branch: getBranch(),
  categories: {
    api: {
      icon: '$mdiFlaskOutline',
      color: 'orange',
    },
    components: {
      icon: '$mdiViewDashboardOutline',
      color: 'indigo darken-1',
    },
    features: {
      icon: '$mdiImageEditOutline',
      color: 'red',
    },
    directives: {
      icon: '$mdiFunction',
      color: 'blue-grey',
    },
    'getting-started': {
      icon: '$mdiSpeedometer',
      color: 'teal',
    },
    introduction: {
      icon: '$mdiScriptTextOutline',
      color: 'green',
    },
    about: {
      icon: '$mdiVuetify',
      color: 'primary',
    },
    resources: {
      icon: '$mdiTeach',
      color: 'pink',
    },
    styles: {
      icon: '$mdiPaletteOutline',
      color: 'deep-purple accent-4',
    },
    themes: {
      icon: '$mdiScriptTextOutline',
      color: 'pink',
    },
  },
  drawer: null,
  nav: [],
  scrolling: false,
  search: false,
  settings: false,
  version: null,
}
```

原来是预先写好的



没有通过node 来进行文件读取动态列表内容



## 如何在 views/Document.vue 中拿到 对应页面的 md文件

先说结论

Vuetfiy 开发者自己写了一些插件，解析md文件，生成对应的bundle

利用 webpack 提供的 require.resolve 来形成

map -> bundle 的文件请求映射，对应下面代码会出现的context

来请求相应的bundle



### 自顶向下分析

packages/docs/src/views/Documentation.vue

```js
...
  async created() {
    if (IN_BROWSER && !this.$vuetify.isHydrating) {
      await this.$options.asyncData({
        route: this.$route,
        store: this.$store
      });
    }

    this.init(this.md);
  ...
  
  
// created声明周期 asyncData
  
  async asyncData({ route, store }) {
    const md = await load(route);

    store.state.pages.md = md;
  },
    
// 注意 context, 这个文件里会有 require.resolve()来形成所有的map
async function load(route) {
  const { category, page } = route.params;
  const isApi = category === "api";
  const locale = localeLookup(route.params.locale);

  const context = isApi
    ? await import(
        /* webpackChunkName: "api-[request]" */
        `@/api/${locale}.js`
      )
    : await import(
        /* webpackChunkName: "documentation-[request]" */
        `@/pages/${locale}.js`
      );

      return context.default(`${path.join("/")}.md`);

```



这里的作用就是请求来这里会拿到一个由webpack在构建过程中读取文件系统形成的map

packages/docs/src/pages/en.js

```js
export default require.context('./en', true, /\.md$/)
```



### 如何理解 require.context

考虑如下场景

packages/03context/webpack.config.js

```js
const path = require('path')

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
  devtool: 'source-map',
}
```

packages/03context/src/index.js

```js
import _ from 'lodash'

function importAll() {
  contextLoader.keys().forEach(id => console.log(contextLoader(id)))
}

const contextLoader = require.context('./demos', true, /\.js/)
importAll(contextLoader)
```

packages/03context/src/demos/b.js

```js
module.exports = {
  name: 'a',
}
// b.js
module.exports = {
  name: 'b',
}

```



最后形成的bundle映射 -> 

`/******/  var __webpack_modules__ = ({`

```js
(local var) __webpack_modules__: {
    "../../node_modules/lodash/lodash.js": (module: any, exports: any, __webpack_require__: any) => void;
    "./src/demos/a.js": (module: any) => void;
    "./src/demos/b.js": (module: any) => void;
    "./src/demos sync recursive \\.js": (module: any, __unused_webpack_exports: any, __webpack_require__: any) => void;
}
```



这个是解决运行时的请求



### 来源呢？ -> plugin

packages/docs/package.json

```json
  "vuePlugins": {
    "service": [
      "./plugins/@vuetify/ssg.js"
    ]
  }
```

packages/docs/plugins/@vuetify/config/base.js

```js
  config
    .plugin('pages-plugin')
    .use(path.resolve('./build/pages-plugin.js'))

```

packages/docs/build/pages-plugin.js

```js
class Plugin {
  apply(compiler) {
    const files = generateFiles(true);
    let shouldWrite = false;

    const virtualModules = new VirtualModulesPlugin(files);

    virtualModules.apply(compiler);


    compiler.hooks.afterCompile.tapPromise("PagesPlugin", async () => {
      if (!shouldWrite) return;

      for (const [key, value] of Object.entries(generateFiles())) {
        virtualModules.writeModule(key, value);
      }

      shouldWrite = false;
    });

    compiler.hooks.watchRun.tapPromise("PagesPlugin", async compiler => {
      shouldWrite = !!Object.keys(
        compiler.watchFileSystem.watcher.mtimes
      ).find(path => path.indexOf("src/pages"));
    });
  }
}

module.exports = Plugin;
```



这里是文件处理的核心



```js
const { md } = require("./markdown-it"); // 自定义的一堆配置
const fm = require("front-matter"); // 读取文件开头 --- - tag: [] 这样的信息
const fs = require("fs");
const glob = require("glob"); // 方便读文文件目录
const path = require("path");
const VirtualModulesPlugin = require("webpack-virtual-modules"); // 构建 bundle
```



build一下可以看到生成的bundle

```shell
$ tree dist -d -L 2
dist
├── css
├── en
│   ├── about
│   ├── api
│   ├── components
│   ├── directives
│   ├── examples
│   ├── features
│   ├── getting-started
│   ├── introduction
│   ├── resources
│   └── styles
├── img
│   └── icons
└── js
```

可见生成了相应的bundle

