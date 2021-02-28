export default function updateNodeElement(
  newElement,
  virtualDOM,
  oldVirtualDOM = {}
) {
  const newProps = virtualDOM.props
  const oldProps = oldVirtualDOM.props || {}
  // 处理更新的情况 创建和更新都是更新
  Reflect.ownKeys(newProps).forEach(propName => {
    const newValue = newProps[propName]
    const oldValue = oldProps[propName]
    if (newValue !== oldValue) {
      // handle events
      if (propName.slice(0, 2) === 'on') {
        const eventName = propName.toLowerCase().slice(2)
        newElement.addEventListener(eventName, newValue)
        // 删除原来的事件
        if (oldValue) {
          newElement.removeEventListener(
            eventName,
            oldValue
          )
        }
        // 兼容处理
        // https://developer.mozilla.org/en-US/docs/Web/API/Element/setAttribute#notes
      } else if (
        propName === 'value' ||
        propName === 'checked'
      ) {
        newElement[propName] = newValue
      } else if (propName !== 'children') {
        if (propName === 'className') {
          newElement.setAttribute('class', newValue)
        } else {
          newElement.setAttribute(propName, newValue)
        }
      }
    }
  })

  // 处理删除的情况
  // 从旧props找新的props没有了就删除
  Reflect.ownKeys(oldProps).forEach(propName => {
    const newValue = newProps[propName]
    const oldValue = oldProps[propName]
    if (!newProps.hasOwnProperty(propName)) {
      if (propName.slice(0, 2) === 'on') {
        const eventName = propName.toLowerCase().slice(2)
        newElement.removeEventListener(eventName, oldValue)
      } else if (propName !== 'children') {
        if (propName === 'className') {
          newElement.removeAttribute('class')
        } else {
          newElement.removeAttribute(propName)
        }
      }
    }
  })
}
