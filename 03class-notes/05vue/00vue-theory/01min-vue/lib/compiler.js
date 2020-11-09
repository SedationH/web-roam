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
      if (Compiler.isTextNode(node)) {
        this.complieText(node)
      } else if (Compiler.isElementNode(node)) {
        this.compileElement(node)
      }

      // 判断node节点是否还有字节点，递归调用compile
      if (node.childNodes && node.childNodes.length) {
        this.compile(node)
      }
    })
  }

  // 编译元素节点，处理指令
  compileElement(node) {
    console.dir(node)
  }

  // 编译文本节点，处理Mustache语法
  complieText(node) {
    // console.dir(node)
  }

  // 判断元素属性是否是指令
  static isDirective(attrName) {
    return attrName.startsWith("v-")
  }
  // 判断节点是否是文本节点
  static isTextNode(node) {
    return node.nodeType === 3
  }
  // 判断节点是否是元素节点
  static isElementNode(node) {
    return node.nodeType === 1
  }
}
