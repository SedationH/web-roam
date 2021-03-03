import { isFunctionComponent } from './utils'
import mountElemet from './mountElemet'

export default function mountComponent(
  virtualDOM,
  container,
  oldDOM
) {
  let nextVirtualDOM = null
  // 判断是类组件还是函数式组件
  if (isFunctionComponent(virtualDOM)) {
    nextVirtualDOM = buildFunctionComponent(virtualDOM)
  } else {
    nextVirtualDOM = buildClassComponent(virtualDOM)
  }
  mountElemet(nextVirtualDOM, container, oldDOM)
}

function buildFunctionComponent(virtualDOM) {
  return virtualDOM.type(virtualDOM.props || {})
}

function buildClassComponent(virtualDOM) {
  const component = new virtualDOM.type(
    virtualDOM.props || {}
  )
  const newVirtualDOM = component.render()
  newVirtualDOM.component = component

  // 处理组件的ref
  if (virtualDOM.props && virtualDOM.props.ref) {
    virtualDOM.props.ref(component)
  }
  return newVirtualDOM
}
