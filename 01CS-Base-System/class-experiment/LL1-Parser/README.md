## 整体设计

![image-20201115143705239](http://picbed.sedationh.cn/image-20201115143705239.png)

## Fisrt

### 算法理论

![image-20201115153818417](http://picbed.sedationh.cn/image-20201115153818417.png)

### IMPLEMENT

值得注意的是

`const first = (firstSets[symbol] = {})`这里的设计 刚好实现了对递归遍历过程中，所有不管是终结符号还是非终结符号的 first 集计算

first 变量用于方便 firstSet 当前 symbol 值内容的获取与赋值

firstOf 是个自我递归函数，其返回当前 firstOf(symbol) 对应的 first 集合

firstOf 会通过 getProductionsForSymbol(X) 来寻找每个 grammer 首字母含有 X 的产生式子 productionsForSymbol

在所有的 productionsForSymbol 获取 getRHS(productionsForSymbol[k]) 产生式的右部 production

## Follow

```js
// 几种可能出现的情况 默认都在求follow(B)
//   1. A -> aB 那么要求follow(A)
//   2. A -> aBC 求follow(C)
//   如果非终结符号 C | A 的first集合中没有ε 则 follow(B) = first(A) | first(C)
//   如果有ε 需要接着往下找
//   A -> Bz 直接z  因为上面first对于非终结符号的处理也有，所以也和上面的操作一致了
//   对于开始符号的处理进行了特定判断
```

## IMPLEMENT

没啥好说的

注意下 在 B -> aB 中对可能造成的死循环跳出就好了

## 结果

```zsh
$ node index.js
Grammar:

   X -> YZQ
   Y -> ε
   Y -> a
   Z -> b
   Z -> ε
   Q -> ε

First sets:

   X : [ 'ε', 'a', 'b' ]
   Y : [ 'ε', 'a' ]
   ε : [ 'ε' ]
   a : [ 'a' ]
   Z : [ 'b', 'ε' ]
   b : [ 'b' ]
   Q : [ 'ε' ]

Follow sets:

   X : [ '$' ]
   Y : [ 'b', '$' ]
   Z : [ '$' ]
   Q : [ '$' ]

NonTerminals: X,Y,Z,Q
Terminals: ε,a,b
┌───┬──────────┬──────────┬────────┬────────┐
│   │ ε        │ a        │ b      │ $      │
├───┼──────────┼──────────┼────────┼────────┤
│ X │ X -> YZQ │ X -> YZQ │        │        │
├───┼──────────┼──────────┼────────┼────────┤
│ Y │          │ Y -> a   │ Y -> ε │ Y -> ε │
├───┼──────────┼──────────┼────────┼────────┤
│ Z │          │          │ Z -> b │ Z -> ε │
├───┼──────────┼──────────┼────────┼────────┤
│ Q │          │          │        │ Q -> ε │
└───┴──────────┴──────────┴────────┴────────┘
┌──────┬──────────────┬────────────┬──────────┐
│ Step │ AnalyseStack │ RemainText │ Action   │
├──────┼──────────────┼────────────┼──────────┤
│ 0    │ $,X          │ a$         │ X -> YZQ │
├──────┼──────────────┼────────────┼──────────┤
│ 1    │ $,Q,Z,Y      │ a$         │ Y -> a   │
├──────┼──────────────┼────────────┼──────────┤
│ 2    │ $,Q,Z,a      │ a$         │ Match: a │
├──────┼──────────────┼────────────┼──────────┤
│ 3    │ $,Q,Z        │ $          │ Z -> ε   │
├──────┼──────────────┼────────────┼──────────┤
│ 4    │ $,Q          │ $          │ Q -> ε   │
├──────┼──────────────┼────────────┼──────────┤
│ 5    │ $            │ $          │ Match: $ │
```

## Refer

https://github.com/SinaKarimi7/LL1-Parser.git

参考了项目的整体结构，使用 EMS 进行了重组，使结构更加清晰

原 First 集合求取和所理解的不一致，进行了修改

