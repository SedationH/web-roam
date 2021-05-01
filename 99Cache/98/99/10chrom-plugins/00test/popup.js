const CLOSE = "Close",
  OPEN = "Open"
let { buttonState } = chrome.extension.getBackgroundPage()
console.log(buttonState)
if (buttonState) {
  $("#toggle_button").text(OPEN)
} else {
  $("#toggle_button").text(CLOSE)
}

$("#toggle_button").click(() => {
  buttonState = !buttonState
  chrome.runtime.sendMessage({
    message: "toggle_button_state",
  })
  if (buttonState) {
    $("#toggle_button").text(OPEN)
  } else {
    $("#toggle_button").text(CLOSE)
  }
})
