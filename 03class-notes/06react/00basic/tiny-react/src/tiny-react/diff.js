import mountElemet from './mountElemet'
import updateTextNode from './updateTextNode'
import updateNodeElement from './updateNodeElement'
import unMountNode from './unMountNode'
import { isFunction } from './utils'
import diffComponent from './diffComponent'

/**
 * @param {object} virtualDOM 当前的虚拟dom
 * @param {node} container 当前的容器 父亲👨
 * @param {node} oldDOM 旧dom virtualDOM 对应的DOM
 */
export default function diff(
  virtualDOM,
  container,
  oldDOM
) {
  // 见 createDOMElement
  //    newElement._virtualDOM = virtualDOM
  const oldVirtualDOM = oldDOM && oldDOM._virtualDOM
  // 相当于看container中是否含有元素
  if (!oldDOM) {
    mountElemet(virtualDOM, container)
  } else if (oldVirtualDOM) {
    if (isFunction(virtualDOM)) {
      // 还需要进一步判断
      diffComponent(virtualDOM, container, oldDOM)
    } else if ((virtualDOM.type = oldVirtualDOM.type)) {
      if (virtualDOM.type === 'text') {
        // 更新文字
        updateTextNode(oldDOM, virtualDOM, oldVirtualDOM)
      } else {
        // 更新元素属性
        updateNodeElement(oldDOM, virtualDOM, oldVirtualDOM)
      }

      const oldChildNodes = oldDOM.childNodes
      const keyMap = {}
      virtualDOM.children.forEach((child, index) => {
        if (child.props.key) {
          keyMap[child.props.key] = oldChildNodes[index]
        }
      })

      const hasKey = Reflect.ownKeys(keyMap).length !== 0
      if (hasKey) {
        virtualDOM.children.forEach((child, index) => {
          const key = child.props.key
          const dom = keyMap[key]
          debugger
          if (dom) {
            if (
              oldChildNodes[index] &&
              dom !== oldChildNodes[index]
            ) {
              oldDOM.insertBefore(dom, oldChildNodes[index])
            }
          } else {
            diff(child, oldDOM, oldDOM.childNodes[index])
          }
        })
      } else {
        // 比对子节点 进行添加 更新(移除节点属性) 节点
        virtualDOM.children.forEach((child, index) => {
          diff(child, oldDOM, oldDOM.childNodes[index])
        })
      }

      // 先按次序简单实现节点移除(都有一个爸爸 type相同)
      const newChildNodesLength = virtualDOM.children.length
      for (
        let i = oldChildNodes.length - 1;
        i > newChildNodesLength - 1;
        i--
      ) {
        unMountNode(oldChildNodes[i])
      }
    }
  }
}
