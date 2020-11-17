import { h, init } from "snabbdom"

const patch = init([])
// 创建虚拟的节点
let vnode = h(
  "div#container",
  {
    hook: {
      init(vnode) {
        console.log("init:", vnode)
      },
      create(emptyVNode, vnode) {
        console.log("create:", vnode)
      },
    },
  },
  "Hello World"
)
// 寻找替换的根节点
const nativeNode = document.querySelector("#use00")

// 第一次使用要挂载一个真实的DOM
let oldVnode = patch(nativeNode, vnode) // patch返回一个虚拟DOM

// vnode = h("div#container.cls", [
//   h("h1", "Hello Snabbdom"),
//   h("p", "这是一个p标签"),
// ])

// setTimeout(() => {
//   console.log(oldVnode)
//   oldVnode = patch(oldVnode, vnode)
//   console.log(oldVnode)
// }, 2000)
