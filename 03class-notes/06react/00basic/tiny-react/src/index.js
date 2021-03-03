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
  componentWillReceiveProps() {
    console.log(arguments)
    console.log('componentWillReceiveProps')
  }
  componentWillUpdate() {
    console.log(arguments)
    console.log('componentWillUpdate')
  }
  componentDidUpdate() {
    console.log(arguments)
    console.log('componentDidUpdate')
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

class Bar extends TinyReact.Component {
  render() {
    return <div>this is bar</div>
  }
}

TinyReact.render(<Foo title="1" />, root)

setTimeout(() => {
  TinyReact.render(<Foo title="2" />, root)
  // TinyReact.render(<Bar />, root)
}, 200)
