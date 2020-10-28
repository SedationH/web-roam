import "./my.css"
import Highlighter from "web-highlighter"
const highlighter = new Highlighter({
  style: {
    className: "highlight-wrap",
  },
})

highlighter
  .on(Highlighter.event.CREATE, ({ sources }) => {
    console.log(sources[0].text)
  })
  .on(Highlighter.event.HOVER, ({ id }) => {
    highlighter.addClass("highlight-wrap-hover", id)
  })
  .on(Highlighter.event.HOVER_OUT, ({ id }) => {
    highlighter.removeClass("highlight-wrap-hover", id)
  })
  .on(Highlighter.event.CLICK, ({ id }) => {
    highlighter.remove(id)
  })

document.addEventListener("click", (e) => {
  const selection = window.getSelection()
  if (selection.isCollapsed) {
    return
  }
  const range = window.getSelection().getRangeAt(0)
  const start = {
    node: range.startContainer,
    offset: range.startOffset,
  }
  const end = {
    node: range.endContainer,
    offset: range.endOffset,
  }
  console.log(start, end)
  highlighter.fromRange(selection.getRangeAt(0))
  // 消除原有的文本选中(浏览器文本选择出现的阴影效果)
  window.getSelection().removeAllRanges()
})
