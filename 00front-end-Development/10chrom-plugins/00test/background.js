var buttonState = false // false表示关闭；true 表示开启

chrome.browserAction.onClicked.addListener(function (tab) {
  // Send a message to the active tab
  chrome.tabs.query(
    { active: true, currentWindow: true },
    function (tabs) {
      var activeTab = tabs[0]
      console.log(activeTab)
      chrome.tabs.sendMessage(activeTab.id, {
        message: "clicked_browser_action",
      })
    }
  )
})

chrome.runtime.onMessage.addListener(function (
  request,
  sender,
  sendResponse
) {
  if (request.message === "open_new_tab") {
    chrome.tabs.create({ url: request.url })
  }

  if (request.message === "get_new_html_source") {
    if (buttonState) {
      console.log("begin post")
      $.post(
        "http://localhost:3000/api",
        {
          htmlSource: request.htmlSource,
        },
        (e) => {
          console.log(e)
        }
      )
    } else {
      console.log("没有发送请求")
    }
  }

  if (request.message === "toggle_button_state") {
    console.log("toggle_button_state")
    buttonState = !buttonState
  }
})
