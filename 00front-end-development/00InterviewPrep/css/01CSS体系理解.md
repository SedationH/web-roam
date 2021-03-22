## 前言

学习和理解的过程越发觉得CSS的理解需要一个体系

知道什么是BFC之后，越发疑惑为什么要设计这个，过去也在在疑问，但是没能解决，看一些博客的时候也只是从现象级来说如何使用，没有从逻辑设计角度，CSS体系的角度进行思考和解释的。

CSS的内部设计也是不断在发展的，1 -> 2 -> 2.1 ... -> 3

感觉是逐渐完善和容易理解的

下面整理一下再次回顾的时候，可能更为合理的学习逻辑

## 理解逻辑

> model 是设计 
>
> 具体还有implement实现

### [**Visual Formatting Model**](https://developer.mozilla.org/en-US/docs/Web/CSS/Visual_formatting_model) 

> In CSS The **Visual Formatting Model** describes how user agents take the document tree, and process and display it for visual media.

User agent就是我们的查看媒介，连续媒体，分页媒体，而 Virtual Formatting Model 就是在描述如何在上面进行展示

以下的Context以Web浏览器为主

~~浏览器解析HTML CSS 形成DOM && CSSOM，合成布局树,这个到布局树的过~~ -> [混淆了实现和Model](https://developers.google.com/web/fundamentals/performance/critical-rendering-path/render-tree-construction?hl=zh-cn)

需要针对每个element来generates zero or more boxes according to the box model. The layout of these boxes is governed by:

- Box dimensions and type.
- Positioning scheme (normal flow, float, and absolute positioning).
- Relationships between elements in the document tree.
- External information (e.g., viewport size, intrinsic dimensions of images, etc.).

需要特别说的是

对于 In continuous media, the [viewport](https://developer.mozilla.org/en-US/docs/Glossary/Viewport) is the viewing area of the browser window. 

当要显示的内容小于viewport的时候

If the viewport is smaller than the size of the document then the user agent needs to offer a way to scroll to the parts of the document that are not displayed.

### 盒子

>  [Box Model](https://developer.mozilla.org/en-US/docs/Learn/CSS/Building_blocks/The_box_model) 理解什么是盒子

再者是盒子的产生，盒子的类型由[`display`](https://developer.mozilla.org/en-US/docs/Web/CSS/display) 进行决定

有以下几个重要概念

1. priciple box 主盒子

> Some elements may generate additional boxes in addition to the principal box, for example `display: list-item` generates more than one box (e.g. a **principal block box** and a **child marker box**). And some values (such as `none` or `contents`) cause the element and/or its descendants to not generate any boxes at all.

2. **anonymous box** 

An **anonymous box** is created when there is not an HTML element to use for the box. 

> **Inline anonymous boxes** are created when a string is split by an inline element, for example, a sentence that includes a section wrapped with `<em></em>`.

3. inner box  outer box

two-value syntax中

display: <display-outside> <display-inside>

The `<display-outside>` keywords specify the element’s outer [`display`](https://developer.mozilla.org/en-US/docs/Web/CSS/display) type, which is essentially its role in flow layout.  

对于所在context 的呈现（不考虑 run-in）

就两个 block inline

The `<display-inside>` defines the type of formatting context that lays out its contents (assuming it is a non-replaced element).

对内部内容的flow管理和内容呈现(width/height marging padding ..实际上作用于这个盒子)

节选《CSS世界》

> 设计之初寻思，展示无非结构+内容，使用block box来负责结构，使用inline box来负责内容。 完美～
>
> 然而来了list-item ，于是跟写JS组件中添加新API一样，所有的块级元素都有个主块级盒子，list-item还有个附加盒子，学名marker box
>
> 好家伙，又来了个inline-block，穿着inline的皮，藏着block的心，于是再搞出两个盒子，outer box &&  inner box
>
> outer box 负责对外的表现， inner box 负责内部的内容，宽高

### Positioning scheme

在盒子中的inner box就在决定如何布局，即把子元素放在什么样的context中

[Introduction to formatting contexts](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Flow_Layout/Intro_to_formatting_contexts)

不仅有老生常谈的BFC，还有IFC，FFC，GFC

FC表示Fortmatting Context，对FC的理解可以看作是一个进行特定布局的单位，不同FC之间是不会进行影响的

前面的字母表示几种[`<display-inside>`](https://developer.mozilla.org/en-US/docs/Web/CSS/display-inside)

Block Inline Flex Grid

其中 flow 对应Block，但是没有新的FC产生

flow-root对应产生新的FC的布局方式

还有个要说的 initial formatting context 整个网页默认开始是放在BFC中的，根html元素是最外层BFC的container box

> The outermost element in a document that uses block layout rules establishes the first, or **initial block formatting context**. This means that every element inside the `<html>` element's block is laid out according to normal flow following the rules for block and inline layout. Elements participating in a BFC use the rules outlined by the CSS Box Model, which defines how an element's margins, borders, and padding interact with other blocks in the same context.



> A **block formatting context** is a part of a visual CSS rendering of a web page. It's the region in which the layout of block boxes occurs and in which floats interact with other elements. 
>
> 关于BFC与布局的处理
>
> [Understanding CSS Layout And The Block Formatting Context](https://www.smashingmagazine.com/2017/12/understanding-css-layout-block-formatting-context/)

注意在IFC中提到的行盒 Line box

在上述FC中的文档流，就是处于正常的文档流之中

一个元素如何呈现，从文档流的角度来看

1. 和使用什么样的FC -> 使用什么样的flow组织元素
2. 处于文档流的元素之间会相互影响

从文档流和FC的角度来看对元素的调整，我们有三种处理方式

1. 让他在文档流中
2. 让他跳出文档流，但存在于当前FC中 
3. 跳出文档流 && FC

1不多说，除了2 、3都是1

2 特别的是在说[float](https://developer.mozilla.org/en-US/docs/Web/CSS/float)

As mentioned above, when an element is floated, it is taken out of the normal flow of the document (though still remaining part of it). It is shifted to the left, or right, until it touches the edge of its containing box, *or another floated element*.

> The **`float`** CSS property places an element on the left or right side of its container, allowing text and inline elements to wrap around it. The element is removed from the normal flow of the page, though still remaining a part of the flow (in contrast to [absolute positioning](https://developer.mozilla.org/en-US/docs/Web/CSS/position#absolute_positioning)).

3 以absolute为例子，从文档流拿出，跳出当前FC

定位依据是nearest positioned ancestor(not static)，一直拿不到的话，就用html 这个 IFC

这里需要提一下[containing block](https://www.w3.org/TR/CSS2/visudet.html#containing-block-details) 对理解Position有很关键的影响

> absolute : 
>
> The element is removed from the normal document flow, and **no space is created for the element in the page layout.**
>
> 
>
> As noted above, when certain properties are given a percentage value, the computed value depends on the element's containing block. The properties that work this way are **box model properties** and **offset properties**:
>
> 1. The [`height`](https://developer.mozilla.org/en-US/docs/Web/CSS/height), [`top`](https://developer.mozilla.org/en-US/docs/Web/CSS/top), and [`bottom`](https://developer.mozilla.org/en-US/docs/Web/CSS/bottom) properties compute percentage values from the `height` of the containing block.
> 2. The [`width`](https://developer.mozilla.org/en-US/docs/Web/CSS/width), [`left`](https://developer.mozilla.org/en-US/docs/Web/CSS/left), [`right`](https://developer.mozilla.org/en-US/docs/Web/CSS/right), [`padding`](https://developer.mozilla.org/en-US/docs/Web/CSS/padding), and [`margin`](https://developer.mozilla.org/en-US/docs/Web/CSS/margin) properties compute percentage values from the `width` of the containing block.



fixed 就是 absolute的无脑版本 -> viewport（也要考虑一些except when one of its ancestors has a `transform`, `perspective`, or `filter` property set to something other than `none` (see the [CSS Transforms Spec](https://www.w3.org/TR/css-transforms-1/#propdef-transform)）

[更多细节参考 postion](https://developer.mozilla.org/en-US/docs/Web/CSS/position)



### [The stacking context](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Positioning/Understanding_z_index/The_stacking_context)

基于上面的方案，二维平面上的布局问题基本已经cover，那么z-axis上的呢？

The **stacking context** is a three-dimensional conceptualization of HTML elements along an imaginary z-axis relative to the user, who is assumed to be facing the viewport or the webpage. HTML elements occupy this space in priority order based on element attributes.



如果一个元素具有了stacking context，这个元素会作为一个层叠处理的独立单元，来管理其子元素的层叠关系

> Each stacking context is completely independent of its siblings: only descendant elements are considered when stacking is processed.

这个概念可以类比BFC理解，BFC处理的是排版问题

这个处理的是层叠问题

> Each stacking context is self-contained: after the element's contents are stacked, the whole element is considered in the stacking order of the parent stacking context.



啥时候会创建呢？这里简单记录一些好记的

- Root element of the document (`<html>`).
- Element with a [`position`](https://developer.mozilla.org/en-US/docs/Web/CSS/position) value `absolute` or `relative` and [`z-index`](https://developer.mozilla.org/en-US/docs/Web/CSS/z-index) value other than `auto`.
- Element with a [`position`](https://developer.mozilla.org/en-US/docs/Web/CSS/position) value `fixed` or `sticky` (sticky for all mobile browsers, but not older desktop).
- Element that is a child of a [flex](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Flexible_Box_Layout/Basic_Concepts_of_Flexbox) container, with [`z-index`](https://developer.mozilla.org/en-US/docs/Web/CSS/z-index) value other than `auto`.



这里例子简单易懂

![Example of stacking rules modified using z-index](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/03d6f1ac0d9a4a7dafdb884411247f66~tplv-k3u1fbpfcp-zoom-1.image)

In this example, every positioned element creates its own stacking context, because of their positioning and `z-index` values. The hierarchy of stacking contexts is organized as follows:

- Root
  - DIV #1
  - DIV #2
  - DIV #3
    - DIV #4
    - DIV #5
    - DIV #6



## [CSS如何学习 - 大漠](https://w3cplus.medium.com/css%E7%8E%B0%E7%8A%B6%E5%92%8C%E5%A6%82%E4%BD%95%E5%AD%A6%E4%B9%A0-1ac786328761)

而且经历两年的发展，[有了CSS2.0版本](https://www.w3.org/TR/CSS22/)，在这之后，还经历了**CSS 2.1**和**CSS 2.2**版本的迭代。同时CSS 2.1规范指导Web开发者写CSS很多年。直到后面，也就是大约2015年，W3C规划的CSS工作小组发现CSS发展的越来越快，有关于CSS方面的特性增加了不少，而且不同的特性推进速度都有所不同。也就这个时候，[W3C的CSS工作小组为了能更好的维护和管理CSS的特性，该组织决定不在以CSS的版本号](https://www.w3.org/Style/CSS/current-work.en.html)，比如我们熟悉的CSS1.0、CSS2.0、CSS2.1这样的方式来管理CSS。而是将每个CSS功能特性拆分成独立的功能模块，并且以Level 1, Level2，Level 3等方式来管理CSS规范中的特性：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e2081d6de9ed4f259e68c050fa2e9807~tplv-k3u1fbpfcp-zoom-1.image)

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/806237c72206405dacb7b8a57d4156ea~tplv-k3u1fbpfcp-zoom-1.image)

客户端渲染页面时，除了选择器权重会影响元素样式规则之外，还有样式来源也会影响元素样式规则。就CSS规则的来源而言，规则主要来自三个地方：

- **编写者规则（Author）** ：这是HTML文档声明的CSS。也就是我们前端开发人员编写的，根据文档语言（比如HTML）约定给源文档指定样式表。这也是我们能够控制的唯一来源
- **用户（User）** ：这是由浏览器的用户定义和控制的。不是每个人都会有一个，但是当人们添加一个时，通常是为了覆盖样式和增加网站的可访问性。比如，用户可以指定一个售有样式表的文件，或者用户代理可能会提供一个用来生成用户样式（或者表现得像这样做了一样）的界面
- **用户代理（User-Agent）** ：这些是浏览器为元素提供的默认样式。这就是为什么 `input` 在不同的浏览器上看起来略有不同，这也是人们喜欢使用CSS重置样式，以确保重写用户代理样式的原因之一



## 💡想法 

对于一个较为复杂的知识，在整个知识体系中理出一条逻辑，知识学习的过程就像在脑海中形成的知识树不断添加一样，他们之间是相互解释和促进的。