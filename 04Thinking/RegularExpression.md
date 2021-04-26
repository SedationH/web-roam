## 介绍与资源

RE(Regular Expression)用于模式匹配，是计算机从业者需要掌握的重要的基础技能。



好多内容太专业，入门门槛很高，这里介绍一个以JS为基础的RE教程，然而各个语言的RE实现都是相似的，只是一些特性的支持不一样罢了。

[《JS 正则迷你书》](https://github.com/qdlaoyao/js-regex-mini-book)



JavaScript Regular Expression Visualizer. 可视化辅助工具🔧

[Regulex](https://jex.im/regulex/#!flags=&re=)





## 这里特别记录下遇到的RE需求

### miniCss

```js
replace(/\s+/g, '').replace(/\/\*.*?\*\//g, '')
```

g 表示多个匹配 (global)

. 是不包含new line 的 通配符，表示几乎任意字符。换行符、回车符、行分隔符和段分隔符 除外。

.*?   表示 o or more times 惰性匹配（尽可能少匹配）



