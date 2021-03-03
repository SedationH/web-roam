## JSX , virtual DOM

[Babel](https://babeljs.io/repl#?browsers=defaults%2C%20not%20ie%2011%2C%20not%20ie_mob%2011&build=&builtIns=false&spec=false&loose=false&code_lz=MYewdgzgLgBAIgeQLIwLwwBQCgYwDwAmAlgG4xEGoBEAjFTMADYCGEEAcswLYCm1AbIKoA-HLnwQADszDCaeAPRSZo8ROmyATIuWyxi4iVEBKLEA&debug=false&forceAllTransforms=false&shippedProposals=false&circleciRepo=&evaluate=true&fileSize=false&timeTravel=false&sourceType=module&lineWrap=false&presets=env%2Creact%2Ces2015-loose&prettier=true&targets=&version=7.12.12&externalPlugins=) 

```jsx
const DOM = (
  <div id="1" className="666">
    <span>1</span>
    <span>2</span>
  </div>
)
```

```js
"use strict";

var DOM = /*#__PURE__*/ React.createElement(
  "div",
  {
    id: "1",
    className: "666"
  },
  /*#__PURE__*/ React.createElement("span", null, "1"),
  /*#__PURE__*/ React.createElement("span", null, "2")
);

```

createElement创建后的结果

```json
{
  "type": "div",
  "key": null,
  "ref": null,
  "props": {
    "id": "1",
    "className": "666",
    "children": [
      {
        "type": "span",
        "key": null,
        "ref": null,
        "props": { "children": "1" },
        "_owner": null,
        "_store": {}
      },
      {
        "type": "span",
        "key": null,
        "ref": null,
        "props": { "children": "2" },
        "_owner": null,
        "_store": {}
      }
    ]
  },
  "_owner": null,
  "_store": {}
}
```



## 自己实现createElement

weback use babel-loader处理js文件

现在需要让 React.createElement -> TinyReact.createElement

https://www.gatsbyjs.com/blog/2019-08-02-what-is-jsx-pragma/

https://babeljs.io/docs/en/babel-preset-react

.babelrc

```json
{
  "presets": [
    [
      "@babel/preset-env",
      {
        "modules": false
      }
    ],
    [
      "@babel/preset-react",
      {
        "pragma": "tiny-react"
      }
    ]
  ]
}

```



简单版本

```js
function createElement(type, props, ...children) {
  return {
    type,
    props: props,
    children,
  }
}

export default createElement
```





需要完成的效果

1. 处理文本节点
2. 表达式中不处理Boolean && null
3. props中可以通过children来访问子节点



```js
function createElement(type, props, ...children) {
  const childElements = children.reduce((res, child) => {
    if (
      child !== false &&
      child !== true &&
      child !== null
    ) {
      if (child instanceof Object) {
        res.push(child)
      } else {
        // 文本节点
        res.push(
          createElement('text', {
            textContent: child,
          })
        )
      }
    }
    return res
  }, [])
  return {
    type,
    props: Object.assign(
      {
        children: childElements,
      },
      props
    ),
    children: childElements,
  }
}

export default createElement

```



## render

virtualDOM -> realDOM



render -> diff -> mountElement -> mountNativeElement

通过一层又一层，逐渐简化处理逻辑，每部分完成自己的任务

第一次的代码并不多，但能体现封装结构

commit参考 ef4513203d94f2d067c33048b6cbac2039af20b3

![image-20210226162544054](http://picbed.sedationh.cn/image-20210226162544054.png)



## 非Native组件处理

```js
const DOM = (
  <div id="1" className="666">
    <span>1</span>
    <span>2</span>
    <Foo />
  </div>
)

function Foo() {
  return <div>this is Foo</div>
}
```

```js
const DOM = /*#__PURE__*/ React.createElement(
  "div",
  {
    id: "1",
    className: "666"
  },
  /*#__PURE__*/ React.createElement("span", null, "1"),
  /*#__PURE__*/ React.createElement("span", null, "2"),
  /*#__PURE__*/ React.createElement(Foo, null)
);

function Foo() {
  return /*#__PURE__*/ React.createElement("div", null, "this is Foo");
}

```

首先判断出来是 **非NativeComponent**

```js
// Component or NativeELement
if (isFunction(virtualDOM)) {
  mountComponent(virtualDOM, container)
} else {
  mountNativeElement(virtualDOM, container)
}
```



再根据是函数 还是 类进行区别构建就好了

```js
export default function mountComponent(
  virtualDOM,
  container
) {
  let nextVirtualDOM = null
  // 判断是类组件还是函数式组件
  if (isFunctionComponent(virtualDOM)) {
    nextVirtualDOM = buildFunctionComponent(virtualDOM)
  } else {
    nextVirtualDOM = buildClassComponent(virtualDOM)
  }
  mountElemet(nextVirtualDOM, container)
}

function buildFunctionComponent(virtualDOM) {
  return virtualDOM.type(virtualDOM.props || {})
}

function buildClassComponent(virtualDOM) {
  const component = new virtualDOM.type(
    virtualDOM.props || {}
  )
  return component.render()
}

```



## 更新处理

注意对render的修改

```js
export default function render(
  virtualDOM,
  container,
  oldDOM = container.firstChild
) {
  diff(virtualDOM, container, oldDOM)
}
```



### 先从最简单类型相同的文字开始

diff

```js
if (!oldDOM) {
  mountElemet(virtualDOM, container)
} else if (oldVirtualDOM) {
  if ((virtualDOM.type = oldVirtualDOM.type)) {
    if (virtualDOM.type === 'text') {
      // 更新文字
      updateTextNode(virtualDOM, oldVirtualDOM, oldDOM)
    } else {
      // 更新元素属性
    }

    virtualDOM.children.forEach((child, index) => {
      diff(child, oldDOM, oldDOM.childNodes[index])
    })
  }
}
```

```js
export default function updateTextNode(
  virtualDOM,
  oldVirtualDOM,
  DOM
) {
  if (
    virtualDOM.props.textContent !==
    oldVirtualDOM.props.textContent
  ) {
    DOM.textContent = virtualDOM.props.textContent
    DOM._virtualDOM = virtualDOM
  }
}
```



打debug自行体会，注意理解参数的语义

### 处理类型相同时候的属性更换

```js
if (virtualDOM.type === 'text') {
  // 更新文字
  updateTextNode(oldDOM, virtualDOM, oldVirtualDOM)
} else {
  // 更新元素属性
  updateNodeElement(oldDOM, virtualDOM, oldVirtualDOM)
}
```

```js
export default function updateNodeElement(
  newElement,
  virtualDOM,
  oldVirtualDOM = {}
) {
  const newProps = virtualDOM.props
  const oldProps = oldVirtualDOM.props || {}
  // 处理更新的情况 创建和更新都是更新
  Reflect.ownKeys(newProps).forEach(propName => {
   	....
  })

  // 处理删除的情况
  // 从旧props找新的props没有了就删除
  Reflect.ownKeys(oldProps).forEach(propName => {
    const newValue = newProps[propName]
    const oldValue = oldProps[propName]
    if (!newProps.hasOwnProperty(propName)) {
      if (propName.slice(0, 2) === 'on') {
        const eventName = propName.toLowerCase().slice(2)
        newElement.removeEventListener(eventName, oldValue)
      } else if (propName !== 'children') {
        if (propName === 'className') {
          newElement.removeAttribute('class')
        } else {
          newElement.removeAttribute(propName)
        }
      }
    }
  })
}
```

## 响应setState 并且进行更新

```js
import diff from './diff'

export default class Component {
  constructor(props) {
    this.props = props
  }
  setState(state) {
    this.state = Object.assign({}, this.state, state)
    const virtualDOM = this.render()
    // 整个过程中实例是没有改变过的
    // 可以尝试从创建实例的时候拿到dom 来调用TintReat.render
    // ⚠️区分 TintReat.render & this.render
    diff(
      virtualDOM,
      this.getDOM().parentNode,
      this.getDOM()
    )
  }

  setDOM(newElement) {
    this._DOM = newElement
  }

  getDOM() {
    return this._DOM
  }
}
```



创建实例的时候挂上实例

```js
function buildClassComponent(virtualDOM) {
  const component = new virtualDOM.type(
    virtualDOM.props || {}
  )
  const newVirtualDOM = component.render()
  newVirtualDOM.component = component
  return newVirtualDOM
}
```

创建DOM的时候向实例上挂DOM

```js
export default function mountNativeElement(
  virtualDOM,
  container
) {
  const newElement = createDOMElement(virtualDOM)
  if (virtualDOM.component) {
    virtualDOM.component.setDOM(newElement)
  }
  container.appendChild(newElement)
}
```



现在的关系

```js
DOM = {
  ...,
  _virtualDOM : {
  	...,
  	component: ...(实例)
	}
}
```



## 更新函数组件

完善diff逻辑

```js
if (!oldDOM) {
  mountElemet(virtualDOM, container)
} else if (oldVirtualDOM) {
  if (isFunction(virtualDOM)) {
    // 还需要进一步判断
    diffComponent(virtualDOM, container, oldDOM)
```



```js
export default function diffComponent(
  virtualDOM,
  container,
  oldDOM
) {
  const oldVirtualDOM = oldDOM && oldDOM._virtualDOM
  const component = oldVirtualDOM && oldVirtualDOM.component

  // 判断是不是一个函数
  // 已经变成NativeElement了
  // if (virtualDOM.type === oldVirtualDOM.type) {
  if (isSameComponent(virtualDOM, component)) {
    updateComponent(virtualDOM, container, oldDOM)
  } else {
    mountElemet(virtualDOM, container, oldDOM)
  }
}

function isSameComponent(virtualDOM, component) {
  const constructor = component && component.constructor
  return virtualDOM.type === constructor
}
```



```js
export default function updateComponent(
  virtualDOM,
  container,
  oldDOM
) {
  const oldVirtualDOM = oldDOM && oldDOM._virtualDOM
  const component = oldVirtualDOM && oldVirtualDOM.component
  const newProps = virtualDOM.props
  const oldProps = component.props
  component.componentWillReceiveProps(newProps)
  if (component.shouldComponentUpdate(newProps)) {
    component.componentWillUpdate(newProps)
    const newComponent = component.updateProps(newProps)
    const newVirtualDOM = component.render()
    newVirtualDOM.component = newComponent
    diff(newVirtualDOM, container, oldDOM)
    component.componentDidUpdate(oldProps)
  }
}
```

