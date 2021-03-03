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
    diff(
      virtualDOM,
      this.getDOM().parentNode,
      this.getDOM()
    )
  }

  updateProps(props) {
    this.props = props
  }

  componentWillMount() {}
  componentDidMount() {}

  componentWillReceiveProps(nextProps) {}
  shouldComponentUpdate(nextProps, nextState) {
    return (
      nextProps !== this.props || nextState !== this.state
    )
  }
  componentWillUpdate(nextProps, nextState) {}
  componentDidUpdate(prevProps, prevState) {}
  componentWillUnmount() {}

  setDOM(newElement) {
    this._DOM = newElement
  }

  getDOM() {
    return this._DOM
  }
}
