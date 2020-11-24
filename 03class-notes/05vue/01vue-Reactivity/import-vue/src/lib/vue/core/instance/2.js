import { foo } from "./1"
console.log(foo)

setTimeout(() => {
  console.log(foo)
}, 1000)
