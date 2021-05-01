# 你真的理解 事件冒泡 和 事件捕获 吗？

[Link](https://juejin.im/post/5cc941436fb9a03236394027#heading-1)

## 1. 事件冒泡与事件捕获

事件冒泡和事件捕获分别由微软和网景公司提出，这两个概念都是为了解决页面中**事件流**（事件发生顺序）的问题。

```
<div id="outer">
    <p id="inner">Click me!</p>
</div>复制代码
```

上面的代码当中一个div元素当中有一个p子元素，如果两个元素都有一个click的处理函数，那么我们怎么才能知道哪一个函数会首先被触发呢？

为了解决这个问题微软和网景提出了两种几乎完全相反的概念。

### 事件冒泡

微软提出了名为**事件冒泡**(event bubbling)的事件流。事件冒泡可以形象地比喻为把一颗石头投入水中，泡泡会一直从水底冒出水面。也就是说，事件会从最内层的元素开始发生，一直向上传播，直到document对象。

因此上面的例子在事件冒泡的概念下发生click事件的顺序应该是

**p -> div -> body -> html -> document**



### 事件捕获

网景提出另一种事件流名为**事件捕获**(event capturing)。与事件冒泡相反，事件会从最外层开始发生，直到最具体的元素。

上面的例子在事件捕获的概念下发生click事件的顺序应该是







**document -> html -> body -> div -> p**

**事件冒泡和事件捕获过程图：**

![image-20200406095522769](http://picbed.sedationh.cn/image-20200406095522769.png)

1-5是捕获过程，5-6是目标阶段，6-10是冒泡阶段；

## 2. addEventListener 的第三个参数

DOM2级事件”中规定的事件流同时支持了事件捕获阶段和事件冒泡阶段，而作为开发者，我们可以选择事件处理函数在哪一个阶段被调用。

addEventListener方法用来为一个特定的元素绑定一个事件处理函数，是JavaScript中的常用方法。addEventListener有三个参数：







```
 element.addEventListener(event, function, useCapture)复制代码
```

| 参数       | 描述                                                         |
| ---------- | ------------------------------------------------------------ |
| event      | 必须。字符串，指定事件名。  **注意:** 不要使用 "on" 前缀。 例如，使用 "click" ,而不是使用 "onclick"。  **提示：** 所有 HTML DOM 事件，可以查看我们完整的 [HTML DOM Event 对象参考手册](http://www.runoob.com/jsref/dom-obj-event.html)。 |
| function   | 必须。指定要事件触发时执行的函数。  当事件对象会作为第一个参数传入函数。 事件对象的类型取决于特定的事件。例如， "click" 事件属于 MouseEvent(鼠标事件) 对象。 |
| useCapture | 可选。布尔值，指定事件是否在捕获或冒泡阶段执行。  可能值:true - 事件句柄在捕获阶段执行（即在事件捕获阶段调用处理函数）false- false- 默认。事件句柄在冒泡阶段执行（即表示在事件冒泡的阶段调用事件处理函数） |

##  3. 事件代理

在实际的开发当中，利用事件流的特性，我们可以使用一种叫做事件代理的方法。







```
<ul class="color_list">        
    <li>red</li>        
    <li>orange</li>        
    <li>yellow</li>        
    <li>green</li>        
    <li>blue</li>        
    <li>purple</li>    
</ul>
<div class="box"></div>复制代码
```









```
.color_list{            
    display: flex;            
    display: -webkit-flex;        
}        
.color_list li{            
    width: 100px;            
    height: 100px;            
    list-style: none;            
    text-align: center;            
    line-height: 100px;        
}
//每个li加上对应的颜色，此处省略
.box{            
    width: 600px;            
    height: 150px;            
    background-color: #cccccc;            
    line-height: 150px;            
    text-align: center;        
}
复制代码
```



我们想要在点击每个 li 标签时，输出li当中的颜色`（innerHTML）` 。常规做法是遍历每个 li ,然后在每个 li 上绑定一个点击事件：







```
var color_list=document.querySelector(".color_list");            
var colors=color_list.getElementsByTagName("li");            
var box=document.querySelector(".box");            
for(var n=0;n<colors.length;n++){                
    colors[n].addEventListener("click",function(){                    
        console.log(this.innerHTML)                    
        box.innerHTML="该颜色为 "+this.innerHTML;                
    })            
}复制代码
```



这种做法在 li 较少的时候可以使用，但如果有一万个 li ，那就会导致性能降低（少了遍历所有 li 节点的操作，性能上肯定更加优化）。

这时就需要事件代理出场了，利用事件流的特性，我们只绑定一个事件处理函数也可以完成：







```
function colorChange(e){                
    var e=e||window.event;//兼容性的处理         
    if(e.target.nodeName.toLowerCase()==="li"){                    
        box.innerHTML="该颜色为 "+e.target.innerHTML;                
    }                            
}            
color_list.addEventListener("click",colorChange,false)复制代码
```

**由于事件冒泡机制，点击了 li 后会冒泡到 ul ，此时就会触发绑定在 ul 上的点击事件，再利用 target 找到事件实际发生的元素，就可以达到预期的效果。
**

**使用事件代理的好处不仅在于将多个事件处理函数减为一个，而且对于不同的元素可以有不同的处理方法。假如上述列表元素当中添加了其他的元素节点（如：a、span等），我们不必再一次循环给每一个元素绑定事件，直接修改事件代理的事件处理函数即可。****
**

**（1）toLowerCase()** 方法用于把字符串转换为小写。**语法：**stringObject.toLowerCase()

**返回值：**一个新的字符串，在其中 stringObject 的所有大写字符全部被转换为了小写字符。

**（2）nodeName** 属性指定节点的节点名称。如果节点是元素节点，则 nodeName 属性返回标签名。如果节点是属性节点，则 nodeName 属性返回属性的名称。对于其他节点类型，nodeName 属性返回不同节点类型的不同名称。

**所有主流浏览器均支持 nodeName 属性。**



### 冒泡还是捕获？

对于事件代理来说，在事件捕获或者事件冒泡阶段处理并没有明显的优劣之分，但是由于事件冒泡的事件流模型被所有主流的浏览器兼容，从兼容性角度来说还是建议大家使用事件冒泡模型。

### IE浏览器兼容

IE浏览器对addEventListener兼容性并不算太好，只有IE9以上可以使用。

要兼容旧版本的IE浏览器，可以使用IE的attachEvent函数

> object.attachEvent(event, function)

两个参数与addEventListener相似，分别是事件和处理函数，默认是事件冒泡阶段调用处理函数，要注意的是，写事件名时候要加上"on"前缀（"onload"、"onclick"等）。

### 阻止事件冒泡

**1. 给子级加 event.stopPropagation( )**



```
$("#div1").mousedown(function(e){
    var e=event||window.event;
    event.stopPropagation();
});复制代码
```



**2. 在事件处理函数中返回 false**



```
$("#div1").mousedown(function(event){
    var e=e||window.event;
    return false;
});复制代码
```



但是这两种方式是有区别的。`return false` 不仅阻止了事件往上冒泡，而且阻止了事件本身(默认事件)。`event.stopPropagation()`则只阻止事件往上冒泡，不阻止事件本身。

**3. event.target==event.currentTarget，让触发事件的元素等于绑定事件的元素，也可以阻止事件冒泡；**

 ![image-20200406095639075](/Users/sedationh/Library/Application Support/typora-user-images/image-20200406095639075.png)

### 阻止默认事件

（1）event.preventDefault( )

（2）return false

感谢您的阅读，有不足之处请为我指出！





# 深入理解e.target与e.currentTarget

target与currentTarget两者既有区别，也有联系，那么我们就来探讨下他们的区别吧，一个通俗易懂的例子解释一下两者的区别：

```
 1 <!DOCTYPE html>
 2 <html>
 3 <head>
 4     <title>Example</title>
 5 </head>
 6 <body>
 7     <div id="A">
 8         <div id="B">
 9         </div>
10     </div>
11 </body>
12 </html>复制代码
var a = document.getElementById('A'),
      b = document.getElementById('B');    
function handler (e) {
    console.log(e.target);
    console.log(e.currentTarget);
}
a.addEventListener('click', handler, false);复制代码
```

当点击A时：输出：

```
1 <div id="A">...<div>
2 <div id="A">...<div>复制代码
```

当点击B时：输出：

```
1 <div id="B"></div>
2 <div id="A">...</div>复制代码
```

也就是说，**currentTarget始终是监听事件者，而target是事件的真正发出者**。

由于要兼容IE浏览器，所以一般都在冒泡阶段来处理事件，此时target和currentTarget有些情况下是**不一样**的。

如：

```
1 function(e){
2     var target = e.target || e.srcElement;//兼容ie7,8
3     if(target){
4         zIndex = $(target).zIndex();
5     }
6 }
7 
8 //往上追查调用处
9 enterprise.on(img,'click',enterprise.help.showHelp);复制代码
```

IE7-8下使用$(target).zIndex();可以获取到
IE7-8下使用$(e.currentTarget).zIndex();获取不到，可能是IE下既没有target，也没有currentTarget

再来证实一下猜测，在IE浏览器下运行以下代码：

```
1 <input type="button" id="btn1" value="我是按钮" />
2 <script type="text/javascript"> 
3     btn1.attachEvent("onclick",function(e){
4         alert(e.currentTarget);//undefined
5         alert(e.target);       //undefined
6         alert(e.srcElement);   //[object HTMLInputElement]
7     });
8 </script>复制代码
```

**对象this、currentTarget和target**

在事件处理程序内部，对象this始终等于currentTarget的值，而target则只包含事件的实际目标。如果直接将事件处理程序指定给了目标元素，则**this、currentTarget和target**包含相同的值。来看下面的例子：

```
1 var btn = document.getElementById("myBtn");
2 btn.onclick = function (event) {
3     alert(event.currentTarget === this); //ture
4     alert(event.target === this); //ture
5 };复制代码
```

这个例子检测了currentTarget和target与this的值。由于click事件的目标是按钮，一次这三个值是相等的。如果事件处理程序存在于按钮的父节点中，那么这些值是不相同的。再看下面的例子：

```
1 document.body.onclick = function (event) {
2     alert(event.currentTarget === document.body); //ture
3     alert(this === document.body); //ture
4     alert(event.target === document.getElementById("myBtn")); //ture
5 };复制代码
```

当单击这个例子中的按钮时，this和currentTarget都等于document.body，因为事件处理程序是注册到这个元素的。然而，target元素却等于按钮元素，以为它是click事件真正的目标。由于按钮上并没有注册事件处理程序，结果click事件就冒泡到了document.body，在那里事件才得到了处理。

在需要通过一个函数处理多个事件时，可以使用**type**属性。例如：

```
 1 var btn = document.getElementById("myBtn");
 2 var handler = function (event) {
 3         switch (event.type) {
 4         case "click":
 5             alert("Clicked");
 6             break;
 7         case "mouseover":
 8             event.target.style.backgroundColor = "red";
 9             bread;
10         case "mouseout":
11             event.target.style.backgroundColor = "";
12             break;
13         }
14     };
15 btn.onclick = handler;
16 btn.onmouseover = handler;
17 btn.onmouseout = handler;复制代码
```


![img](https://user-gold-cdn.xitu.io/2017/10/23/7cef007ff85bfb287c8b97f4cfbb45ef?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)


我们知道一个HTML文件其实就是一棵DOM树，DOM节点之间是父子层级关系（这与iOS中的view树很类似，后面会说到）。在W3C模型中，任何事件发生时，先从顶层开始进行事件捕获，直到事件触发到达了事件源元素，这个过程叫做事件捕获（这其实也是事件的传递过程）；然后，该事件会随着DOM树的层级路径，由子节点向父节点进行层层传递，直至到达document，这个过程叫做事件冒泡（也可以说这是事件的响应过程）。虽然大部分的浏览器都遵循着标准，但是在IE浏览器中，事件流却是非标准的。而IE中事件流只有两个阶段：处于目标阶段，冒泡阶段。






![img](https://user-gold-cdn.xitu.io/2017/10/23/4466693712f2839611680c1322f8938f?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)


对于标准事件，事件触发一次经历三个阶段，所以我们在一个元素上注册事件也就可以在对应阶段绑定事件，移除事件也同样。



**什么是事件委托呢**？
事件委托就是利用事件冒泡机制，指定一个事件处理程序，来管理某一类型的所有事件。这个事件委托的定义不够简单明了，可能有些人还是无法明白事件委托到底是啥玩意。查了网上很多大牛在讲解事件委托的时候都用到了取快递这个例子来解释事件委托，不过想想这个例子真的是相当恰当和形象的，所以就直接拿这个例子来解释一下事件委托到底是什么意思：
公司的员工们经常会收到快递。为了方便签收快递，有两种办法：一种是快递到了之后收件人各自去拿快递；另一种是委托前台MM代为签收，前台MM收到快递后会按照要求进行签收。很显然，第二种方案更为方便高效，同时这种方案还有一种优势，那就是即使有新员工入职，前台的MM都可以代替新员工签收快递。
这个例子之所以非常恰当形象，是因为这个例子包含了委托的两层意思：
首先，现在公司里的员工可以委托前台MM代为签收快递，即程序中现有的dom节点是有事件的并可以进行事件委托；其次，新入职的新员工也可以让前台MM代为签收快递，即程序中新添加的dom节点也是有事件的，并且也能委托处理事件。

**为什么要用事件委托呢**？
当dom需要处理事件时，我们可以直接给dom添加事件处理程序，那么当许多dom都需要处理事件呢？比如一个ul中有100li，每个li都需要处理click事件，那我们可以遍历所有li，给它们添加事件处理程序，但是这样做会有什么影响呢？我们知道添加到页面上的事件处理程序的数量将直接影响到页面的整体运行性能，因为这需要不停地与dom节点进行交互，访问dom的次数越多，引起浏览器重绘和重排的次数就越多，自然会延长页面的交互就绪时间，这也是为什么可以减少dom操作来优化页面的运行性能；而如果使用委托，我们可以将事件的操作统一放在js代码里，这样与dom的操作就可以减少到一次，大大减少与dom节点的交互次数提高性能。同时，将事件的操作进行统一管理也能节约内存，因为每个js函数都是一个对象，自然就会占用内存，给dom节点添加的事件处理程序越多，对象越多，占用的内存也就越多；而使用委托，我们就可以只在dom节点的父级添加事件处理程序，那么自然也就节省了很多内存，性能也更好。
事件委托怎么实现呢？因为冒泡机制，既然点击子元素时，也会触发父元素的点击事件。那么我们就可以把点击子元素的事件要做的事情，交给最外层的父元素来做，让事件冒泡到最外层的dom节点上触发事件处理程序，这就是事件委托。
在介绍事件委托的方法之前，我们先来看看处理事件的一般方法：

```
<ul id="list">
    <li id="item1" >item1</li>
    <li id="item2" >item2</li>
    <li id="item3" >item3</li>
</ul>

<script>
var item1 = document.getElementById("item1");
var item2 = document.getElementById("item2");
var item3 = document.getElementById("item3");

item1.onclick = function(event){
    alert(event.target.nodeName);
    console.log("hello item1");
}
item2.onclick = function(event){
    alert(event.target.nodeName);
    console.log("hello item2");
}
item3.onclick = function(event){
    alert(event.target.nodeName);
    console.log("hello item3");
}
</script>复制代码
```

上面的代码意思很简单，就是给列表中每个li节点绑定点击事件，点击li的时候，需要找一次目标li的位置，执行事件处理函数。
那么我们用事件委托的方式会怎么做呢？

```
<ul id="list">
    <li id="item1" >item1</li>
    <li id="item2" >item2</li>
    <li id="item3" >item3</li>
</ul>

<script>
var item1 = document.getElementById("item1");
var item2 = document.getElementById("item2");
var item3 = document.getElementById("item3");
var list = document.getElementById("list");
list.addEventListener("click",function(event){
 var target = event.target;
 if(target == item1){
    alert(event.target.nodeName);
    console.log("hello item1");
 }else if(target == item2){
    alert(event.target.nodeName);
    console.log("hello item2");
 }else if(target == item3){
    alert(event.target.nodeName);
    console.log("hello item3");
 }
});
</script>复制代码
```

我们为父节点添加一个click事件，当子节点被点击的时候，click事件会从子节点开始向上冒泡。父节点捕获到事件之后，通过判断event.target来判断是否为我们需要处理的节点, 从而可以获取到相应的信息，并作处理。很显然，使用事件委托的方法可以极大地降低代码的复杂度，同时减小出错的可能性。
我们再来看看当我们动态地添加dom时，使用事件委托会带来哪些优势？首先我们看看正常写法：

```
<ul id="list">
    <li id="item1" >item1</li>
    <li id="item2" >item2</li>
    <li id="item3" >item3</li>
</ul>

<script>
var list = document.getElementById("list");

var item = list.getElementsByTagName("li");
for(var i=0;i<item.length;i++){
    (function(i){
        item[i].onclick = function(){
            alert(item[i].innerHTML);
        }
    })(i);
}

var node=document.createElement("li");
var textnode=document.createTextNode("item4");
node.appendChild(textnode);
list.appendChild(node);

</script>复制代码
```

点击item1到item3都有事件响应，但是点击item4时，没有事件响应。说明传统的事件绑定无法对动态添加的元素而动态的添加事件。
而如果使用事件委托的方法又会怎样呢？

```
<ul id="list">
    <li id="item1" >item1</li>
    <li id="item2" >item2</li>
    <li id="item3" >item3</li>
</ul>

<script>
var list = document.getElementById("list");

document.addEventListener("click",function(event){
    var target = event.target;
    if(target.nodeName == "LI"){
        alert(target.innerHTML);
    }
});

var node=document.createElement("li");
var textnode=document.createTextNode("item4");
node.appendChild(textnode);
list.appendChild(node);

</script>复制代码
```

当点击item4时，item4有事件响应，这说明事件委托可以为新添加的DOM元素动态地添加事件。我们可以发现，当用事件委托的时候，根本就不需要去遍历元素的子节点，只需要给父级元素添加事件就好了，其他的都是在js里面的执行，这样可以大大地减少dom操作，这就是事件委托的精髓所在。