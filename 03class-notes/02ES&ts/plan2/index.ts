interface User {
  name: string
  age: number
  gender: 'male' | 'female'
}

const tony: User = {
  name: 'Tony Huang',
  age: 18,
  gender: 'male'
}

const entries = Object.entries(tony)

console.log(entries)