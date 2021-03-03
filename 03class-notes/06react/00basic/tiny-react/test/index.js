function foo(...args) {
  const arr = [].concat(...args)
  console.log(arr)
}

foo(1,2,3)
// (3) [1, 2, 3]
foo([1,2,3],4,[5,6])
// (6) [1, 2, 3, 4, 5, 6]