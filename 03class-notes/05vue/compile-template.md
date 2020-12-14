## Template Compile

Vue的使用有only-runtime & full(with compile) 的不同版本

后者就是有template compile来进行 从 el / template -> render 的解析



来瞅瞅这个过程啥感觉 [Link](https://template-explorer.vuejs.org/#%3Cdiv%20id%3D%22app%22%3E%0A%09%3Ch1%20class%3D%22red%22%3ESedationH%3C%2Fh1%3E%0A%20%20%3Cp%3Esay%20%7B%7Bmsg%7D%7D%3C%2Fp%3E%0A%3C%2Fdiv%3E)

```html
<div id="app">
	<h1 class="red">SedationH</h1>
  <p>say {{msg}}</p>
</div>
```

```js
function render() {
  with(this) {
    return _c('div', {
      attrs: {
        "id": "app"
      }
    }, [_c('h1', {
      staticClass: "red"
    }, [_v("SedationH")]), _c('p', [_v("say " + _s(msg))])])
  }
}
```



另外 下文提到的AST抽象语法🌲 [Link](https://astexplorer.net/)

暂不深究 知道是用来结构化文本内容方便|优化我们生成render即可

![image-20201214211202118](http://picbed.sedationh.cn/image-20201214211202118.png)

![图1](http://picbed.sedationh.cn/image-20201214210348666.png)

![图2](http://picbed.sedationh.cn/image-20201214210842484.png)

