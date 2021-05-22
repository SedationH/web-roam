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



📚书籍P 60

>  记忆单元的实现是复杂的过程，涉及了同步、时钟和反馈回路。其中的大部分能够被封装到称为触发器(flip-flop)的底层时序门(sequential gate)中。、

计算机中许多基础性的概念都有在这里体现

时钟

寄存器

字（word）通用寄存器的宽度

RAM

地址



## Flip flops

这里感觉理解不是很清晰

>  Perspectives 里面讲了DFF的**工作原理**
>
> 利用nand进行实现

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

https://www.nand2tetris.org/project03



核心技巧



处理RAM的时候

DMux + address 分发load

Mux + address 几种load



PC

我们写if是从上向下思考👇

```js
/**
 * A 16-bit counter with load and reset control bits.
 * if      (reset[t] == 1) out[t+1] = 0
 * else if (load[t] == 1)  out[t+1] = in[t]
 * else if (inc[t] == 1)   out[t+1] = out[t] + 1  (integer addition)
 * else                    out[t+1] = out[t]
 */
```

但在chips中，电流是在每个芯片中都有流动的

处理思路是从下至上的

先 inc 再 load 再 reset

都不处理的初始流入就是 else中的

```vhdl
CHIP PC {
    IN in[16],load,inc,reset;
    OUT out[16];

    PARTS:
    // handle inc
    Inc16(in = lastOut, out = addLastOut);
    Mux16(a = lastOut, b = addLastOut, sel = inc, out = o1);

    // handle load
    Mux16(a = o1, b = in, sel = load, out = o2);
    
    // handle reset
    Mux16(a = o2, b = false, sel = reset, out = o3);
    

    Register(in = o3, load = true, out = lastOut, out = out);
    
}
```