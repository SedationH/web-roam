前置知识

渲染就是把模版和数据组合到一起 ejs...

传统两个实现

- 服务端渲染
  - 前后端Coupling
  - 服务端压力大
  - 用户体验不如spa
- 客户端渲染
  - 需要等待js解析完成才能看到页面，首屏加载时间过长
  - 不利于seo，dom是js生成的，搜索引擎处理不好



融合就解决了

![image-20201222211004705](http://picbed.sedationh.cn/image-20201222211004705.png)

用不用还是看业务需求

> ## [#](https://ssr.vuejs.org/#why-ssr)Why SSR?
>
> Compared to a traditional SPA (Single-Page Application), the advantage of SSR primarily lies in:
>
> - Better SEO, as the search engine crawlers will directly see the fully rendered page.
>
>   Note that as of now, Google and Bing can index synchronous JavaScript applications just fine. Synchronous being the key word there. If your app starts with a loading spinner, then fetches content via Ajax, the crawler will not wait for you to finish. This means if you have content fetched asynchronously on pages where SEO is important, SSR might be necessary.
>
> - Faster time-to-content, especially on slow internet or slow devices. Server-rendered markup doesn't need to wait until all JavaScript has been downloaded and executed to be displayed, so your user will see a fully-rendered page sooner. This generally results in better user experience, and can be critical for applications where time-to-content is directly associated with conversion rate.
>
> There are also some trade-offs to consider when using SSR:
>
> - Development constraints. Browser-specific code can only be used inside certain lifecycle hooks; some external libraries may need special treatment to be able to run in a server-rendered app.
> - More involved build setup and deployment requirements. Unlike a fully static SPA that can be deployed on any static file server, a server-rendered app requires an environment where a Node.js server can run.
> - More server-side load. Rendering a full app in Node.js is obviously going to be more CPU-intensive than just serving static files, so if you expect high traffic, be prepared for corresponding server load and wisely employ caching strategies.
>
> Before using SSR for your app, the first question you should ask is whether you actually need it. It mostly depends on how important time-to-content is for your app. For example, if you are building an internal dashboard where an extra few hundred milliseconds on initial load doesn't matter that much, SSR would be an overkill. However, in cases where time-to-content is absolutely critical, SSR can help you achieve the best possible initial load performance.



nuxt在vue上层套了一层，提供特殊的api，来实现同构渲染

https://nuxtjs.org/docs/2.x/get-started/directory-structure

感觉和过去使用的umi很相似，约定式，低配置

减少重复劳动，注意力集中于业务和需求

我想 这也是前端工程化的目的吧，当然还有业务的许多链路，这只是一个小流程



使用nuxt 完成 [realworld项目](https://github.com/SedationH/my-realworld/tree/frontends/nuxt)

学习了很多，实践很能锻炼人✨



deploy的过程也稍微记一下

```zsh
zip -r foo publish

ssh root@publicIP

scp foo.zip root@publicIP:/root
pm2 start yarn -- start
```

