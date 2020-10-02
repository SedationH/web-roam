## 性能优化

前端性能优化包括很多方面，有网络相关的，也有css相关的，本篇集中于编写更加高性能的JavaScript



垃圾回收是需要语言都具有的特性。

对于JS来说，原始类型存储在栈内存中，栈内存由操作系统统一管理，对象类型存储在堆内存中，由引擎进行管理

所谓管理，就是 `申请 -> 使用 -> 释放`的过程

优化的重点在于释放掉我们不再需要的内存 -> 垃圾 -> Garbage

释放是有策略的  -> GC算法 -> Gabage Collection

> In [computer science](https://en.wikipedia.org/wiki/Computer_science), **garbage collection** (**GC**) is a form of automatic [memory management](https://en.wikipedia.org/wiki/Memory_management). The *garbage collector*, or just *collector*, attempts to reclaim *[garbage](https://en.wikipedia.org/wiki/Garbage_(computer_science))*, or memory occupied by [objects](https://en.wikipedia.org/wiki/Object_(computer_science)) that are no longer in use by the [program](https://en.wikipedia.org/wiki/Computer_program). Garbage collection was invented by American computer scientist [John McCarthy](https://en.wikipedia.org/wiki/John_McCarthy_(computer_scientist)) around 1959 to simplify manual memory management in [Lisp](https://en.wikipedia.org/wiki/Lisp_(programming_language)).[[2\]](https://en.wikipedia.org/wiki/Garbage_collection_(computer_science)#cite_note-2)



为了方便描述，此处定义从全局对象上开始，无法访问到的块内存，称为**不可达对象**，这种不可达对象就是需要进行释放的垃圾



## 常见的GC算法

### 引用计数

设计逻辑很简单，通过维护对每个创建的对象(使用内存中的堆内存)的引用计数器，来判断该堆内存是否需要进行回收

- 缺点

  - 不能处理循环引用的现象

  - 维护引用计数器的时间开销大

  - ```js
    function f = {
      const u1 = {}, u2 = {}
    	u1.next = u2
    	u2.next = u1
    }
    f()
    
    // 监管f函数调用结束了，在使用引用计数算法处理内存释放的时候，仍然无法释放u1, u2所使用的堆内存
    ```

- 优点

  - 处理及时，计数器为0就进行回收即可

### 标记清除算法

隔一段时间执行标记清除算法，整个过程分为两个阶段

1. 遍历标记所有可达对象
2. 遍历清除非可达对象，回收相应空间

- 缺点
  - 空间碎片化
- 优点
  - 解决对于循环引用对象的释放

### 标记整理算法

较于标记清除算法，在第二阶段回收前，先进行整理（可达对象集中存放），大范围统一释放堆内存，这样的所提供的堆内存空间是连续的

移动相关对象比较消耗时间



## v8 - JavaScript执行引擎

- 即时编译（JIT），一种解释运行的optimization，简单来说，就是对于翻译很多次的代码进行相关结果保存，再次执行不再翻译，而是直接调用过去保存的结果
  - 对于解释型还是编译型，最直接的区别在于前者要执行必须同时具有解释器，后者有直接的产品 -> 机器能够识别和直接执行
  - [Is JavaScript really interpreted or compiled language?](https://voidcanvas.com/is-javascript-really-interpreted-or-compiled-language/)

- 64位使用内存上限1.5g左右
  - 考虑到垃圾回收机制和JS单线程执行的模式
    - 以 1.5GB 的垃圾回收堆内存为例，V8 做一次小的垃圾回收需要50ms 以上，做一次非增量式的垃圾回收甚至要 1s 以上。
    - JS是单线程进行的，垃圾回收的时候就无法执行JS代码，要在效率和使用体验上做一个平衡
    - 无论是JS代码还是垃圾回收，都是JS引擎也就是v8在进行执行，两者在执行上不是并行的
  - 使用场景（web）



## v8垃圾回收机制

使用的堆内存的生命周期长 ? 老生代 : 新生代

针对不同堆内存的使用特点，使用不同的算法

很多文章图文并茂，写得很好了，回看不理解可以[参考1](https://cnodejs.org/topic/5d1cb1ee2beced2efd51f3c7) ， [参考2](https://segmentfault.com/a/1190000000440270#articleHeader15) 下

### 新生代

特点：垃圾回收频繁，对处理速度要求高，空间使用不大 32m ｜ 16m

处理方式：空间换时间 -> Scavenge (复制算法 + 标记整理)

算法逻辑如下

1. 新生代堆内存区域分为两个等大空间
   1. From 指当前活动对象直接使用的空间
   2. To 指空闲空间
2. 逻辑上就是把仍然活动的对象复制到To中，释放掉From中不活动的对象
   - 目前还不晓得具体实现，所以对于复制，清除中的实现细节理不清楚，核心在于v8 c++的实现是如何操作复制和清除逻辑的，这里留个坑
     - [深入1](https://segmentfault.com/a/1190000000440270#articleHeader15)
     - [深入2](https://github.com/tsy77/blog/issues/13)
3. 交换From 和 To指向



有些新生代的的变量会晋升到老圣代中，其特点如下

- 已经经历过一次 Scavenge 回收。
- To（闲置）空间的内存占用超过25%。

### 老生代

特点：大内存，变量存活概率大（生命周期普遍偏长）

> 64位环境下的V8引擎的新生代内存大小32MB、老生代内存大小为1400MB，而32位则减半，分别为16MB和700MB。

处理方式：标记清除+标记整理+增量标记

整体采用标记清除进行空间回收，但这个会引起空间碎片化，因此协调效率和使用体验，在达到一定阙值后进行标记整理 -> 紧缩内存使用

对于整个过程的处理使用增量标记

> 由于全停顿会造成了浏览器一段时间无响应，所以V8使用了一种增量标记的方式，将完整的标记拆分成很多部分，每做完一部分就停下来，让JS的应用逻辑执行一会，这样垃圾回收与应用逻辑交替完成。经过增量标记的改进后，垃圾回收的最大停顿时间可以减少到原来的1/6左右

> V8之所以限制了内存的大小，表面上的原因是V8最初是作为浏览器的JavaScript引擎而设计，不太可能遇到大量内存的场景，而深层次的原因则是由于V8的垃圾回收机制的限制。由于V8需要保证JavaScript应用逻辑与垃圾回收器所看到的不一样，V8在执行垃圾回收时会阻塞JavaScript应用逻辑，直到垃圾回收结束再重新执行JavaScript应用逻辑，这种行为被称为“全停顿”（stop-the-world）。若V8的堆内存为1.5GB，V8做一次小的垃圾回收需要50ms以上，做一次非增量式的垃圾回收甚至要1秒以上。这样浏览器将在1s内失去对用户的响应，造成假死现象。如果有动画效果的话，动画的展现也将显著受到影响



实际的场景中，都是在做tradeoff