chrome.runtime.onMessage.addListener(function (
  request,
  sender,
  sendResponse
) {
  if (request.message === "clicked_browser_action") {
    var firstHref = $("a[href^='http']").eq(0).attr("href")

    console.log(firstHref)

    chrome.runtime.sendMessage({
      message: "open_new_tab",
      url: firstHref,
    })
  }
})

setTimeout(() => {
  chrome.runtime.sendMessage({
    message: "get_new_html_source",
    htmlSource: $("body").html(),
  })

  document.addEventListener("DOMNodeInserted", (e) => {
    console.log("有新的DOM插入", e)
  })
}, 5000)
