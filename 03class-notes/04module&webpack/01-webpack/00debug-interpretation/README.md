## 看dist-annalyse 中的代码

加Tip: 的是自己的分析

```js
// Tip: xxx
```



源码好多还看不大明白，debug走走流程感受下思路就好



这里提一个配置项

```js
output: {
  pubicPath: "dist/"
}
```



这里解决的问题就是一些比如图片这样的资源在引用的时候，路径不匹配的问题

![image-20201026102806008](http://picbed.sedationh.cn/image-20201026102806008.png)

![image-20201026102824798](http://picbed.sedationh.cn/image-20201026102824798.png)

