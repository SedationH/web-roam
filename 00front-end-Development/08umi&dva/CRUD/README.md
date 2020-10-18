[视频链接在这里](https://www.bilibili.com/video/BV1qz411z7s3?p=6)

本项目是对umi和dva整合学习实现CUBD的记录

其实以前也倒腾过，想通过umi来学习工程化，然而复杂度和前驱知识太多，被干碎了，事实证明，前置基础还是要认真搞，不然学不下去，使用这种工具的人本应该就是已经是进阶的开发工程师了，我是跑的太快了。



- [dva](https://dvajs.com/)

- [umi](https://umijs.org/)



理一下使用library的相关联系

react 解决数据响应和视图映射

dva 解决数据流动和同步异步

umi 在实现router的基础上，提供插件系统，整合如react, dva,antd 在一个项目中

并支持配置式和约定式，方便开发

> Umi is based on routing, and supports both configuration routing and convention routing to ensure complete routing function experience



dva中有几个重要的概念

state

model

reducer

effect

subscription

dispactch

service

call

put

一图胜千言

![image-20201018174742658](http://picbed.sedationh.cn/image-20201018174742658.png)

理解的核心在于why?