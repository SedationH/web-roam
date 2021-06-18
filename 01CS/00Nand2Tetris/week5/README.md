## Build a universal computer

相对固定的硬件指令执行实现

+

变化的软件编码驱动不同的指令进行执行

=

多用途的计算机



具体实现的的组件有

CPU + MEMORY 



从数据在其中的流动来看

![image-20210614151435431](http://picbed.sedationh.cn/image-20210614151435431.png)

不同的组件之间通过这些wares / bus 进行信息交换



## Fetch-Execute Cycle

从基本的CPU loop来看

计算机的执行以周期为时间单位

- Fetch an Instruction  from the Program memory
- Execute it



### Fetch

指令要么走向下一个，要么进行跳跃

表现就是对应指令地址的不同



利用 Program Counter 来存储指令地址，通过改变PC对应的地址来影响拿到指令（指令是存在Memory 之中的）

![image-20210614160044894](http://picbed.sedationh.cn/image-20210614160044894.png)



### Execute

从fetch周期中已经拿到了interuction（存储到CPU可以直接访问获取的相关 instruction rejister 之中

从instruction之中要获取信息，具体执行什么

这个可能会读写 date memory

> So the basic execution executing the current instruction basically mean taking the bits from the instruction code that specifies what to do, and actually doing what needs to be done.
>
>  Looking at it in the hardware phase, from the hardware point of view, the instruction we already got from our fetch, that is now **going to feed into the control bus of our CPU, of our computer**. 
>
> And that control bus, basically controls everything. It tell the ALU what instruction to compute, to add numbers, subtract them, or so on.



## Fetch-Execute Clash （ 不能完全理解

无论是fetch 还是 execute 都是在和一个memory打交道

区分指令和数据在这里有冲突

fetch 需要的是地址来输出 instruction

execute 需要的是计算所需要的数据

解决方案：

![image-20210614161431415](http://picbed.sedationh.cn/image-20210614161431415.png)





## Hack CPU

### 从抽象来看，CPU能干啥

![image-20210614162517870](http://picbed.sedationh.cn/image-20210614162517870.png)



### 从接口规范来看

![image-20210614162857015](http://picbed.sedationh.cn/image-20210614162857015.png)

### 推荐内部的实现方式 （整体）

![image-20210614162954694](http://picbed.sedationh.cn/image-20210614162954694.png)

c 表示 control bits

下面来分开看不同部分的实现

### instruction handling

 ![image-20210614171551812](http://picbed.sedationh.cn/image-20210614171551812.png)

![image-20210614171631694](http://picbed.sedationh.cn/image-20210614171631694.png)

根据 Hack Language 的语言规范

A instruction 和 C instruction的开头的op code 是不同的

### ALU operation: inputs

![image-20210614172801189](http://picbed.sedationh.cn/image-20210614172801189.png)

### ALU operation: outputs

![image-20210614172847391](http://picbed.sedationh.cn/image-20210614172847391.png)



另外还输出了 C's，他用于表示ALU output的情况

- Negative output?
- Zero output?

### control

![image-20210614173315475](http://picbed.sedationh.cn/image-20210614173315475.png)

![image-20210614173359874](http://picbed.sedationh.cn/image-20210614173359874.png)

## Hack Computer

![image-20210614173830499](http://picbed.sedationh.cn/image-20210614173830499.png)



在具体实现中，这里提供了一些build-in的组件，基本就是在原有的register上加了一些附加功能，如

![image-20210615151138019](http://picbed.sedationh.cn/image-20210615151138019.png)

- display memory
- keyboard memory

他们在基本的寄存器实现的memory的基础上加了一些循环探测和寄存器的交互

还有ROM，是不可写入的Memory，其中包含着预先写好的指令

![image-20210615151342087](http://picbed.sedationh.cn/image-20210615151342087.png)

最后 整体实现～

![image-20210615151407559](http://picbed.sedationh.cn/image-20210615151407559.png)

结尾讲了对于beauty的描述

> We ascribe beauty to that which is simple; which has no superfluous parts; which exactly answers its end; which stands related to all things; which is the mean of many extremes.

通过规范和巧妙的设计，完成了Hack Computer 的设计与实现



## Project

### 课程设计总览

![image-20210615152034572](http://picbed.sedationh.cn/image-20210615152034572.png)



### Memory Specification

![image-20210615152523715](http://picbed.sedationh.cn/image-20210615152523715.png)

### 开干

[课程资源](https://www.nand2tetris.org/project05)

三个组件形成计算机

ROM CPU Memory

ROM是内置的

#### Memory要结合三个逻辑空间区域，data display keyboard

```vhdl
// This file is part of www.nand2tetris.org
// and the book "The Elements of Computing Systems"
// by Nisan and Schocken, MIT Press.
// File name: projects/05/Memory.hdl

/**
 * The complete address space of the Hack computer's memory,
 * including RAM and memory-mapped I/O. 
 * The chip facilitates read and write operations, as follows:
 *     Read:  out(t) = Memory[address(t)](t)
 *     Write: if load(t-1) then Memory[address(t-1)](t) = in(t-1)
 * In words: the chip always outputs the value stored at the memory 
 * location specified by address. If load==1, the in value is loaded 
 * into the memory location specified by address. This value becomes 
 * available through the out output from the next time step onward.
 * Address space rules:
 * Only the upper 16K+8K+1 words of the Memory chip are used. 
 * Access to address>0x6000 is invalid. Access to any address in 
 * the range 0x4000-0x5FFF results in accessing the screen memory 
 * map. Access to address 0x6000 results in accessing the keyboard 
 * memory map. The behavior in these addresses is described in the 
 * Screen and Keyboard chip specifications given in the book.
 */

// [0]
// 0000 0000 0000 000
// [16k - 1]
// 0111 1111 1111 111
// [16k = 2^14]
// 1000 0000 0000 000
// [16k + 8k - 1]
// 1011 1111 1111 111
// [16k + 8k]
// 1100 0000 0000 000

CHIP Memory {
    IN in[16], load, address[15];
    OUT out[16];

    PARTS:
    // Put your code here:
    // RAM -> 0 0
    //        0 1
    // Screen -> 1 0
    // Key    -> 1 1
    DMux4Way(in = load, sel = address[13..14], a = loadA, b = loadB, c = loadS, d = loadK);


    Or(a = loadA, b = loadB, out = loadRAM);
    RAM16K(in = in, load = loadRAM, address = address[0..13], out = outR);
    Keyboard(out = outK);
    Screen(in = in, load = loadS, address = address[0..12], out = outS);

    Mux4Way16(a = outR, b = outR, c = outS, d = outK, sel = address[13..14], out = out);
}
```

#### CPU的重点在于如何处理control signal

![image-20210615171015800](/Users/sedationh/Library/Application Support/typora-user-images/image-20210615171015800.png)

注意看ALU规范

![image-20210508114441763](http://picbed.sedationh.cn/image-20210508114441763.png)

![image-20210509160007584](http://picbed.sedationh.cn/image-20210509160007584.png)

![image-20210606090213077](http://picbed.sedationh.cn/image-20210606090213077.png)



![image-20210614162954694](http://picbed.sedationh.cn/image-20210614162954694.png)



## 下面是看📖的一些收获

现代通用计算机的卓越的灵活性归功于“存储程序”的概念

通过存储不同的程序指令 解耦 机器具体执行的功能和实现指令



计算机需要和外部环境交互。有许多不同的外部设备，但通过I/O映像 (memory-mapped I/O) 的技巧可以方便的实现对他们统一操作方式。

> I/O映像的基本思想是:创建O设备的二进制仿真,使其对于CPU而言,“看上去” 就像普通的内存段。特别地,每个/O设备在内存中都分配了独立的区域,作为它的“内存映像”。对于输入设备(键盘、鼠标等),内存映像能连续不断地反映设备的物理状态; 对于输出设备(屏幕、扬声器等),内存映像连续地驱动设备的物理状态。
>
> 从硬件的角度来看,这 个方案需要所有I/O设备提供类似于记忆单元( memory unit,或称内存单元)的那种接口。
>
> 从软件的角度来看,需要对每个I/O设备定义交互协议,这样程序才能正确地访问它。
>
> 若有大量可用的计算机平台和IO设备,就不难明白各类标准规范( standards)在 计算机体系结构设计中所起的重要作用。



关于显卡

>  同样地,Hack屏幕的内存映像是十分简单的,它直接将像素映像到内存的位中。 然而大多数现代计算机允许CPU发送高级图像指令到用于控制显示器的显卡( graphic card)上。・这样,CPU再也不用为直接画一些类似于圆圈和多边形的图像而感到麻烦了, 显卡使用其内嵌的芯片组来完成这个任务。

