// 导入模块
import { init, h } from "snabbdom"
import style from "snabbdom/modules/style"
import eventlisteners from "snabbdom/modules/eventlisteners"
let patch = init([style, eventlisteners])
let vnode = h(
  "div",
  {
    style: {
      backgroundColor: "red",
    },
    on: {
      click: handleClick,
    },
  },
  [h("h1", "Hello Snabbdom"), h("p", "这是p标签")]
)
function handleClick() {
  console.log("点击我了")
}

let app = document.querySelector("#use01")

let oldVnode = patch(app, vnode)

// vnode = h("div", "hello")
// patch(oldVnode, vnode)
