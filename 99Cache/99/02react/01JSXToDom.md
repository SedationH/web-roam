## [JSX](https://reactjs.org/docs/introducing-jsx.html)

> It is called JSX, and it is a syntax extension to JavaScript. We recommend using it with React to describe what the UI should look like. JSX may remind you of a template language, but it comes with the full power of JavaScript.



通过[babel](https://babeljs.io/repl#?browsers=defaults%2C%20not%20ie%2011%2C%20not%20ie_mob%2011&build=&builtIns=false&spec=false&loose=false&code_lz=MYewdgzgLgBANgSwGoEM4FcCmMC8MBEAKgBYIQxnzJwpb4BQ9oksmcmAtpmLHgBT0YMADzo4MYDQgQAcii458YgMJTZ8zPgB8goSMQS1chfkSqU045q0BvRKgyYAvsID0iHXv0ItAJjceukLCHgDMAT66bmI6AJT0QA&debug=false&forceAllTransforms=false&shippedProposals=false&circleciRepo=&evaluate=false&fileSize=false&timeTravel=false&sourceType=module&lineWrap=true&presets=env%2Creact%2Cstage-2%2Cenv&prettier=false&targets=&version=7.11.6&externalPlugins=)进行转义 

```jsx
const liValue = "This is liVlaue"

const element = (
  <ul className="ulClassName">
    <li className="liClassName">{liValue}</li>
    <li>2</li>
    <li>3</li>
  </ul>
)
```

```js
const liValue = "This is liVlaue"
const element = /*#__PURE__*/ React.createElement(
  "ul",
  {
    className: "ulClassName",
  },
  /*#__PURE__*/ React.createElement(
    "li",
    {
      className: "liClassName",
    },
    liValue
  ),
  /*#__PURE__*/ React.createElement("li", null, "2"),
  /*#__PURE__*/ React.createElement("li", null, "3")
)
```

JSX的语法糖方便开发，提升效率。



## createElement

由上述babel转义的结果可知，原来的类html的语法被React.createElement取代

```js
function createElement(type,config,children)
```

createElement函数接受三种参数

- type 用于标示节点的类型，可以是标准HTML的所有的类型，也可以是React所提供的类型
- 节点的所有属性被放到config对象中
- children不止一个，用于记录嵌套的内容



createElement其实就在格式化数据，相当于开发者和下面ReactElemnt调用之间的转换器。

从开发者写入的代码中接受相对简单的参数，组装出调用ReactElement所预期的调用格式



createElement返回

```js
return ReactElement(
	type,
  key,
  /* 略 */
  props
)
```



Refer

```js
/**
 101. React的创建元素方法
 */
export function createElement(type, config, children) {
  // propName 变量用于储存后面需要用到的元素属性
  let propName; 
  // props 变量用于储存元素属性的键值对集合
  const props = {}; 
  // key、ref、self、source 均为 React 元素的属性，此处不必深究
  let key = null;
  let ref = null; 
  let self = null; 
  let source = null; 
  // config 对象中存储的是元素的属性
  if (config != null) { 
    // 进来之后做的第一件事，是依次对 ref、key、self 和 source 属性赋值
    if (hasValidRef(config)) {
      ref = config.ref;
    }
    // 此处将 key 值字符串化
    if (hasValidKey(config)) {
      key = '' + config.key; 
    }
    self = config.__self === undefined ? null : config.__self;
    source = config.__source === undefined ? null : config.__source;
    // 接着就是要把 config 里面的属性都一个一个挪到 props 这个之前声明好的对象里面
    for (propName in config) {
      if (
        // 筛选出可以提进 props 对象里的属性
        hasOwnProperty.call(config, propName) &&  /
        !RESERVED_PROPS.hasOwnProperty(propName) 
      ) {
        props[propName] = config[propName]; 
      }
    }
  }
  // childrenLength 指的是当前元素的子元素的个数，减去的 2 是 type 和 config 两个参数占用的长度
  const childrenLength = arguments.length - 2; 
  // 如果抛去type和config，就只剩下一个参数，一般意味着文本节点出现了
  if (childrenLength === 1) { 
    // 直接把这个参数的值赋给props.children
    props.children = children; 
    // 处理嵌套多个子元素的情况
  } else if (childrenLength > 1) { 
    // 声明一个子元素数组
    const childArray = Array(childrenLength); 
    // 把子元素推进数组里
    for (let i = 0; i < childrenLength; i++) { 
      childArray[i] = arguments[i + 2];
    }
    // 最后把这个数组赋值给props.children
    props.children = childArray; 
  } 

  // 处理 defaultProps
  if (type && type.defaultProps) {
    const defaultProps = type.defaultProps;
    for (propName in defaultProps) { 
      if (props[propName] === undefined) {
        props[propName] = defaultProps[propName];
      }
    }
  }

  // 最后返回一个调用ReactElement执行方法，并传入刚才处理过的参数
  return ReactElement(
    type,
    key,
    ref,
    self,
    source,
    ReactCurrentOwner.current,
    props,
  );
}
```





## ReactElement 构建虚拟DOM

ReactElement的源码

```js
const ReactElement = function(type, key, ref, self, source, owner, props) {
  const element = {
    // REACT_ELEMENT_TYPE是一个常量，用来标识该对象是一个ReactElement
    $$typeof: REACT_ELEMENT_TYPE,
    // 内置属性赋值
    type: type,
    key: key,
    ref: ref,
    props: props,

    // 记录创造该元素的组件
    _owner: owner,
  };

  // 
  if (__DEV__) {
    // 这里是一些针对 __DEV__ 环境下的处理，对于大家理解主要逻辑意义不大，此处我直接省略掉，以免混淆视听
  }

  return element;
};
```

ReactElement接受规范化的参数，创建一个js对象，这个对象实例，本质上是以JavaScript对象形式存在的对DOM的描述 -> 虚拟DOM，这个以js对象为实体的虚拟DOM，需要通过ReactDOM.render来变成真实的DOM



```js
ReactDOM.render(
    // 需要渲染的元素（ReactElement）
    element, 
    // 元素挂载的目标容器（一个真实DOM）
    container,
    // 回调函数，可选参数，可以用来处理渲染结束后的逻辑
    [callback]
)
```

container相当于一个容器，React把提供的element对象渲染到这个容器里。

