import diff from './diff'
export default function render(
  virtualDOM,
  container,
  // firstElementChild vs firstChild
  oldDOM = container.firstChild
) {
  diff(virtualDOM, container, oldDOM)
}
