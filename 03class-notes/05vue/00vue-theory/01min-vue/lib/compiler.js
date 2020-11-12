import Watcher from "./watcher.js"

export default class Compiler {
  constructor(vm) {
    this.el = vm.$el
    this.vm = vm
    this.compile(this.el)
  }

  // 编译模版，处理文本节点和元素节点
  compile(el) {
    const childNodes = el.childNodes
    Array.from(childNodes).forEach((node) => {
      if (this.isTextNode(node)) {
        this.complieText(node)
      } else if (this.isElementNode(node)) {
        this.compileElement(node)
      }

      // 判断node节点是否还有子节点，递归调用compile
      if (node.childNodes && node.childNodes.length) {
        this.compile(node)
      }
    })
  }

  update(node, key, attrName) {
    const updateFn = this[attrName + "Updater"]
    updateFn && updateFn(node, this.vm[key])
  }

  // handle v-text dir
  textUpdater(node, value) {
    node.textContent = value
  }

  modelUpdater(node, value) {
    node.value = value
  }

  // 编译文本节点，处理Mustache语法
  complieText(node) {
    // {{ msg }}
    const pattern = /\{\{(.+?)\}\}/
    const value = node.textContent
    if (pattern.test(value)) {
      const key = RegExp.$1.trim()
      node.textContent = value.replace(
        pattern,
        this.vm[key]
      )

      // 创建watcher对象，当数据改变的时候更新视图
      new Watcher(this.vm, key, (newvalue) => {
        node.textContent = newvalue
      })
    }
  }

  // 编译元素节点，处理指令
  compileElement(node) {
    Array.from(node.attributes).forEach((attr) => {
      let attrName = attr.name
      if (this.isDirective(attrName)) {
        // v-text => text
        attrName = attrName.substr(2)
        const key = attr.value
        this.update(node, key, attrName)
      }
    })
  }

  // 判断元素属性是否是指令
  isDirective(attrName) {
    return attrName.startsWith("v-")
  }
  // 判断节点是否是文本节点
  isTextNode(node) {
    return node.nodeType === 3
  }
  // 判断节点是否是元素节点
  isElementNode(node) {
    return node.nodeType === 1
  }
}
