import TinyReact from './tiny-react'

const root = document.getElementById('root')

class Foo extends TinyReact.Component {
  constructor(props) {
    super(props)
    this.state = {
      children: [
        { id: '1', name: 'A' },
        { id: '2', name: 'B' },
        { id: '3', name: 'C' },
        { id: '4', name: 'D' },
        { id: '5', name: 'E' },
      ],
    }
  }
  change() {
    const newState = Object.assign({}, this.state)
    newState.children.push(newState.children.shift())
    this.setState(newState)
  }
  render() {
    return (
      <div>
        <ul>
          {this.state.children.map(child => (
            <li key={child.id}>{child.name}</li>
          ))}
        </ul>
        <button onClick={() => this.change()}>
          getComponentRef
        </button>
      </div>
    )
  }
}

TinyReact.render(<Foo title="1" />, root)

// const JSX = <div>hi</div>

// TinyReact.render(JSX, root)
