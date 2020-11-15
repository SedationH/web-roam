import { h, init } from "snabbdom"

const patch = init([])
// 创建虚拟的节点
let vnode = h("div#container", "Hello World")
// 寻找替换的根节点
const app = document.querySelector("#app")

// 第一次使用要挂载一个真实的DOM
let oldVnode = patch(app, vnode) // patch返回一个虚拟DOM
console.log(oldVnode)

vnode = h("div#container.cls", [
  h("h1", "Hello Snabbdom"),
  h("p", "这是一个p标签"),
])

setTimeout(() => {
  patch(oldVnode, vnode)
}, 2000)
