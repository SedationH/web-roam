import mountElemet from './mountElemet'
import createDOMElement from './createDOMElement'

export default function mountNativeElement(
  virtualDOM,
  container
) {
  let newElement = createDOMElement(virtualDOM)
  container.appendChild(newElement)
}
