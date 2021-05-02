## 代理模式的核心

客户直接访问本体，不满足客户的需求，或者不满足本体的需求。

提供一层代理来进行访问控制。

客户的需求不满足，在代理中进行满足

本体的需求不满足，在代理中进行满足



客户的需求更可能扩展，这个时候本体原有的实现无法满足，我们通过添加代理作为中间访问层来实现功能的扩增。



保持本体代码相对不变、职责单一  -> 单一职责原则

我们不需要去考虑本体的具体实现  -> 开放封闭原则



## 从图片预加载来看

不使用代理

```html
<body></body>
<script>
  const myImage = (function () {
    const $img = new Image()
    document.body.append($img)

    const temp = new Image()
    temp.addEventListener('load', () => {
      $img.src = 'http://picbed.sedationh.cn/bl_8_convert.png'
    })

    return {
      setSrc(src) {
        $img.src = 'loading.gif'
        temp.src = src
      },
    }
  })()

  myImage.setSrc('http://picbed.sedationh.cn/bl_8_convert.png')
</script>

```

使用代理

```html
<body></body>
<script>
  const myImage = (function () {
    const $img = new Image()
    document.body.append($img)
    return {
      setSrc(src) {
        $img.src = src
      },
    }
  })()

  const proxyImage = (function () {
    const proxyImage = new Image()
    proxyImage.addEventListener('load', () => {
      myImage.setSrc(proxyImage.src)
    })

    return {
      setSrc(src) {
        myImage.setSrc('loading.gif')
        proxyImage.src = src
      },
    }
  })()

  proxyImage.setSrc('http://picbed.sedationh.cn/bl_8_convert.png')
</script>
```



> 这里使用更改src，感觉表现有些不一致
>
> 参考 05DOC/HTML#imgae



从这个预加载的场景来看

本体的核心实现是向body中添加图片



现在客户多了预加载loading的需求

通过增加loadingProxy来实现预加载的效果



## 接口一致性

上例中本体和Proxy都闲了setSrc方法

好处

- 用户可以放心的请求代理，因为他只关心想要的结果
- 方便本体和代理的替换使用



Java 依赖倒置原则 鸭子类型？



renturn 都是函数 -> 也满足了接口一致性

