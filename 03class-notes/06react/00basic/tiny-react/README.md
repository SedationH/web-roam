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

