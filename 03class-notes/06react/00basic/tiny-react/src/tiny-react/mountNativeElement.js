import mountElemet from './mountElemet'
import createDOMElement from './createDOMElement'

export default function mountNativeElement(
  virtualDOM,
  container
) {
  const newElement = createDOMElement(virtualDOM)
  if (virtualDOM.component) {
    virtualDOM.component.setDOM(newElement)
  }
  container.appendChild(newElement)
}
