[DOM](https://wangdoc.com/javascript/dom/index.html)



提几个属性/方法

[Element.innerHTML](https://developer.mozilla.org/en-US/docs/Web/API/Element/innerHTML)

[Node.textContent](https://developer.mozilla.org/en-US/docs/Web/API/Node/textContent)

[document.documentElement](https://developer.mozilla.org/en-US/docs/Web/API/Document/documentElement)

document

[Element.insertAdjacentHTML()](https://developer.mozilla.org/en-US/docs/Web/API/Element/insertAdjacentHTML)

```
<!-- beforebegin -->
<p>
  <!-- afterbegin -->
  foo
  <!-- beforeend -->
</p>
<!-- afterend -->
```

Node.prototype.appendChild()

如果参数节点是 DOM 已经存在的节点，`appendChild()`方法会将其从原来的位置，移动到新位置。



`hasChildNodes`方法结合`firstChild`属性和`nextSibling`属性，可以遍历当前节点的所有后代节点。

```js
function DOMComb(parent, callback) {
  if (parent.hasChildNodes()) {
    for (var node = parent.firstChild; node; node = node.nextSibling) {
      DOMComb(node, callback);
    }
  }
  callback(parent);
}

// 用法
DOMComb(document.body, console.log)
```

深度优先遍历， 上例是后序

Node.prototype.cloneNode()

绑定的回调函数没有克隆

Node.prototype.insertBefore()

由于不存在`insertAfter`方法，如果新节点要插在父节点的某个子节点后面，可以用`insertBefore`方法结合`nextSibling`属性模拟。

```
parent.insertBefore(s1, s2.nextSibling);
```