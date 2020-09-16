## 通过colorUI巩固css基础

最近使用colorUI构建小程序UI，感受到css库带来的便利



事实上，我上来接触的UI框架已经集成在Vue React之上，为我对样式的学习和调整带来了学多成本，这次的colorUI使用可以让我将更多的注意力放在样式上，这样很好



暂时吧一些查询和思考的点统一到这里，暂不分类



命名规划 布局系统里中辅助布局(以margin为例子)

- margin-xs extra small
- margin-sm small
- margin
- margin-lg
- margin-xl



The **`:first-child`** [CSS](dfile:///Users/sedationh/Library/Application Support/Dash/DocSets/CSS/CSS.docset/Contents/Resources/Documents/developer.mozilla.org/en-US/docs/Web/CSS.html) [pseudo-class](#) represents the first element among a group of sibling elements.



[The :before and :after pseudo-elements](https://www.w3.org/TR/CSS2/generate.html#before-after-content)

![image-20200916155606480](http://picbed.sedationh.cn/image-20200916155606480.png)



关于[flex](https://www.zhangxinxu.com/wordpress/2019/12/css-flex-deep/) 很生动明了的解释



[Attribute selectors](https://developer.mozilla.org/en-US/docs/Web/CSS/Attribute_selectors)

在shadow & text-shadow 中很普遍的使用了这个功能



文字截断的效果

```css
.text-cut {
	text-overflow: ellipsis; 溢出内容的展现样式
	white-space: nowrap; 不换行
	overflow: hidden; 溢出如何处理
}
```

