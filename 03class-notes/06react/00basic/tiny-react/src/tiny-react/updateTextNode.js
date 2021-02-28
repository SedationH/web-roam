export default function updateTextNode(
  DOM,
  virtualDOM,
  oldVirtualDOM
) {
  if (
    virtualDOM.props.textContent !==
    oldVirtualDOM.props.textContent
  ) {
    DOM.textContent = virtualDOM.props.textContent
    DOM._virtualDOM = virtualDOM
  }
}
