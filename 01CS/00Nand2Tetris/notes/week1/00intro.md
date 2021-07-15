在过去常规的编程学习中，大多数时间都是

only about what -> abstarction

don't warry about how -> implementation



抽象是计算机学科中非常重要的一件事

> So it's an extremely important thing. 
>
> And that's the most, most potent tool of computer science. 
>
> That, once we can separate concerns. 
>
> When we can separate, we can forget a lot of details about implementation. 
>
> And only remember a very clean, what? 
>
> A very clean interface. 
>
> A very clean. 
>
> Description of what is done there. 
>
> Then you get this mental, saving, 
>
> of not having to have everything in your mind in the same time.



大致的学习路径

![image-20210502213612875](http://picbed.sedationh.cn/image-20210502213612875.png)



从下至上一层一层实现



从逻辑门 到 能够运行的软件（俄罗斯方块

Nand to Tetris



![image-20210502214856367](http://picbed.sedationh.cn/image-20210502214856367.png)

Now, many of you are probably wondering, 

how are we going to actually build all these chips? 

Well, as it turns out, 

hardware engineers today don't do anything with their bare hands. 

They develop computers using computers. 

And in particular they use something called hardware simulator to design and 

test and debug the hardware that they want to build. 



利用硬件模拟器械 + HDL program 来实现对硬件的编写



part1是硬件部分

最终目的是形成一个叫做HACK的计算机

part2是软件部分

最终目的是能够通过编写高级语言来运行程序