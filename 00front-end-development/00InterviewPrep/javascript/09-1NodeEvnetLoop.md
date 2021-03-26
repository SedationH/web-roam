## Multitasking

### Single process

one marchine run one process at the same time

OS call some things need to stop the OS, then run the progress

### Cooperative Multitasking

yield comes, cooperative multitasking, the running process call yield to pause current process, then run OS

但在这种机制下，如果当前运行的程序出现问题，就无法通过调用yield来转换到OS，从而造成整个系统的崩溃

### Preemptive Multitasking

让系统来进行优先级调用

通过时间片机制，运行代码，暂停并保存当前上下文与状态，在不同的Process进行切换

即使只有一个CUP也能也能向外表现的同时面向多个程序执行许多CPU任务

### Symmetric Multi Threading (SMT)

task is the more generic concept 

process is a more specific concept in the kernel

这一步更多的是在优化性能，如何更好的利用一个cpu，引入thread并在CPU和相关指令集上进行并行指令的适配

![image-20210325102308520](http://picbed.sedationh.cn/image-20210325102308520.png)

IPC (Inter-Process Communicaltion) 的实现是 Socket 

Socket的关键在于 source -> buffer -> some of  in a packet-> transmit -> get parcket -> assemble

不同thread对 shared memory space 的读取可能产生 race condition

it is hard to write correct muti-threaded code that is bug free like even for a  seasoned developer

Node.js 对这里的处理方案就是，在代码方面不提供Multi Thread



## Node.js

**All JavaScript ,V8, and the event loop run in one thread, called the main thread**

node 里有1/3左右的C++代码

JS调用的方法有些 back by JS itself, 有些是 back by C++

对于back by C++的情况，分异步同步

C++ backed sychronous methods run in the main thread

**C++ backed asynchronous methods some times dont run in the main thread**



对于👆加粗的情况，给出相关例子

运行代码的机器是 dual-core Intel i5

(环境对执行理解有重要影响)

### Crypto

加密用，这个需要大量的CPU运算



同步情况

![image-20210325104218776](http://picbed.sedationh.cn/image-20210325104218776.png)

![image-20210325104232674](http://picbed.sedationh.cn/image-20210325104232674.png)



异步情况

以下图标的语境都是异步

Parallel

![image-20210325105001652](http://picbed.sedationh.cn/image-20210325105001652.png)

![image-20210325104308237](http://picbed.sedationh.cn/image-20210325104308237.png)

在相互独立的线程上运行

NUM__ REQUESTS 增加至4

![image-20210325104547420](http://picbed.sedationh.cn/image-20210325104547420.png)

why？

bottlenect  is dual-core

我们在具体执行指令层面来看，同一时间，顶多有俩CPU同时干活

现在有四个线程。就是各分两个，在CUP对于所分配到进行的执行上来看，还是进行Preemptive multitasking，表现为同时开始和结束

![image-20210325110030656](http://picbed.sedationh.cn/image-20210325110030656.png)

当 NUM_REQUESTS 增加到 6

这里为什么不表现为每个cpu分三个呢？

**Node.js uses a pre-allocated set of threads called the Thread Poll. The default is 4**

第五个请求需要放到等待队列中，直到Thread Poll中有空闲的thread提供



### Http(s)

这里为了测试的可预测、稳定和一致性

做了一些准备

足够大，服务器稳定，不用CDN

![image-20210325110612228](http://picbed.sedationh.cn/image-20210325110612228.png)

![image-20210325110814960](http://picbed.sedationh.cn/image-20210325110814960.png)

NUM_REQUESTS = 4

![image-20210325110906578](http://picbed.sedationh.cn/image-20210325110906578.png)

下载的过程中，东西是放入内存的，

limitation is the net work itself

CPU在这里不干啥活

NUM_REQUESTS = 6

![image-20210325111119190](http://picbed.sedationh.cn/image-20210325111119190.png)

依然没有增加，所以可见这里的异步并不受Thread Poll的影响

解释

C++ backed methods use C++ asynchronous primitives whenever possible

- linux epoll
- macOS kqueue
- Win GetqueuedCompletionStatusEx

OS 帮我们做了这些，而不需要我们分配线程给这样的任务，不需要线程就不受线程池的限制了

自己的想法

> 网络IO的速度远远慢于文件IO
>
> 只要是做事情就要占用CPU
>
> 这里对总时间的影响感觉基本没有感觉速度上的影响多一些
>
> 我假设执行这些操作需要利用C++分配线程，如果没有线程池中线程数量的限制，是否能得到一样的结果呢？
>
> TODO: QA

## EventLoop

Central dispatch that routes requests to C++ and results back to JavaScript

事件管理 

解决视角聚焦于如何更好的利用线程

![image-20210325113752921](http://picbed.sedationh.cn/image-20210325113752921.png)



## 最后

[视频链接🔗](https://www.youtube.com/watch?v=zphcsoSJMvM)

