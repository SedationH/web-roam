import TinyReact from './tiny-react'

const root = document.getElementById('root')

class Foo extends TinyReact.Component {
  constructor(props) {
    super(props)
    this.state = {
      value: 'default value',
    }
    this.setValue = this.setValue.bind(this)
  }
  setValue() {
    this.setState({ value: 'changed value' })
  }
  render() {
    return (
      <div>
        <div>{this.props.title} Foo class Component</div>
        <button onClick={this.setValue}>点我</button>
        <div>{this.state.value}</div>
      </div>
    )
  }
}

TinyReact.render(<Foo title="1" />, root)
