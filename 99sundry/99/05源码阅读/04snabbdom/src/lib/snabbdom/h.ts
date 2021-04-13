import { isArray, isPrimitive, flattenArray } from "./utils"
import vnode, { VNode, VNodeData } from "./vnode"

const getObjKeys = (obj) => Object.keys(obj)

function h(
  type: string,
  config: VNodeData,
  ...children
): VNode {
  const key = config?.key
  const data: VNodeData = {}
  for (const propName of getObjKeys(config)) {
    data[propName] = config[propName]
  }
  return vnode(
    type,
    key as string,
    data,
    flattenArray(children).map((c) => {
      return isPrimitive(c)
        ? vnode(
            undefined,
            undefined,
            undefined,
            undefined,
            c,
            undefined
          )
        : c
    }),
    undefined,
    undefined
  )
}

export default h
