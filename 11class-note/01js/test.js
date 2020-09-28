function create() {
  const name = 1
  return function () {
    console.log(name)
  }
}

const f = create()

console.log(
 f() === f()
)