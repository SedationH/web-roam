## Boolean Logic

### Bolean Operations

ADN OR NOT



### Bolean Expression

NOT(0 AND (0 OR 1))



### Bolean Functions

![image-20210502223524809](http://picbed.sedationh.cn/image-20210502223524809.png)



### Boolean Identities ( 恒等式。。 一些定律)

交换 Commutative Laws

分配 Distributitive Laws

结合 Associatitive Laws

德·摩根定律 De Morgan's laws

![image-20210502224001645](http://picbed.sedationh.cn/image-20210502224001645.png)

证明De Morgan Laws成立 真值表一致



### Boolean Algebra

未知 x,y... + Boolean Identities



### Truth Table to Boolean Expresion

我们有需要构建的逻辑输出 -> Truth Table

现在需要拿到Boolean Function -> 构建逻辑门电路

![image-20210503105208276](http://picbed.sedationh.cn/image-20210503105208276.png)

![image-20210503105158282](http://picbed.sedationh.cn/image-20210503105158282.png)



### Theorem

Any Bolean fucntion can be represented using an expression containing ADN, OR and NOT operations.

还可以再少点 -> ONLY NOT and AND(OR)

因为从De Morgan可知，通过NOT 我们可以相互转换ADN OR

这里我们用NOT AND作为相对最少值



在NOT AND 的基础上 合成NAND

![image-20210503110338203](http://picbed.sedationh.cn/image-20210503110338203.png)

基于这两个合成的NAND

Any Boolean function can be represented using an expression containing only NAND operations.

Proof

1. NOT(x) = (x NAND x)
2. (x AND y)  = NOT(x NAND y)

...🐂🍺

现在用一个NAND就能构建所有了



## Logic Gate

Starting with this unit we are going to talk about how we actually 

implement these Boolean functions using hardware. 

In particular, we're going to talk about a general technique called Gate Logic



Now, what is a logic gate? 

Well, a logic gate is a stand alone chip or 

a, you know a very simple chip or an elementary chip which is 

designed to deliver a well-defined functionality.



- A technique for implementing Boolean functions using logic gates.
- Logic gates:
  - Elementary(Nand, And, Or, Not)
  - Composite(Mux, Adder)

![image-20210503113559855](http://picbed.sedationh.cn/image-20210503113559855.png)



### interface 是一种 abstraction

根据具体的需求设计好abstraction

这个是相对unique的

但下面的实现多种多样	



**This is very typical in in computer science,** 

**whenever you build a large system, you have this this duality(二元性).** 



### 除了上面所说的Gate Implementation，还有Circuit implementation

![image-20210503114812792](http://picbed.sedationh.cn/image-20210503114812792.png)

可见，在硬件层面对于抽象的实现方式是多种多样的



we don't deal with physical implementations. 

And therefore, this whole discussion of circuits, transistors, 

relays, and so on, you know, all this stuff, and what you see in the top 

left corner of the screen here, this is electrical engineering (EE). 

It's not computer science(CS).