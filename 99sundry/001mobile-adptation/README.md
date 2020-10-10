## 媒体查询📖

[示例](https://zh.learnlayout.com/media-queries.html)

```css
@media (max-width: 200px) {
  html {
    background-color: yellow;
  }
}

@media screen and (min-width: 200px) and (max-width: 300px) {
  html {
    background-color: green;
  }
}
```

screen代表显示屏幕🖥 可以省略

200px的时候会显示绿色 但上下调换就会显示红色

所以min-width 和 max-width控制的都是带等号的 <=     >= 

同时符合谁在下面依照谁的要求



## px em rem

[参看1](https://zhuanlan.zhihu.com/p/39811831)

em -> 根据父亲  son中 1em =  father.fontSize



rem  -> root em 任意位置 1rem =  root.fontSize

```js
const root = document.documentElement
// 1rem = root.style.fontSize

// 常见375设计稿的rem适配方案
root.style.fontSize = root.clientWidth / 37.5 + 'px'
```





## 一些概念🥰

[参看1](https://juejin.im/post/5d5e867fe51d4557ca7fdd4f)

[参看2](https://github.com/jawil/blog/issues/21)

像素(pixel) 

​	是计算机世界显示的最小不可分割的点

显示分辨率 

​	是显示器的行和列所包含的像素点,如1366px*768px

PPI(pixels per inch) 

​	是每英寸上有多少个像素 -> 画面细腻与否

设备像素 dp (device pixel)

​	物理设备在制造时决定的发光点

设备独立像素 dip (device independt pixel)

​	因为高ppi设备的出现，方便css书写而对dp进行的封装

设备像素比 dpr (device pixel ratio)

​	封装比例  ->  1个独立设备像素包含多少设备像素




## meta标签

Form:

- [sf](https://segmentfault.com/a/1190000010342600)
- [MND meta](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/meta)

### 元数据

> 首先需要了解一下**元数据(metadata)元素**的概念，用来构建HTML文档的基本结构，以及就如何处理文档向浏览器提供信息和指示，它们本身不是文档内容，但提供了关于后面文档内容的信息。——出自《html5权威指南》

如title、base、meta都是元数据元素



### meta元素

| 元素   |                meta                |
| ------ | :--------------------------------: |
| 父元素 |                head                |
| 属性   | http-equiv、name、content、charset |



### 用法

除了

```html
<meta charset="UTF-8">
```

其他都是结合content来用

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="keywords" content="前端，博客">
<meta name="author" content="SedationH">
<meta name="description" content="个人前端经验分享">
<meta http-equiv="refresh" content="3;url=https://www.mozilla.org">
```



### name

| 元数据名称(name的值) |                             说明                             |
| :------------------: | :----------------------------------------------------------: |
|   application name   |                 当前页所属Web应用系统的名称                  |
|       keywords       |         描述网站内容的关键词,以逗号隔开，用于SEO搜索         |
|     description      |                         当前页的说明                         |
|        author        |                        当前页的作者名                        |
|      copyright       |                           版权信息                           |
|       renderer       | renderer是为双核浏览器准备的，用于指定双核浏览器默认以何种方式渲染页面 |
|      viewreport      |                 它提供有关视口初始大小的提示                 |

一个典型的针对移动端优化的站点包含类似下面的内容：

```html
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
```

| Value           | 可能值                               | 描述                                                         |
| :-------------- | :----------------------------------- | :----------------------------------------------------------- |
| `width`         | 一个正整数或者字符串 `device-width`  | 以pixels（像素）为单位， 定义viewport（视口）的宽度。        |
| `height`        | 一个正整数或者字符串 `device-height` | 以pixels（像素）为单位， 定义viewport（视口）的高度。        |
| `initial-scale` | `一个0.0` 到`10.0之间的正数`         | 定义设备宽度（纵向模式下的设备宽度或横向模式下的设备高度）与视口大小之间的缩放比率。 |
| `maximum-scale` | `一个0.0` 到`10.0之间的正数`         | 定义缩放的最大值；它必须大于或等于`minimum-scale`的值，不然会导致不确定的行为发生。 |
| `minimum-scale` | 一个`0.0` 到`10.0`之间的正数         | 定义缩放的最小值；它必须小于或等于`maximum-scale`的值，不然会导致不确定的行为发生。 |
| `user-scalable` | 一个布尔值（`yes` 或者`no`）         | 如果设置为` no`，用户将不能放大或缩小网页。默认值为` yes`。  |



对viewport深入理解，见[MDN viewport](https://developer.mozilla.org/zh-CN/docs/Web/CSS/Viewport_concepts) and [聊聊viewport](https://juejin.im/post/5a910349f265da4e9449cffd)



### http-equiv



属性定义了一个编译指示指令。这个属性叫做 `**http-equiv**(alent)` 是因为所有允许的值都是特定HTTP头部的名称，如下：

- `content-security-policy`
  它允许页面作者定义当前页的 [内容策略](https://developer.mozilla.org/en-US/docs/Web/Security/CSP/CSP_policy_directives)。 内容策略主要指定允许的服务器源和脚本端点，这有助于防止跨站点脚本攻击。

- `content-type`
  如果使用这个属性，其值必须是"`text/html; charset=utf-8`"。注意：该属性只能用于[MIME type](https://wiki.developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types)为 `text/html` 的文档，不能用于MIME类型为XML的文档。

- ```
  default-style
  ```

  设置默认CSS样式表组的名称。

- `x-ua-compatible`

  If specified, the `content` attribute must have the value "`IE=edge`". User agents are required to ignore this pragma.

- ```
  refresh
  ```

  这个属性指定:

  - 如果 `content` 只包含一个正整数,则是重新载入页面的时间间隔(秒);
  - 如果 `content` 包含一个正整数并且跟着一个字符串 '`;url=`' 和一个合法的 URL，则是重定向到指定链接的时间间隔(秒)

