## Polyfill

兼容处理

```js
if (typeof Object.entries === 'undefined') {
  Object.entries = function(){
    // TODO
  }
}
```



关于TS 的 polyfill

