export default function updateTextNode(
  virtualDOM,
  oldVirtualDOM,
  DOM
) {
  if (
    virtualDOM.props.textContent !==
    oldVirtualDOM.props.textContent
  ) {
    DOM.textContent = virtualDOM.props.textContent
    DOM._virtualDOM = virtualDOM
  }
}
