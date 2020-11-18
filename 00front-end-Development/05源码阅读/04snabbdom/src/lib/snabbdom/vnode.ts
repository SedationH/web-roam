type Key = string | number
type Attrs = Record<string, string | number | boolean>
type Props = Record<string, any>
type Classes = Record<string, boolean>
type On = {
  [N in keyof HTMLElementEventMap]?: (
    ev: HTMLElementEventMap[N]
  ) => void
} & {
  [event: string]: EventListener
}
type Dataset = Record<string, string>
type VNodeStyle = Record<string, string> & {
  delayed?: Record<string, string>
  remove?: Record<string, string>
}

export interface VNode {
  // sel: string | undefined
  __type: symbol
  type: string | undefined
  key: Key | undefined
  data: VNodeData | undefined
  children: Array<VNode | string> | undefined
  text: string | undefined
  elm: Node | undefined
}

export interface VNodeData {
  id?: string
  props?: Props
  attrs?: Attrs
  class?: Classes
  style?: VNodeStyle
  dataset?: Dataset
  on?: On
  key?: Key
}

const VNODE_TYPE = Symbol("virtual-node")

function vnode(
  type: string | undefined,
  key: string | undefined,
  data: any | undefined,
  children: Array<VNode | string> | undefined,
  text: string | undefined,
  elm: Element | Text | undefined
): VNode {
  return {
    __type: VNODE_TYPE,
    type,
    key,
    data,
    children,
    text,
    elm,
  }
}

function isVnode(vnode: VNode) {
  return vnode && vnode.__type === VNODE_TYPE
}

function isSameVnode(oldVnode: VNode, vnode: VNode) {
  return (
    oldVnode.key === vnode.key &&
    oldVnode.type === vnode.type
  )
}

export default vnode
export { isVnode, isSameVnode, VNODE_TYPE }
