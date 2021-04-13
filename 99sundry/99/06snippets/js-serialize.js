export function serialize(data) {
  const query = Object.keys(data)
    .map(key => data[key] && `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`)
    .join('&')

  return `?${query}`
}