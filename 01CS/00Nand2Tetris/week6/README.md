## In a nutshell

每个机器都有与之具体硬件相关的机器语言，这些机器语言通过 01 进行组合表达。

a symbolic marchine language , also known as assembly language

汇编语言是对人更友好的雨啊眼，通过 assembler 可以把汇编语言转为机器语言



## Assembler

is a software

first software layer above the hardware



source code -> via assembler -> target code



抽象来看，可以理解为一种函数，映射关系

f(source code) -> target code



其中执行的时候如何查询映射关系呢？

固定的指令是有对应的二进制表格的

寄存器，数字亦然，这和具体的语言规范又关系，但终究可以把那些预制的指令和可能出现的情况先打表

之后再进行组合和填充形成target code 的语言规范



但有时还会引入一些变量，或者label

```vhdl
@temp
  
(LOOP)
```

如何处理呢？

在处理过程中维护一个表格，第一次用就新建，第二次就复用



但在label情况下，会出现下面的情况

```vhdl
jump to LOOP


(LOOP)
```

使用的时候比创建的时候提前，这个时候可以考虑两次pass完成

## The Hack Assembly Language

实现从Hack language 到 Hack marchine language 的转换

### 需要熟悉两者的语法

Hack language 

![image-20210606090129825](http://picbed.sedationh.cn/image-20210606090129825.png)

![image-20210606090213077](http://picbed.sedationh.cn/image-20210606090213077.png)

![image-20210620121204297](http://picbed.sedationh.cn/image-20210620121204297.png)



总结来看有以下元素

- White space
  - Empty lines / indentation
  - Line comments
  - In-line comments
- Instructions
  - A 
  - C
- Symbols
  - Refereces
  - Label declarations



### The plan ahead

上来实现一个较为复杂的系统时，考虑逐层拆分，从最基本的实现开始

- 实现一个最基本的汇编器，没有symbol
- 处理symbol
- 整合起来





## The assembly process

### Innitialization

- 创建一个 symbol table
- 添加预定义好的symbols

### First pass:

Scan the entire program

处理(LABEL) 注意的语句，

key : LABEL

value: 下面指令所在的行数

### Second Pass

n -> 16

对于形如 @valueName 与symbol table 进行交互处理

如果是一个c instruction 进行翻译



## Project

### contract

- Develop a HackAssembler program that translates Hack assembly programs into executable Hack binary code.

Xxx.asm => Xxx.hack

Assumption: Xxx.asm is error-free



测试有多种方案，

要么使用生成的Xxx.hack去运行 (HardwareSimulator || CPU emulator)

利用 pre-supplied Assembler 去测试



这个就是用自己熟悉的编程语言去读写处理文件

![image-20210620154711212](http://picbed.sedationh.cn/image-20210620154711212.png)