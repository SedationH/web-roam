## global attributes

https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes



能够理解的

事件类

onload、onclick ...



样式类

class

id

style



数据类

data-*



访问性类

aria-*

> Accessible Rich Internet Applications **(ARIA)** is a set of attributes that define ways to make web content and web applications (especially those developed with JavaScript) more accessible to people with disabilities.

[**`hidden`**](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/hidden) 

> **Note:** Changing the value of the CSS [`display`](https://developer.mozilla.org/en-US/docs/Web/CSS/display) property on an element with the `hidden` attribute overrides the behavior. For instance, elements styled `display: flex` will be displayed despite the `hidden` attribute's presence.

更多的是在说，从语义上，和页面的别的内容是不相关的了



交互类

title

contenteditable 

> The **`contenteditable`** [global attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes) is an enumerated attribute indicating if the element should be editable by the user. If so, the browser modifies its widget to allow editing.

[**`draggable`**](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/draggable)



## from

https://developer.mozilla.org/en-US/docs/Learn/Forms/Your_first_form

form 的默认行为

相关的input type具有校验功能

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Your first HTML form</title>
  </head>

  <body>
    <form action="/my-handling-form-page" method="post">
      <ul>
        <li>
          <label for="name">Name:</label>
          <input type="text" id="name" name="user_name" />
        </li>
        <li>
          <label for="mail">E-mail:</label>
          <input type="email" id="mail" name="user_mail" />
        </li>
        <li>
          <label for="msg">Message:</label>
          <textarea id="msg" name="user_message"></textarea>
        </li>
        <li class="button">
          <button type="submit">Send your message</button>
        </li>
      </ul>
    </form>
  </body>
</html>

```

![image-20210501202129335](http://picbed.sedationh.cn/image-20210501202129335.png)



## image

替换src还是会发起请求

只是如果资源做了缓存处理表现的好像没请求一样

```HTML
<body></body>
<script>
  function myImage(width, height) {
    const $img = new Image(width, height)
    $img.src = 'loading.gif'
    const tempImage = new Image()
    tempImage.src = 'http://picbed.sedationh.cn/bl_8_convert.png'
    tempImage.addEventListener('load', () => {
      $img.src = tempImage.src
    })
    let flag = true
    $img.addEventListener('click', () => {
      $img.src = flag
        ? 'loading.gif'
        : 'http://picbed.sedationh.cn/bl_8_convert.png'
      flag = !flag
    })
    return $img
  }

  const $img1 = myImage()
  document.body.append($img1)
</script>

```



![image-20210502114358503](http://picbed.sedationh.cn/image-20210502114358503.png)



而且只替换个src原来的height width都失效了



奇怪的表现是

假设A请求事件 >> B

A.onolad 时刻 我再把B的src换成A的，却没有请求发出

这里我还是觉得替换DOM `Node.replaceChildren` 的处理更加好一些