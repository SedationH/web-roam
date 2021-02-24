import mountElemet from './mountElemet'

export default function diff(
  virtualDOM,
  container,
  oldDOM
) {
  // judge if oldDOM exists
  if (!oldDOM) {
    mountElemet(virtualDOM, container)
  }
}
