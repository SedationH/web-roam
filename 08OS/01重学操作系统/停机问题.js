// https://github.com/SedationH/web-roam/tree/master/08OS
// 整体为反证法

/**
 * halt表示等等 函数返回
 * 先假设这样能够判断停机问题的程序存在
 * 函数返回true表示program在输入input的时候能够停止，是会停机的
 * 函数返回false表示program在输入input的时候不能停止，不会停机 
 */
function isHalt(program, input) {
  // need to implement
}

function loop() {
  while (true) { }
}

// 演示下isHalt的使用
function foo(input) {
  if (input === 0) return
  else loop()
}

isHalt(foo, 0) === true
isHalt(foo, 1) === false


// 举反例
function hack(program) {
  // 如果会停止，我就让他loop，故意制造矛盾
  if (isHalt(program, program)) loop()
  // 不会停止我就让他返回
  else return
}

// 这里就产生了矛盾
if (isHalt(hack, hack) === true) {
  // 那么hack函数内部在执行判断的时候
  isHalt(hack, hack) === false
} else {
  isHalt(hack, hack) === true
}