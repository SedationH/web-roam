function fib(n) {
  if (n == 1 || n == 2) return n
  let f1 = 1, f2 = 2
  for (let i = 3; i <= n; i++) {
    [f1, f2] = [f2, f1 + f2]
  }

  return f2
}

console.log(
  fib(3)
)