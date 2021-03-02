import diff from './diff'

export default class Component {
  constructor(props) {
    this.props = props
  }
  setState(state) {
    this.state = Object.assign({}, this.state, state)
    const virtualDOM = this.render()
    // 整个过程中实例是没有改变过的
    // 可以尝试从创建实例的时候拿到dom 来调用TintReat.render
    // ⚠️区分 TintReat.render & this.render
    debugger
    diff(
      virtualDOM,
      this.getDOM().parentNode,
      this.getDOM()
    )
  }

  setDOM(newElement) {
    this._DOM = newElement
  }

  getDOM() {
    return this._DOM
  }
}
