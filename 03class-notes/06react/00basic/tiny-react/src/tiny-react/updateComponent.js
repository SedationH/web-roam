import diff from './diff'

export default function updateComponent(
  virtualDOM,
  container,
  oldDOM
) {
  const oldVirtualDOM = oldDOM && oldDOM._virtualDOM
  const component = oldVirtualDOM && oldVirtualDOM.component
  const newProps = virtualDOM.props
  const oldProps = component.props
  component.componentWillReceiveProps(newProps)
  if (component.shouldComponentUpdate(newProps)) {
    component.componentWillUpdate(newProps)
    const newComponent = component.updateProps(newProps)
    const newVirtualDOM = component.render()
    newVirtualDOM.component = newComponent
    diff(newVirtualDOM, container, oldDOM)
    component.componentDidUpdate(oldProps)
  }
}
