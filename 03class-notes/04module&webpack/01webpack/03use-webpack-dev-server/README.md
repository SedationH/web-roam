## npm的一个知识点

##### npm version

semver 约定一个包的版本号必须包含3个数字，格式必须为 MAJOR.MINOR.PATCH, 意为 主版本号.小版本号(增加新功能).修订版本号（fix bug）. 可以简单地将版本号中相应的数字加1.

```
npm version major|minor|patch
```

##### 版本号~和^的区别：

- `~`会匹配最近的小版本依赖包，比如~1.2.3会匹配所有1.2.x版本，但是不包括1.3.0
- `^`会匹配最新的大版本依赖包，比如^1.2.3会匹配所有1.x.x的包，包括1.3.0，但是不包括2.0.0



webpack-dev-server ^3.xx.xx 无法与当前最新的 webpack-cli ^4.xx 适配

在执行yarn webpack-dev-server 的时候会报错



Solution：

1. webpack-cli ^4.x.x -> ^3.x.x
2. use `yarn webpack serve`



## 关于eval的一个用法

```js
eval('console.log(123) //# sourceURL=./foo/bar.js')
```

![image-20201026193501859](http://picbed.sedationh.cn/image-20201026193501859.png)

eval函数默认会运行在一个虚拟的环境中，可以通过sourceURL声明运行位置

eval 模式下就是通过在build的bundle.js中 eval函数后面加上对应的的sourceURL来实现定位的

![image-20201026195458031](http://picbed.sedationh.cn/image-20201026195458031.png)

注意 在 生成dist后 再 serve dist 看的会比较清楚 不要在dev模式下看



## devServer

可以制定额外的静态资源

场景：favicon.ico在dev模式下的引入, 一些不需要参与构建，但仍需要serve的资源

contentBase 寻找不到资源就来这里找

> 淦 webpack出5了 cli 也升4 了 这里感觉一堆版本坑 用着老版本还能正常走



先理解逻辑吧



