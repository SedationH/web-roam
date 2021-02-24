import mountElemet from './mountElemet'
export default function mountNativeElement(
  virtualDOM,
  container
) {
  let newElement = null
  if (virtualDOM.type === 'text') {
    newElement = document.createTextNode(
      virtualDOM.props.textContent
    )
  } else {
    newElement = document.createElement(virtualDOM.type)
  }
  virtualDOM.children.forEach(child => {
    mountElemet(child, newElement)
  })
  container.appendChild(newElement)
}
