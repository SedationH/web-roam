# CSS相关知识整理

还记得刚开始就是因为贪图前端的美貌入的坑，CSS在其中扮演着极为重要的角色。

认真学习和掌握吧，也算是不忘初心了😝

一些相关🔗

- [How To Learn CSS](https://www.smashingmagazine.com/2019/01/how-to-learn-css/)
- [CSS selectors](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Selectors)





## [关于box-sizing](https://css-tricks.com/inheriting-box-sizing-probably-slightly-better-best-practice/)

```css
I'm a big fan of resetting box-sizing to border-box.
* {
  box-sizing: border-box;
}
This works fairly well, but it leaves out pseudo elements, which can lead to some unexpected results. A revised reset that covers pseudo elements quickly emerged:
*, *:before, *:after {
  box-sizing: border-box;
}
这里的理解要去想 pseido element is not in documnt, universal selector,* is handle the element in documnet.
```

But a universal selector overriding your CSS.

One potential gripe with it is that `box-sizing` isn’t normally inherited, so it’s specialized behavior, not quite the same as something you’d normally put in a reset.

if

```css
/* This selector is in most "old way" box-sizing resets */
* {
  box-sizing: border-box;
}
```

```html
<div class="component"> <!-- I'm content-box -->
  <header> <!-- I'm border-box still -->
  </header>
</div>
```

Preffered best practice :**Universal Box Sizing with Inheritance**

```css
html {
  box-sizing: border-box;
}
*, *:before, *:after {
  box-sizing: inherit;
}
```



考虑vender and  Compatibility

```css
html {
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
}
*, *:before, *:after {
  -webkit-box-sizing: inherit;
  -moz-box-sizing: inherit;
  box-sizing: inherit;
  }
```



## 学习资料

From

- [CSS布局进阶指南](https://marvin1023.github.io/css-layout/)

