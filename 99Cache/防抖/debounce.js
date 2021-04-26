var count = 1;
var container = document.getElementById('container');

function getUserAction(e) {
  console.log(this, e)
  container.innerHTML = count++;
};

function debounce(func, wait, immediate) {
  let timeout,result;
  const debounced = function () {
    if (timeout) {
      clearTimeout(timeout)
    }
    if (immediate) {
      let callNow = !timeout
      timeout = setTimeout(() => {
        timeout = null
      }, wait)
      if(callNow){
        result = func.call(this, arguments[0])
      }
    } else {
      timeout = setTimeout(func.bind(this, arguments[0]), wait)
    }
  }
  debounced.cancel = function(){
    console.log('取消成功')
    clearTimeout(timeout)
    timeout = null
  }

  return debounced
}

getUserAction()
// container.onmousemove = getUserAction;
// container.onmousemove = debounce(getUserAction, 500)
var setUseAction = debounce(getUserAction, 10000, true)
container.onmousemove = setUseAction

document.getElementById('btn').addEventListener('click',() => {
  setUseAction.cancel()
})