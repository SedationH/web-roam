## Vue源码分析

这一节比较特殊，使用一个源码进行研究，因此不分文件夹了



每一个部分使用相应的md文件来汇总



这里是我耗时最长的一节，重要的收获是不再总是以实现的角度去思考使用了，事实上我也常常只是停留于🤔，📦封装提供思考便利性，屏蔽实现细节，应该逐层的分解实现去理解内容。

源码的阅读不简单，读带着目的性，经过一次这样的梳理，大概知道如何把握自己的目的性，来看研究的内容了。



目录

$ tree -L 1

- 00vue-theory 前置理论 建议先看
- 98router 根据Vue提供的api来实现一个自己的router
- 99import-vue 理解Vue框架的导入过程(自己基础不扎实)
- README.md
- [Preunderstanding](Preunderstanding.md) 一些整体结构理解
-  [virtualDOM.md](./virtualDOM.md ) 
-  [Reactive.md](Reactive.md) 
-  [Reactive2.md](Reactive2.md) 
-  [compile-template.md](./compile-template.md) 
-  vue 自己搞的源代码 没写多少...
-  vue-copy lg给的源代码 里面的注释更完善
- [homework](homework.md)

