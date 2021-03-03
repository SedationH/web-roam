import diff from './diff'
import mountElemet from './mountElemet'
import unMountNode from './unMountNode'
import updateComponent from './updateComponent'

export default function diffComponent(
  virtualDOM,
  container,
  oldDOM
) {
  const oldVirtualDOM = oldDOM && oldDOM._virtualDOM
  const component = oldVirtualDOM && oldVirtualDOM.component

  // 判断是不是一个函数
  // 已经变成NativeElement了
  // if (virtualDOM.type === oldVirtualDOM.type) {
  if (isSameComponent(virtualDOM, component)) {
    updateComponent(virtualDOM, container, oldDOM)
  } else {
    mountElemet(virtualDOM, container, oldDOM)
  }
}

function isSameComponent(virtualDOM, component) {
  const constructor = component && component.constructor
  return virtualDOM.type === constructor
}
