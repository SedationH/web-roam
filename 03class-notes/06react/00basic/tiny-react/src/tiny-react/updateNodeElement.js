export default function updateNodeElement(
  newElement,
  virtualDOM
) {
  const newProps = virtualDOM.props
  Reflect.ownKeys(newProps).forEach(propName => {
    // handle events
    if (propName.slice(0, 2) === 'on') {
      const eventName = propName.toLowerCase().slice(2)
      newElement.addEventListener(
        eventName,
        newProps[propName]
      )
      // 兼容处理
      // https://developer.mozilla.org/en-US/docs/Web/API/Element/setAttribute#notes
    } else if (
      propName === 'value' ||
      propName === 'checked'
    ) {
      newElement[propName] = newProps[propName]
    } else if (propName !== 'children') {
      if (propName === 'className') {
        newElement.setAttribute('class', newProps[propName])
      } else {
        newElement.setAttribute(
          propName,
          newProps[propName]
        )
      }
    }
  })
}
