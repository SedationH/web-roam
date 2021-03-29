## Cross-Site Scripting XSS

跨站脚本 (Cross-Site Scripting, XSS): 一种代码注入方式, 为了与 CSS 区分所以被称作 XSS. 

XSS 通过修改 HTML 节点或者执行 JS 代码来攻击网站。

所以不能讲拿到的string直接作为html插入

> Vue v-html
>
> <p>Using mustaches: {{ rawHtml }}</p> <p>Using v-html directive: <span v-html="rawHtml"></span></p>
>
> 你的站点上动态渲染的任意 HTML 可能会非常危险，因为它很容易导致 [XSS 攻击](https://en.wikipedia.org/wiki/Cross-site_scripting)。请只对可信内容使用 HTML 插值，**绝不要**对用户提供的内容使用插值。



关于一些浏览器API

### [textContent Differences from innerHTML](https://developer.mozilla.org/en-US/docs/Web/API/Node/textContent#differences_from_innerhtml)

[`Element.innerHTML`](https://developer.mozilla.org/en-US/docs/Web/API/Element/innerHTML) returns HTML, as its name indicates. Sometimes people use `innerHTML` to retrieve or write text inside an element, but `textContent` has better performance because its value is not parsed as HTML.

Moreover, using `textContent` can prevent [XSS attacks](https://developer.mozilla.org/en-US/docs/Glossary/Cross-site_scripting).

Don't get confused by the differences between `Node.textContent` and [`HTMLElement.innerText`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/innerText). Although the names seem similar, there are important differences:

- `textContent` gets the content of *all* elements, including [``](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script) and [``](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/style) elements. In contrast, `innerText` only shows “human-readable” elements.
- `textContent`returns every element in the node. In contrast,`innerText`is aware of styling and won’t return the text of “hidden” elements.
  - Moreover, since `innerText` takes CSS styles into account, reading the value of `innerText` triggers a [reflow](https://developer.mozilla.org/en-US/docs/Glossary/Reflow) to ensure up-to-date computed styles. (Reflows can be computationally expensive, and thus should be avoided when possible.)



## 如何防御？

转义输入输出的内容，对于引号，尖括号，斜杠进行转义

```js
function escape(str) {
  str = str.replace(/&/g, '&amp;')
  str = str.replace(/</g, '&lt;')
  str = str.replace(/>/g, '&gt;')
  str = str.replace(/"/g, '&quto;')
  str = str.replace(/'/g, '&#39;')
  str = str.replace(/`/g, '&#96;')
  str = str.replace(/\//g, '&#x2F;')
  return str
}
```

富文本考虑白名单转义



还有个方案是[CSP](https://content-security-policy.com/) Content Security Policy

The Content-Security-Policy header allows you to restrict how resources such as JavaScript, CSS, or pretty much anything that the browser loads.

