import mountElemet from './mountElemet'
import updateTextNode from './updateTextNode'
import updateNodeElement from './updateNodeElement'
/**
 * @param {object} virtualDOM 当前的虚拟dom
 * @param {node} container 当前的容器 父亲👨
 * @param {node} oldDOM 旧dom virtualDOM 对应的DOM
 *
 */
export default function diff(
  virtualDOM,
  container,
  oldDOM
) {
  // 见 createDOMElement
  //    newElement._virtualDOM = virtualDOM
  const oldVirtualDOM = oldDOM && oldDOM._virtualDOM
  // judge if oldDOM exists
  if (!oldDOM) {
    mountElemet(virtualDOM, container)
  } else if (oldVirtualDOM) {
    if ((virtualDOM.type = oldVirtualDOM.type)) {
      if (virtualDOM.type === 'text') {
        // 更新文字
        updateTextNode(oldDOM, virtualDOM, oldVirtualDOM)
      } else {
        // 更新元素属性
        updateNodeElement(oldDOM, virtualDOM, oldVirtualDOM)
      }

      virtualDOM.children.forEach((child, index) => {
        diff(child, oldDOM, oldDOM.childNodes[index])
      })
    }
  }
}
