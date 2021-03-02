import mountNativeElement from './mountNativeElement.js'
import mountComponent from './mountComponent.js'
import { isFunction } from './utils'

export default function mountElemet(
  virtualDOM,
  container,
  oldDOM
) {
  // Component or NativeELement
  if (isFunction(virtualDOM)) {
    mountComponent(virtualDOM, container, oldDOM)
  } else {
    mountNativeElement(virtualDOM, container, oldDOM)
  }
}
