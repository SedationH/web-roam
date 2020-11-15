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



