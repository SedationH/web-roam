## 资源整理

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

从





## QA

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

