function* gen() {
  while (true) {
    let value = yield null;
    console.log(value);
  }
}

const g = gen();
g.next();
// "{ value: null, done: false }"
g.next(1);
// 2
// "{ value: null, done: false }"

g.next(2);
