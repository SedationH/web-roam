import TinyReact from './tiny-react'

const root = document.getElementById('root')

class Bar extends TinyReact.Component {
  render() {
    return <div>this is bar</div>
  }
}

class Foo extends TinyReact.Component {
  constructor(props) {
    super(props)
    this.state = {
      value: 'default value',
    }
  }
  
  getDOMRef() {
    console.log(this.DOMRef)
  }

  getComponentRef() {
    console.log(this.bar)
  }

  render() {
    return (
      <div>
        <div ref={e => (this.DOMRef = e)}>DOM Ref</div>
        <button onClick={() => this.getDOMRef()}>
          getDOMRef
        </button>
        <Bar ref={e => (this.bar = e)} />
        <button onClick={() => this.getComponentRef()}>
          getComponentRef
        </button>
      </div>
    )
  }
}

TinyReact.render(<Foo title="1" />, root)