type Mode = "leading" | "trailing"
type FN = (
  fn: Function,
  wait: number,
  mode?: Mode
) => Function

const debounce: FN = (fn, wait, mode) => {
  let timerID: number = null

  if (mode === "leading") {
    return function (...args: Array<any>) {
      const context: Object = this
      clearTimeout(timerID)

      timerID = setTimeout(() => {
        fn.apply(context, args)
      }, wait)
    }
  } else if (mode === "trailing") {
    return function (...args: Array<any>) {
      const context: Object = this

      if (timerID === null) fn.apply(context, args)
      timerID = setTimeout(() => {
        clearTimeout(timerID)
        timerID = null
      }, wait)
    }
  }
}

const throttle: FN = (fn, wait) => {
  let timerID: number = null

  return function (...args: Array<any>) {
    const context: Object = this
    if (timerID !== null) return
    if (timerID === null) {
      fn.apply(context, args)
    }

    timerID = setTimeout(() => {
      // 只有调用后才清除掉
      clearTimeout(timerID)
      timerID = null
      fn.apply(context, args)
    }, wait)
  }
}
