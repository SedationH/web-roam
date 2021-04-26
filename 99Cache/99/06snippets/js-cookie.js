/**
 * 便于理解的正则入门
 * https://juejin.im/post/5b5db5b8e51d4519155720d2#heading-12
 */
const cookie = "id=123; username=yang; sex=1"

/**
 * 先分析下cookie的规律
 * cookie是一大串字符串，格式是key=value的形式
 * 特比的
 *  第一个key前面没空格 除了第一个key之外的key前面都带个空格
 *  value后都有分号 除了最后一个没有
 */

//  先试着获取id
const reg1 = /(^| )id=([^;]*)(;|$)/
console.log(
  cookie.match(reg1)
)

function getCookie(cookie, key) {
  // 以一行的开头或者空格作为开头
  const reg = new RegExp(`(^| )${key}=([^;]*)(;|$)`)
  return cookie.match(reg)[2]
}

console.log(
  getCookie(
    "id=123; username=yang; sex=1",
    'username'
  )
)