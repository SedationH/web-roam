## ALU (Arithmetic and Logic Unic)

It is designed to perform a whole set of arithmetic and logical operations, is the computer's calculating brain.



**Key concepts:** Binary numbers, binary addition, the two's complement method, half-adders, full-adders, n-bit adders, counters, Arithmetic Logic Unit (ALU), combinational logic. 





## Binary Numbers

二进制 binary

我们生活中经常使用的是 decimal 十进制

除此之外还有别的进制

理解的核心是，0，1在一位上能表示两种可能

0-9在一位上能表示十种可能

他们可以相互转变

![image-20210508083757507](/Users/sedationh/Library/Application Support/typora-user-images/image-20210508083757507.png)



![image-20210508083810138](http://picbed.sedationh.cn/image-20210508083810138.png)



实际的使用中，数字往往是有符号的，取最高位为符号位

![image-20210508083845580](http://picbed.sedationh.cn/image-20210508083845580.png)



## Binary Addition

类比十进制中是如何处理加法的

关键点是对进位的处理



![image-20210508084337890](http://picbed.sedationh.cn/image-20210508084337890.png)



把构建Adder的过程处理为三个stages

1. Half Adder - adds two bits
2. Full Adder - adds three bits
3. Adder - Adds two numbers

![image-20210508084625382](http://picbed.sedationh.cn/image-20210508084625382.png)

input

- a
- b

output

- sum
- carry

可以构建真值表

![image-20210508084718740](http://picbed.sedationh.cn/image-20210508084718740.png)



![image-20210508084812194](http://picbed.sedationh.cn/image-20210508084812194.png)

input

- a
- b
- c

output

- sum
- carry

![image-20210508084944670](http://picbed.sedationh.cn/image-20210508084944670.png)

![image-20210508085108444](http://picbed.sedationh.cn/image-20210508085108444.png)

可知是一个half adder + 若干full adder

```vhdl
CHIP Add16 {
  In a[16], b[16];
  OUT sum[16];
}
```



## Negative Numbers

目前已经实现了加法

是否还要去实现减法呢？

事实上，我们处理成加负值就好了

现在是思考如何表示负值的问题



第一个方案是通过默认最高位为符号位置

![image-20210508085554987](http://picbed.sedationh.cn/image-20210508085554987.png)

但带来了一些麻烦

- 歧义的 +/- 0
- 需要处理一些if情况，无法通过一套add系统完成



> ## 补码
>
> **重要概念：**在一个模系统中，一个数除以“模”后的余数等价
>
> 12模系统中  (8是 -4对模12的补码) | (-4的模12补码等于8)
>
> 8 - 4 === 8 + 8 在模系统中，结果都要再取模
>
> 
>
> 通过规范计算机的数值表示，计算机的运算器恰好就是一个模运算系统
>
> overflow -> 取模
>
> 如规定四位来存储数字
>
> [0111]原 + [1001]原 === [0111]补 + [1111]补 = [0110]补 === [0110]原
>
> 补码统一执行加和运算，超出位直接溢出不予考虑，相当于自动进行了取模操作，对于上述规范为4位来存储数字的情况，相当于取模2^4,满足设计要求
>
> 
>
> 补码的设计是为了统一加减法，核心是处理掉有关负数的运算
>
> 在 2^4 = 8 的模系统中 X = -3 => [1011]原 => [1101]补
>
> 做法(多种做法而不是步骤)
>
> 1. 除了最高符号为，各位取反+1
> 2. 从右至左，保持第一个1不变，后面的全部取反，不包括符号位置
> 3. 形象来看，-3的补码把-号纳入数字之中，整体对外表现为加号, 不同再单独处理符号
>    - 1-3 => 1+5
>    - [0001]i - [1011]i => [0001] + [0101]i 
>    - [0001]b + [1101]b => [1110]b
>
> 
>
> 
>
> 我理解了这个计算，还是感觉好神奇，不知如何证明这个合理，符号位与模运算配合的刚刚好
>
> 
>
> 另外在[X]b转X 的时候，可以把最高位置视为模系统-M（如-8），再加和别的位置
>
> 最小负数 [1000]b 下一个是 [11111]b



具体来说，假设有n位fixed的数据存储大小

那么这就是一个摸2^n的运算系统，因为大于等于2^n的会被溢出

对于-x的表示 -> 2^n - x

再具体点

Array(4) 来存储数 模 2^4 = 16系统

-3的表示为 16-3 = 13 = 1101

能够表示的范围为

[-8[1000]b, 7[0111]b]

![image-20210508091437794](http://picbed.sedationh.cn/image-20210508091437794.png)

在补码系统中表示数据的最高为还是表示为符号

而且有趣的是，利用这一套方法，加减法的处理可以一致了

-2 + -3 = 14 + 13 = 27 = 11 -> [1011] -> -5



对于补码表示的数据可以这样理解计算

[1011] -> -1*2^3 + 2 + 1

[0111] -> -0*2^3 + 4 + 2 + 1

这样的计算方式也同一化了



所以在处理减法的时候，当下还要处理的一件事情是得出 -x

![image-20210508092638733](http://picbed.sedationh.cn/image-20210508092638733.png)

比如

given 

n = 4

x = 6

求 -x



2^4 - x = 1 + (2^4 - 1) - x

```js
  1111
- 0110
--------
  1001
+    1
--------
  1010
```



## 解决了运算的设计问题，开始设计ALU

抽象的来看ALU的功能

![image-20210508114208710](http://picbed.sedationh.cn/image-20210508114208710.png)



在这个课程中更加具体的Hack ALU设计

![image-20210508114422810](http://picbed.sedationh.cn/image-20210508114422810.png)

![image-20210508114441763](http://picbed.sedationh.cn/image-20210508114441763.png)



> **Why use zr, ng?**
>
> These two control bits will come into play when we build the complete computers architecture

