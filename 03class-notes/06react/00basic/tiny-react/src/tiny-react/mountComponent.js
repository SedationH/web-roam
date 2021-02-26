import { isFunctionComponent } from './utils'
import mountElemet from './mountElemet'

export default function mountComponent(
  virtualDOM,
  container
) {
  let nextVirtualDOM = null
  // 判断是类组件还是函数式组件
  if (isFunctionComponent(virtualDOM)) {
    nextVirtualDOM = buildFunctionComponent(virtualDOM)
  } else {
    console.log('是类组件')
  }
  mountElemet(nextVirtualDOM, container)
}

function buildFunctionComponent(virtualDOM) {
  return virtualDOM.type(virtualDOM.props || {})
}
