export function isFunction(virtualDOM) {
  return virtualDOM && typeof virtualDOM.type === 'function'
}

export function isFunctionComponent(virtualDOM) {
  const type = virtualDOM.type
  return (
    isFunction(virtualDOM) &&
    !(type.prototype && type.prototype.render)
  )
}
