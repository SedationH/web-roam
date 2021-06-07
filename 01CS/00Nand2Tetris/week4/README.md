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

## Hack programming

底层的编码工作是在做什么

- working with registers and memory
- branching
- variables
- iteration
- pointers
- I/O



## woring with registers and memory

### 常见寄存器

![image-20210606085839002](http://picbed.sedationh.cn/image-20210606085839002.png)

D: data register

A: address / data register

M: the currently selected memory register



### typical operations

// wh? see A/C specification [link](#A)

```
// D = 10
@10 // make A = 10
D=A

// D++
D=D+1

// D=RAM[17]
@17
D=M

// RAM[17]=0
@17
M=0

// RAM[17]=10
@10
D=A
@17
M=D

// RAM[5]=RAM[3]
@3
D=M
@5
M=D
```



注意在载入到ROM之后，是有行数的，空行是被忽略的

![image-20210607123648189](http://picbed.sedationh.cn/image-20210607123648189.png)



### 第六行是没有指令的，这种情况称为NOP

NOP -> Null instructions / Null Opcodes

> a bed hacker can use this instructions to slide the flow of control to an area of the memory that he controls and then something bad can happen. 

如果存在这样的NOP，黑客是可以进行利用的，避免的方式就是让所有的代码都在我们的可控范围内

电脑无时无刻都在进行运转，通过使用loop来让指令的执行只在我们自己的可控代码范围内

`JMP: Unconditional jump`

```assembly
@6
0;JMP
```



### 内置的 symbols

R0 .. R15 virtual registers 利用这个来清晰地址指向

![image-20210607125744610](http://picbed.sedationh.cn/image-20210607125744610.png)

All

![image-20210607125823117](http://picbed.sedationh.cn/image-20210607125823117.png)

## Branching

分支 if ..

```assembly
// if we want to implement
// if R0 > 0
// 			R1 = 1
// else
// 			R0 = 0

  @R0
  D=M

  @8
  D;JGT // 这里是根据A register中存在的值进行跳跃的 -> 第八行

  @R1
  M=0
  @10
  0;JMP

8 @R1
  M=1

10@10
  0;JMP // jump with uncondition
```

这里代码实现的可读性很差



课中引入了一句很经典的话

![image-20210607140200217](http://picbed.sedationh.cn/image-20210607140200217.png)



> what's is the main task of programer ?
>
> instruct a computer to do what (基本要实现的效果
>
> 在现代规模化和合作化的开发中，可能更重要的中心是
>
> 可读性

为了增强可读性，在这里引入label标记跳转语义

![image-20210607141405105](http://picbed.sedationh.cn/image-20210607141405105.png)

## Variables

![image-20210607142312767](http://picbed.sedationh.cn/image-20210607142312767.png)



### Relocatable Code

在引入了上述的一些symbols后

除了可读性和优雅外，其实还引入了很重要的一个特性

就是我们的代码在执行过程中所依赖的寄存器并不是固定的，而是通过 variables or 类似 @temp这样的symbols进行动态生成的

相同的代码对于不同的load时机可能使用的寄存器就不一样了，上述代码也是代码生成概念中的 **relocatable code**



## iteration

![image-20210607143841711](http://picbed.sedationh.cn/image-20210607143841711.png)

Best Practice:

先写伪代码

再转化成assemble language



## Pointer

![image-20210607145423847](http://picbed.sedationh.cn/image-20210607145423847.png)

数组的概念是个空间指向

数组再内存上分配一个连续的空间，然后通过偏移地址寄存器A来取到不同的值

## I/O

这里真的是很有意思的概念

指针和I/O设备联系到了一起

事实上，我们无法直接操作I/O设备，但I/O设备通过与内存中某些区域建立映射来进行工作的

我们通过指针定位到那些区域，操作/读取那些区域，也就相当于操作了I/O设备



![image-20210607151208961](http://picbed.sedationh.cn/image-20210607151208961.png)

## END

4.8结尾 老师提了一些有意思的话

> Simple-minded people are impressed by sophisticated things, and sophisticated people are impressed by simple things.



## 项目

Well-written low-level code is

- short
- Efficient
- Elegant
- Self-describing



### multi

tsc 中是限制ticktock次数的

因此 尽管这一版本是可读性最好的

但次数上过不去

```assembly
// This file is part of www.nand2tetris.org
// and the book "The Elements of Computing Systems"
// by Nisan and Schocken, MIT Press.
// File name: projects/04/Mult.asm

// Multiplies R0 and R1 and stores the result in R2.
// (R0, R1, R2 refer to RAM[0], RAM[1], and RAM[2], respectively.)
//
// This program only needs to handle arguments that satisfy
// R0 >= 0, R1 >= 0, and R0*R1 < 32768.

// Put your code here.

// Analyse
// R1*R2 可以理解为 times * value
// 即 times 个 value相加

// use some variables to save process value
// more readale
@sum
M=0

@i
M=1

@R0
D=M
@times
M=D

@R1
D=M
@value
M=D

(LOOP)
  // 循环判断逻辑
  @i
  D=M
  @times
  D=D-M;
  @GET_SUM
  D;JGT
  
  // 计算
  @sum
  D=M
  @value
  D=D+M
  // 写回
  @sum
  M=D

  // 更改 i
  @i
  D=M+1
  @i
  M=D

  @LOOP
  0;JMP

(GET_SUM)
  @sum
  D=M
  @R2
  M=D

(END)
  @END
  0;JMP
```

只使用 i

```assembly
@i
M=1

@R2
M=0

(LOOP)
  // 循环判断逻辑
  @i
  D=M
  @R0
  D=D-M;
  @ENd
  D;JGT
  
  // 计算
  @R2
  D=M
  @R1
  D=D+M
  // 写回
  @R2
  M=D

  // 更改 i
  @i
  D=M+1
  @i
  M=D

  @LOOP
  0;JMP

(END)
  @END
  0;JMP
```



## fill

能通过寄存器操作IO设备还是很有趣的～

![2021-06-07 20.32.20](http://picbed.sedationh.cn/2021-06-07 20.32.20.gif)

