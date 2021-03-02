import mountElemet from './mountElemet'
import createDOMElement from './createDOMElement'
import unMountNode from './unMountNode'

export default function mountNativeElement(
  virtualDOM,
  container,
  oldDOM
) {
  const newElement = createDOMElement(virtualDOM)
  if (virtualDOM.component) {
    virtualDOM.component.setDOM(newElement)
  }
  // 删除旧的DOM
  oldDOM && unMountNode(oldDOM)
  container.appendChild(newElement)
}
