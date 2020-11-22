## 整体设计

![image-20201115143705239](http://picbed.sedationh.cn/image-20201115143705239.png)

## Fisrt

### 算法理论

![image-20201115153818417](http://picbed.sedationh.cn/image-20201115153818417.png)

### IMPLEMENT

值得注意的是

`var first = (firstSets[symbol] = {})`这里的设计 刚好实现了对递归遍历过程中，所有不管是终结符号还是非终结符号的first集计算 

first变量用于方便firstSet当前symbol值内容的获取与赋值



firstOf是个自我递归函数，其返回当前firstOf(symbol) 对应的first集合

firstOf 会通过 getProductionsForSymbol(X) 来寻找每个grammer首字母含有X的产生式子productionsForSymbol

在所有的productionsForSymbol 获取  getRHS(productionsForSymbol[k])   产生式的右部   production



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



