function createElement(type, props, ...children) {
  const childElements = children.reduce((res, child) => {
    if (
      child !== false &&
      child !== true &&
      child !== null
    ) {
      if (child instanceof Object) {
        res.push(child)
      } else {
        // 文本节点
        res.push(
          createElement('text', {
            textContent: child,
          })
        )
      }
    }
    return res
  }, [])
  return {
    type,
    props: Object.assign(
      {
        children: childElements,
      },
      props
    ),
    children: childElements,
  }
}

export default createElement
