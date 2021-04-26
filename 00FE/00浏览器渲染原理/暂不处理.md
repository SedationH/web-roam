# 浏览器渲染原理

From :

- [饥人谷总结](https://www.jianshu.com/p/25334407b281)
- [深入浅出浏览器渲染原理](https://blog.fundebug.com/2019/01/03/understand-browser-rendering/)

**简述网页的渲染机制**

- 解析HTML标签，构建DOM树。
- 解析CSS标签，构建CSSOM树。
- 把DOM和CSSOM组合成渲染树（render tree）。
- 在渲染树的基础上进行布局，计算每个节点的几何结构。
- 把每个节点绘制到屏幕上（painting）。



## css的link & @improt



1. 加载页面时，`link`标签引入的 CSS 被同时加载；`@import`引入的 CSS 将在页面加载完毕后被加载。 最后加载

```css
<link rel="stylesheet" href="./style/2.css">
<link rel="stylesheet" href="./style/3.css">


// 1.css

html{
  background-color: pink;
}

// 2.css
@import './1.css';

html {
  height: 100vh;
}

// 3.css 空
```

![image-20200503101636427](http://picbed.sedationh.cn/image-20200503101636427.png)

2. @improt必须放在文档最前面

```css
// 更改2.css

html {
  height: 100vh;
}

@import './1.css';

```



![image-20200503101809793](http://picbed.sedationh.cn/image-20200503101809793.png)

没有获取1.css