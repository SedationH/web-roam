# 文档 v0.1.0



(第一次写开发文档，不知道要包含什么内容)



## 需求

1. 实现文本选择高亮

![image-20201027152747928](http://picbed.sedationh.cn/image-20201027152747928.png)



![image-20201027152803075](/Users/sedationh/Library/Application Support/typora-user-images/image-20201027152803075.png)



把选择到的文本内容拿到 上传至服务器



> 实现用户再次访问当前页面的时候相关高亮依然存在(Web 资源存在变化的可能，检查到页面内容变化) [这方面需要信息比对下, 好没想好具体实现]



## 开发情况

[web-hightlighter](https://github.com/alienzhou/web-highlighter) 有现成可以参考开源库 在熟悉使用和内部实现



chrome-dev-extensions 内容还在看

目前的理解

整个插件可以保持一个长时间运行的background.js

可以通过在manifest.json中指定content_scripts来向满足匹配规则的页面注入指定的脚本

全局暴露chrome对象，向开发者提供便捷的浏览器api调用，一些权限需要在manifest.json中的permissions中进行配置

content_script如果需要与background.js通讯

```js
chrome.runtime.sendMessage({
  message: "open_new_tab",
  url: firstHref,
})
```



## web-Hightlight 源码研究📝

最新的版本看着有点难受，向前看commit，找了一个感觉逻辑好理顺一些的

`13222d18e60114f8c609a41d7358658c5ce79c98`

源码中不理解的部分暂时用QA做备忘

```js
const getOriginParent = ($node: Text): HTMLElement => {
  let $originParent = $node.parentNode as HTMLElement
  // QA 目前已知高亮后的文本会加一个 data-highlight-id="0202048a-fa77-4114-ab2d-c2134c14e946" 这样的效果
  while (
    $originParent.dataset &&
    $originParent.dataset[CAMEL_DATASET_IDENTIFIER]
  ) {
    $originParent = $originParent.parentNode as HTMLElement
  }
  return $originParent
}
```





首先，整个包导出是个class

```js
export default class Highlighter extends EventEmitter {
```

值得注意的是EventEmitter

参考 [Node.js EventEmitter](https://www.tutorialsteacher.com/nodejs/nodejs-eventemitter)

Event module includes EventEmitter class which can be used to raise and handle custom events.

可以理解为简单创建了个时间监听机制

```js
// get the reference of EventEmitter class of events module
var events = require('events');

//create an object of EventEmitter class by using above reference
var em = new events.EventEmitter();

//Subscribe for FirstEvent
em.on('FirstEvent', function (data) {
    console.log('First subscriber: ' + data);
});

// Raising FirstEvent
em.emit('FirstEvent', 'This is my first Node.js event emitter example.');
```



包使用起来很简单，其实就

```js
const highlighter = new Highlighter()
/*
  constructor(options: HighlighterOptions) {
    super()
    this.options = {
      ...DEFAULT_OPTIONS,
      ...options,
    }
    this.paint = new Paint({
      $root: this.options.$root,
      highlightClassName: this.options.style.highlightClassName,
    })
    this.cache = new Cache(this.options.useLocalStore)
  }
*/
highlighter.run()
```



就可以完成自动选择了，这里选择run作为入口理解内容

```js
run = () =>
    this.options.$root.addEventListener("mouseup", this._handleSelection)
```



向配置好的$root（沿用jq时代的习惯产物，用$来表明是节点元素）对象上添加监听事件，这个函数对理解整个框架**有重要帮助**

```js
private _handleSelection = (e: Event) => {
  const range = HighlightRange.fromSelection()
  if (!range) {
    return
  }
  const source: HighlightSource = range.freeze()
  this.paint.highlightRange(range)
  this.cache.save(source)
  this.emit(EventType.CREATE, [source])
  HighlightRange.removeDomRange()
}
```



可以看到，有两个类型`HighlightRange` `HighlightSource` 具体类型如下

```ts
class HighlightRange {
  start: DomNode
  end: DomNode
  text: string
  id: string
  frozen: boolean

  static removeDomRange() {}
  static fromSelection() {}
  constructor() {}

  freeze(): HighlightSource {}
}

class HighlightSource {
  startMeta: DomMeta
  endMeta: DomMeta
  text: string
  id: string
  
  boil(){}
  constructor(){}
}
```



paint 可以通过标记 HighlightRange 的 instance 完成页面内容的高亮效果

HighlightSource 可以 通过  HighlightRange instance.freeze()拿到，这个是用来进行持久化的数据类型



HighlightRange 的理解并不难，个人感觉有些难以理解的是HighlightSource的形成

```js
freeze(): HighlightSource {
  const startMeta = getDomMeta(this.start.$node as Text, this.start.offset)
  const endMeta = getDomMeta(this.end.$node as Text, this.end.offset)
  this.frozen = true
  return new HighlightSource(startMeta, endMeta, this.text, this.id)
}
```



```js
export const getDomMeta = ($node: Text, offset: number): DomMeta => {
    const $originParent = getOriginParent($node);
    const index = countGlobalNodeIndex($originParent);
    const preNodeOffset = getTextPreOffset($originParent, $node);
    const tagName = $originParent.tagName;
    return {
        parentTagName: tagName,
        parentIndex: index,
        textOffset: preNodeOffset + offset
    };
};
```



选取作者文章对这里的解释

> ## 4. 如何实现高亮选区的持久化与还原？
>
> 到目前我们已经可以给选中的文本添加高亮背景了。但还有一个大问题：
>
> 想象一下，用户辛辛苦苦划了很多重点（高亮），开心地退出页面后，下次访问时发现这些都不能保存时，该有多么得沮丧。因此，如果只是在页面上做“一次性”的文本高亮，那它的使用价值会大大降低。这也就促使我们的“划词高亮”功能要能够保存（持久化）这些高亮选区并正确还原。
>
> > 持久化高亮选区的核心是找到一种合适的 DOM 节点序列化方法。
>
> 通过第三部分可以知道，当确定了首尾节点与文本偏移（offset）信息后，即可为其间文本节点添加背景色。其中，offset 是数值类型，要在服务器保存它自然没有问题；但是 DOM 节点不同，在浏览器中保存它只需要赋值给一个变量，但想在后端保存所谓的 DOM 则不那么直接了。
>
> ### 4.1 序列化 DOM 节点标识
>
> 所以这里的核心点就是找到一种方法，能够定位 DOM 节点，同时可以被保存成普通的 JSON Object，用以传给后端保存，这个过程在本文中被称为 DOM 标识 的“序列化”。而下次用户访问时，又可以从后端取回，然后“反序列化”为对应的 DOM 节点。
>
> 有几种常见的方式来标识 DOM 节点：
>
> - 使用 xPath
> - 使用 CSS Selector 语法
> - 使用 tagName + index
>
> 这里选择了使用第三种方式来快速实现。需要注意一点，我们通过 Selection API 取到的首尾节点一般是文本节点，而这里要记录的 tagName 和 index 都是该文本节点的父元素节点（Element Node）的，而 childIndex 表示该文本节点是其父亲的第几个儿子：
>
> 
>
> ```js
> function serialize(textNode, root = document) {
>     const node = textNode.parentElement;
>     let childIndex = -1;
>     for (let i = 0; i < node.childNodes.length; i++) {
>         if (textNode === node.childNodes[i]) {
>             childIndex = i;
>             break;
>         }
>     }
>     
>     const tagName = node.tagName;
>     const list = root.getElementsByTagName(tagName);
>     for (let index = 0; index < list.length; index++) {
>         if (node === list[index]) {
>             return {tagName, index, childIndex};
>         }
>     }
>     return {tagName, index: -1, childIndex};
> }
> ```
>
> 
>
> 通过该方法返回的信息，再加上 offset 信息，即定位选取的起始位置，同时也完全可发送给后端进行保存了。



**一个重要的理解就是你所选择的文本并不是线性的，而是在dom树形结构中的，我们需要在这个树形结构中，拿到开始和终止的偏移量**

