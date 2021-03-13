## V8引擎

https://v8.dev/

V8 is Google’s open source high-performance JavaScript and WebAssembly engine, written in C++. It is used in Chrome and in Node.js, among others. It implements [ECMAScript](https://tc39.es/ecma262/) and [WebAssembly](https://webassembly.github.io/spec/core/), and runs on Windows 7 or later, macOS 10.12+, and Linux systems that use x64, IA-32, ARM, or MIPS processors. V8 can run standalone, or can be embedded into any C++ application.

https://en.wikipedia.org/wiki/V8_(JavaScript_engine)

V8 first generates an abstract syntax tree with its own parser. Then, Ignition, the V8 interpreter, generates bytecode from this syntax tree using the internal V8 bytecode format.[[12\]](https://en.wikipedia.org/wiki/V8_(JavaScript_engine)#cite_note-12) TurboFan is the V8 optimizing compiler, it takes this bytecode and generates machine code from it. In other words, V8 compiles [JavaScript](https://en.wikipedia.org/wiki/JavaScript) directly to native [machine code](https://en.wikipedia.org/wiki/Machine_code) using [just-in-time compilation](https://en.wikipedia.org/wiki/Just-in-time_compilation) before executing it.[[13\]](https://en.wikipedia.org/wiki/V8_(JavaScript_engine)#cite_note-13) The compiled code is additionally optimized (and re-optimized) dynamically at runtime, based on heuristics of the code's execution profile. Optimization techniques used include [inlining](https://en.wikipedia.org/wiki/Inlining), [elision](https://en.wikipedia.org/wiki/Copy_elision) of expensive runtime properties, and [inline caching](https://en.wikipedia.org/wiki/Inline_caching). The [garbage collector](https://en.wikipedia.org/wiki/Garbage_collection_(computer_science)) is a [generational](https://en.wikipedia.org/wiki/Tracing_garbage_collection#Generational_GC_(ephemeral_GC)) [incremental](https://en.wikipedia.org/wiki/Tracing_garbage_collection#Stop-the-world_vs._incremental_vs._concurrent) collector.[[14\]](https://en.wikipedia.org/wiki/V8_(JavaScript_engine)#cite_note-14)

简单来说，V8是JS的编译器，JS被V8生成相应machine code并且进行运行时再优化，还提供GC功能。



## GC

对于JS来说，原始类型存储在栈内存中，栈内存由操作系统统一管理，对象类型存储在堆内存中，由引擎进行管理

所谓管理，就是 `申请 -> 使用 -> 释放`的过程

优化的重点在于释放掉我们不再需要的内存 -> 垃圾 -> Garbage

释放是有策略的  -> GC算法 -> Gabage Collection

> In [computer science](https://en.wikipedia.org/wiki/Computer_science), **garbage collection** (**GC**) is a form of automatic [memory management](https://en.wikipedia.org/wiki/Memory_management). The *garbage collector*, or just *collector*, attempts to reclaim *[garbage](https://en.wikipedia.org/wiki/Garbage_(computer_science))*, or memory occupied by [objects](https://en.wikipedia.org/wiki/Object_(computer_science)) that are no longer in use by the [program](https://en.wikipedia.org/wiki/Computer_program). Garbage collection was invented by American computer scientist [John McCarthy](https://en.wikipedia.org/wiki/John_McCarthy_(computer_scientist)) around 1959 to simplify manual memory management in [Lisp](https://en.wikipedia.org/wiki/Lisp_(programming_language)).[[2\]](



针对不同的空间使用特点使用不同的算法进行处理

在64位系统下，V8最多只能分配1.4G, 在 32 位系统中，最多只能分配0.7G。V8 为什么要给它设置内存上限？是由两个因素所共同决定的

1、JS单线程的执行机制

2、JS垃圾回收机制的限制

因为JS是单线程运行的，所以一旦进入到垃圾回收，那么其它的各种运行逻辑都要暂停; 同时垃圾回收其实又是非常耗时间的操作，就会造成程序卡顿，影响性能。所以V8就限制了堆内存的大小。

堆内存由两部分组成：

1、**新生代内存：** 临时分配的内存，存活时间短。

2、**老生代内存：** 常驻内存，存活的时间长。



## 算法细节

略，能理解，记不住。。



## 优化策略

先大致说下这些策略的出发点

1. JS的作用域链机制下，逐步向上一层的[[Scope]]中进行查询
2. 闭包机制下，会保存本应该被释放掉的[[Scope]]
3. 涉及DOM的操作，可能会触发 reflow | repaint
4. 不同的API内部实现有性能差异
5. 考虑编译逻辑中的词法，语法，语法树分析
6. 减少内存申请的次数



1. 常用变量局部缓存

2. 闭包

   1. ```js
      function f(){
        const node = document.getElementById('btn')
        node.onclick = function(){
          console.log(node.id)
        }
      }
      f()
      ```

   2. via onclick 绑定的函数在调用时不处于f的作用域,仍然可以拿到`node.id`，闭包机制在这里起了作用

   3. node被引用，无法被回收

   4. ```js
      function f(){
        var node = document.getElementById('btn')
        node.onclick = function(){
          console.log(node.id)
        }
        node = null // 如果是const怎么处理？ delete mdn说can' t
        
        // let , null
      }
      f()
      ```

3. 尽量减少对象属性访问，可以缓存下来

4. 遍历性能 : forEach > for > for in

5. 使用文档碎片统一操作dom

6. 能cloneELement 用clone instead of create

7. 事件委托




## 好玩的Memory Snap

注意我们创建的节点

```js
const body = document.querySelector('body')

const el1 = document.createElement('div')
const el2 = document.createElement('div')

body.append(el1)
```

下面是形成的DOM

![image-20210313215958444](http://picbed.sedationh.cn/image-20210313215958444.png)



查看Memory

![image-20210313220119146](http://picbed.sedationh.cn/image-20210313220119146.png)



![image-20210313220134620](http://picbed.sedationh.cn/image-20210313220134620.png)