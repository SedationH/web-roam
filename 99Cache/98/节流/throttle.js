var count = 1;
var container = document.getElementById('container');

function getUserAction(e) {
  container.innerHTML = count++;
};

getUserAction()

function throttle(func, wait) {
  let previous = 0

  return function () {
    let now = +new Date()
    if(now - previous > wait){
      console.log(this)
      func.apply(this,arguments[0])
      previous = now
    }
  }
}

container.onmousemove = throttle(getUserAction, 1000);
