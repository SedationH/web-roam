import mountNativeElement from './mountNativeElement.js'
import mountComponent from './mountComponent.js'
import { isFunction } from './utils'

export default function mountElemet(virtualDOM, container) {
  // Component or NativeELement
  if (isFunction(virtualDOM)) {
    mountComponent(virtualDOM, container)
  } else {
    mountNativeElement(virtualDOM, container)
  }
}
