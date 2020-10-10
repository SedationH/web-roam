# React Hooks

[Form](https://www.bilibili.com/video/BV1Ge411W7Ra?from=search&seid=14953575724224954503)

UI = f(date) ？

hook 是钩子

[具体使用](https://www.ruanyifeng.com/blog/2019/09/react-hooks.html)



## 如何描述UI(User Interface)

![image-20200529101303354](http://picbed.sedationh.cn/image-20200529101303354.png)

 

消息和重算抽象为行为

数据拆分：不变的是属性，变化的是状态

![image-20200529101424602](http://picbed.sedationh.cn/image-20200529101424602.png)

而状态影射了行为，因此可以封装在状态内

![image-20200529101532629](http://picbed.sedationh.cn/image-20200529101532629.png)

在状态和视图之外，还有个作用

![image-20200529101713894](http://picbed.sedationh.cn/image-20200529101713894.png)

So，许多概念与视图关联(hook)

![image-20200529101916483](http://picbed.sedationh.cn/image-20200529101916483.png)



## 什么是Hooks

- 重新定义UI是什么，有哪些要素
  - state hook
  - effect hook
  - context hook
  - reducer hooks
- 函数View = f(props,state) ,UI = View useHooks1()&&useHooks2...

