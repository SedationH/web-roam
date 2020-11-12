export default class Dep {
  constructor() {
    this.subs = []
  }

  addSub(sub) {
    // 判断加入的sub是否具有update方法
    if (sub && sub.update) {
      this.subs.push(sub)
    }
  }

  notify() {
    this.subs.forEach((sub) => sub.update())
  }
}
