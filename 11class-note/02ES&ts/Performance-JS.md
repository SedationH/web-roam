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

