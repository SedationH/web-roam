import "./my.css"
import Highlighter from "web-highlighter"
import LocalStore from "./local.store"
import { log } from "./uitils/index"

// 初始化仓库和highlighter instance
const store = new LocalStore()
const highlighter = new Highlighter({
  style: {
    className: "highlight-wrap",
  },
})

// 开始文本自动标记
// highlighter.run()

// 从标记仓库中拿到曾经的值，再显示
const storeInfos = store.getAll()
storeInfos.forEach(({ hs }) =>
  highlighter.fromStore(
    hs.startMeta,
    hs.endMeta,
    hs.text,
    hs.id,
    hs.extra
  )
)

// 添加特定事件
highlighter
  .on(Highlighter.event.CREATE, ({ sources }) => {
    sources = sources.map((hs) => ({ hs }))
    store.save(sources)
    log(sources)
  })
  .on(Highlighter.event.HOVER, ({ id }) => {
    highlighter.addClass("highlight-wrap-hover", id)

    const $span = document.querySelector(
      `span[data-id='${id}']`
    )
    // 防止创建多个
    if ($span) {
      $span.classList.remove("hidden")
      return
    }
    const position = getPosition(highlighter.getDoms(id)[0])
    createTag(
      position.top,
      position.left,
      id
    ).classList.remove("hidden")
  })
  .on(Highlighter.event.HOVER_OUT, ({ id }) => {
    highlighter.removeClass("highlight-wrap-hover", id)
    const $span = document.querySelector(
      `span[data-id='${id}']`
    )
    if ($span === null) return
    $span.classList.add("hidden")
  })
  .on(Highlighter.event.CLICK, ({ id }) => {
    highlighter.removeClass("highlight-wrap-hover", id)
    highlighter.remove(id)
    const $span = document.querySelector(
      `span[data-id='${id}']`
    )
    $span.parentElement.removeChild($span)
  })
  .on(Highlighter.event.REMOVE, ({ ids }) => {
    ids.forEach((id) => store.remove(id))
  })

function getPosition($node) {
  let offset = {
    top: 0,
    left: 0,
  }
  while ($node) {
    offset.top += $node.offsetTop
    offset.left += $node.offsetLeft
    $node = $node.offsetParent
  }

  return offset
}

const createTag = (top, left, id) => {
  const $span = document.createElement("span")
  $span.style.left = `${left - 20}px`
  $span.style.top = `${top - 25}px`
  $span.dataset["id"] = id
  $span.textContent = "点击删除"
  $span.classList.add("remove-tip")
  document.body.appendChild($span)
  return $span
}
