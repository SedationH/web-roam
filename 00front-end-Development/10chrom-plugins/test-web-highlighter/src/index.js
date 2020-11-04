import "./my.css"
import Highlighter from "web-highlighter"
let mList = document.getElementById("myList"),
  btnChild = document.querySelector(".btnChild"),
  btnStart = document.querySelector(".btnStart"),
  btnStop = document.querySelector(".btnStop"),
  // The options object, later passed into observe()
  options = {
    childList: true,
  },
  // Grab a reference to the MutationObserver
  // created with the constructor
  observer = new MutationObserver(mCallback)

// This is the callback passed into the constructor
function mCallback(mutations) {
  console.log(mutations)
  // loop through the mutations record to see
  // if any match what we want
  for (let mutation of mutations) {
    if (mutation.type === "childList") {
      console.log(
        "Mutation Detected: A child node has been added or removed."
      )
    }
  }
}

// Just a utility function to simplify some btn/log code
function doLogAndBtn(msg) {
  console.log(msg)
  btnStart.disabled = !btnStart.disabled
  btnStop.disabled = !btnStop.disabled
}

btnStart.addEventListener(
  "click",
  function () {
    // Start observing the list element using
    // the passed in options as qualifiers
    observer.observe(mList, options)
    doLogAndBtn("Observing for mutations: STARTED")
  },
  false
)

// This button interactively modifies the DOM
// which meets the specified observe criteria
btnChild.addEventListener(
  "click",
  function () {
    if (document.querySelector(".child")) {
      mList.removeChild(document.querySelector(".child"))
    } else {
      mList.insertAdjacentHTML(
        "beforeend",
        '\n<li class="child">Peaches</li>'
      )
    }
  },
  false
)

btnStop.addEventListener(
  "click",
  function () {
    // This stops the MutationObserver
    observer.disconnect()
    doLogAndBtn("Observing for mutations: STOPPED")
  },
  false
)
