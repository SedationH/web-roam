const arr = [1, 1, 2, 6, 3, 5, 0, 3, 6, 8, 9, 4, 4, 2, 0, 9, 5, 2, 7, 4, 2, 3]

// for循环版本
function uniqueArr1(arr) {
  let ans = []
  for (let i = 0; i < arr.length; i++) {
    let isRepeat = false
    for (let j = 0; j < ans.length; j++) {
      if (arr[i] === ans[j]) {
        isRepeat = true
        break
      }
    }
    if (!isRepeat) {
      ans.push(arr[i])
    }
  }
  return ans
}
console.log(1, uniqueArr1(arr))

// filter方法
// indexOf 返回数组中第一个等于的元素的索引
function uniqueArr2(arr) {
  return arr.filter((value, index) => {
    return arr.indexOf(value) === index
  })
}
console.log(2, uniqueArr2(arr))

// 看数组中有没有某个元素的方法
/**
 * indexOf() === -1 ✅ 
 * includes() === true ✅
 */
let test = [1, 2, NaN];
console.log(test.indexOf(NaN)) // -1
console.log(test.includes(NaN)) // true
console.log(NaN == NaN); // false
console.log(NaN === NaN); // false

// 使用reduce
function uniqueArr3(arr) {
  return arr.slice().sort().reduce((prev, curr) => {
    if (prev.length === 0 || prev[prev.length - 1] !== curr) {
      prev.push(curr)
    }
    return prev
  }, [])
}
console.log(3, uniqueArr3(arr))

// Set
function uniqueArr4(arr) {
  return Array.from(new Set(arr))
}
console.log(4, uniqueArr4(arr))