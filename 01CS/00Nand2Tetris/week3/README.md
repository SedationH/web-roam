## Sequential Logic

在week 1、2 中的学习工程中，我们忽略了时间的影响，都在同步的假设下进行思考

那些情况 called Combinatorial Logic



接下来 引入 时间的概念 Time

why?



- use the same hardware over time

这样的重复利用依赖之前的计算结果

- remember "State" previous
- handle speed / delays



how？

现实的世界时间是连续的 continuous

我们处理为离散的 分为一个又一个相等的时间step

![image-20210517160813812](http://picbed.sedationh.cn/image-20210517160813812.png)

通过灰色区域为delays提供缓冲时间，关于step跨度的设置，保证可实现、透明delays影响即可

这样我们通过digital的方式就可以从抽象上直接使用state，而不用考虑delays在电路层面的影响了



ok，这样可以做what呢？

![image-20210517161123152](http://picbed.sedationh.cn/image-20210517161123152.png)



我们实现了对previous使用，引入了时序的概念



## Flip Plops

这里感觉理解不是很清晰

> - Missing ingredient: remember one bit of information from time t-1 so it can be used at time t.
> - At the end of time t-1, such an ingredient can be at either of two states: "remember 0" or "remember 1"
> - This ingredient remembers by "flipping" between these possible states.
> - Gates that can flip between two states are called Flip-Flops
>
> ![image-20210517162700668](http://picbed.sedationh.cn/image-20210517162700668.png)

课程这里提供base primitive Filp Plops 实现  **DFF**

![image-20210517162546253](http://picbed.sedationh.cn/image-20210517162546253.png)

diagram中的三角表示 sequencial logic (dep time)



实现  1-Bit Register

![image-20210517162812756](http://picbed.sedationh.cn/image-20210517162812756.png)



## Memory Units

计算机中能够进行记忆作用的

- Main memory: RAM(Random Access Memory)
- Secondary memory : Disk...
- Volatile / non-volatile (断电了原来的数据是否还存在)



从1-Bits 开始构建最基础的记忆element  -> register

![image-20210517162916305](http://picbed.sedationh.cn/image-20210517162916305.png)

支持读/写（利用load



在 rigister 的基础上组装 RAM

只是引入了address的逻辑，用于定位到是哪个register

![image-20210517163438245](http://picbed.sedationh.cn/image-20210517163438245.png)



RAM和精髓在于Random，基于地址索引，因此不管RAM的SIZE如何增大，时间上的复杂度都是O(1)



## Counters

就是那个指令计数器 PC 



场景： 我们要运行多个指令，通过conter来记录运行到哪里并进行下一个指令(next / goto)



实现 

- reset
- goto
- next



## Project

重点在这里，看如何组合和利用所提供的的DFF