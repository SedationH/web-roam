## Universality

通用计算机、啥是可计算的？ -> 图灵模型

使用一套硬件读取指令和执行指令

通过加入不同的program(指令的集合)来实现不同的功能



这些指令的特点

Operations

执行啥？

Program Counter

执行到哪了

Address

操作啥，放到哪？



high-level language -> compile to -> program in machine language



引入Mnemonics 助记符 -> 汇编 assembler

使用Symbols 来方便内存操作



## Elements

 这里从Machine Language 的角度出发，来看待硬件实现

> And in first, from first principles, basically the machine language specifies exactly the kind of things that the hardware can do for us.
>
> In principle, and usually, these, this kind of interface is done in a almost one to one correspondence with the actual hardware implementation.

### Machine Language

- what are the supported operations
- what do they operate on
- How is the program controlled

### Memory Hierarchy

访问数据是一件很费时间的事情（相对CPU的执行来讲

因此，设计了Memory Hierarchy



![image-20210605180440692](/Users/sedationh/Library/Application Support/typora-user-images/image-20210605180440692.png)

寄存器是很基础也是很关键的组件

是CPU最快能访问到的数据存储部件、也是机器语言的核心操作对象



大致有两类

数据寄存器

地址寄存器

![image-20210605180646967](http://picbed.sedationh.cn/image-20210605180646967.png)



从寻址模式来看

![image-20210605180741567](http://picbed.sedationh.cn/image-20210605180741567.png)

### I/O

输入输出接口有很多，他们需要具体的protocol来和计算机打交道， Dirvers 驱动～

![image-20210605181222518](/Users/sedationh/Library/Application Support/typora-user-images/image-20210605181222518.png)

### 流程控制

就是jump指令



## hack computer && Corresponding machine languae

### 硬件结构

![image-20210605181502945](http://picbed.sedationh.cn/image-20210605181502945.png)



### 软件结构 or marchine language

- 16 bit A instruction
- 16 bit C instruction



hack program = sequence of instructions written in the Hack machine language



reset button 类似开机键 让程序启动

rom is loaded with a Hack program



所依赖的寄存器有三种

![image-20210606085839002](http://picbed.sedationh.cn/image-20210606085839002.png)

## Hack Language Specification

![image-20210606090028256](http://picbed.sedationh.cn/image-20210606090028256.png)

从symbolic 和 binary 语法上看下几种指令的规范

### A

![image-20210606090129825](http://picbed.sedationh.cn/image-20210606090129825.png)



### C

![image-20210606090213077](http://picbed.sedationh.cn/image-20210606090213077.png)

## I/O

![image-20210606090749263](http://picbed.sedationh.cn/image-20210606090749263.png)



### 图像输出

**screen memory map**

A designated memory area, dedicated to manage a display unit.

The physical display is continuously refreshed from the memory map, many times per second

所以要控制输出，就是在控制那片指定用于图像输出区域的bit

![image-20210606091827461](http://picbed.sedationh.cn/image-20210606091827461.png)

![image-20210606093456912](http://picbed.sedationh.cn/image-20210606093456912.png)

注意高低位

![image-20210606093601408](http://picbed.sedationh.cn/image-20210606093601408.png)

### 键盘输入

也是利用keybord memory map

键盘上的键 对应某个code 传入 keybord memory map

