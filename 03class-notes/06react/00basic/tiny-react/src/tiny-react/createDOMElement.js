import mountElemet from './mountElemet'
import updateNodeElement from './updateNodeElement'

export default function createDOMElement(virtualDOM) {
  let newElement = null
  if (virtualDOM.type === 'text') {
    newElement = document.createTextNode(
      virtualDOM.props.textContent
    )
  } else {
    newElement = document.createElement(virtualDOM.type)
    updateNodeElement(newElement, virtualDOM)
  }

  // 相当于说通过react创建的每个dom上都绑着virtualDOM
  newElement._virtualDOM = virtualDOM

  // 处理ref
  if (virtualDOM.props && virtualDOM.props.ref) {
    virtualDOM.props.ref(newElement)
  }

 try {
  virtualDOM.children.forEach(child => {
    mountElemet(child, newElement)
  })
 } catch (error) {
   debugger
 }
  return newElement
}
