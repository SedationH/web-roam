## o资源整理

理解Extension机制 http://blog.haoji.me/chrome-plugin-develop.html#content-scripts

Templete https://github.com/tjx666/awesome-chrome-extension-boilerplate

最好还是官网 https://developer.chrome.com/extensions/overview





## 整理有效的工具🔧

```javascript
// 向页面注入JS
function injectCustomJs(jsPath)
{
	jsPath = jsPath || 'js/inject.js';
	var temp = document.createElement('script');
	temp.setAttribute('type', 'text/javascript');
	// 获得的地址类似：chrome-extension://ihcokhadfjfchaeagdoclpnjdiokfakg/js/inject.js
	temp.src = chrome.extension.getURL(jsPath);
	temp.onload = function()
	{
		// 放在页面不好看，执行完后移除掉
		this.parentNode.removeChild(this);
	};
	document.head.appendChild(temp);
}
```



## QA 记录一些遇到的坑

### 1

想问一下这里

> 这是因为`content-script`有一个很大的“缺陷”，也就是无法访问页面中的JS，虽然它可以操作DOM，但是DOM却不能调用它，也就是无法在DOM中通过绑定事件的方式调用`content-script`中的代码（包括直接写`onclick`和`addEventListener`2种方式都不行），但是，“在页面上添加一个按钮并调用插件的扩展API”是一个很常见的需求，那该怎么办呢？其实这就是本小节要讲的。

 **content script file**

```js
$(window).on('load', () => {
    console.log('load');
    console.log(format(new Date(), 'yyDDDHHmmss'));
});

$(window).on('unload', () => {
    console.log(format(new Date(), 'yyDDDHHmmss'));
});
```

可以监听到呢？



window 对象也是不共享的

Ans: 

自己有点混淆了，content script

[Content Scripts](https://developer.chrome.com/extensions/content_scripts#execution-environment) 里的demo 好好体会

![image-20201108164910999](http://picbed.sedationh.cn/image-20201108164910999.png)

这个图片显示了两次

- Roberto 是来自DOM的 inject js对原本dom.person_name进行了修改
- 事件响应机制会调用来自不同位置的函数



具体内容参考 my-awesome-expreience commit b27620603bd9fc0ff22f3c718fa91a33648be792



相关的问题

```js
// 重写方法
const _wr = (type) => {
    const origin = history[type];
    return function (...args) {
        const event = new Event(type);
        window.dispatchEvent(event);
        return Reflect.apply(origin, this, args);
    };
};
// 重写方法
history.pushState = _wr('pushState');
history.replaceState = _wr('replaceState');
// 实现监听
window.addEventListener('replaceState', function () {
    console.log('THEY DID IT AGAIN! replaceState 111111');
});
window.addEventListener('pushState', function (e) {
    console.log(e);
});
```

为啥这个不管用，inject script & content script 的window对象都不是一个

在网页中调用window.pushState的是inject script中的原有函数，和content script中_wr后的函数屁不相关



为啥load有效呢？其实都是有效的... 但如果你想尝试改写产生load事件的函数，那么还是需要在inject script中

补充个知识点 [CurrentTarget vs Target in Js](https://medium.com/@etherealm/currenttarget-vs-target-in-js-2f3fd3a543e5#:~:text=currentTarget%20tells%20us%20on%20which,tells%20where%20the%20event%20started.&text=This%20event%20has%20been%20attached%20to%20the%20body.)

这其实就在讲J如何理解S的事件机制

### 2

注意content_scripts的[载入时机](https://developers.chrome.com/extensions/content_scripts#run_time)

我们使用inject_scripts的时机要注意此时能有啥元素能插入

![image-20201108213043397](http://picbed.sedationh.cn/image-20201108213043397.png)

发现在设置为 documen_start的时候，script的插入事件里，dom树啥都没

有趣的事情

当有了dom内容加载了后

```js
document.children[0] === document.head.parentNode // true
```

document 事实上代表整个文档

```json
> document.__proto__
HTMLDocument {Symbol(Symbol.toStringTag): "HTMLDocument", constructor: ƒ}
```

[HTMLDocument](https://developer.mozilla.org/en-US/docs/Web/API/HTMLDocument)

 ![image-20201108214558927](http://picbed.sedationh.cn/image-20201108214558927.png)

[来这补一补基础知识 DOM](https://zh.javascript.info/dom-nodes)



为了把项目中的trace事件都集中在一起，形式一致，就使用document_start时机载入了

