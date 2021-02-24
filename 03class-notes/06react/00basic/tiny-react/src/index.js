import TinyReact from './tiny-react'

const root = document.getElementById('root')

const virtualDOM = (
  <div className="container">
    <h1>你好 Tiny React</h1>
    <h2>(编码必杀技)</h2>
    <div>
      嵌套1 <div>嵌套 1.1</div>
    </div>
    <h3>(观察: 这个将会被改变)</h3>
    {2 == 1 && <div>如果2和1相等渲染当前内容</div>}
    {2 == 2 && <div>2</div>}
    <span>这是一段内容</span>
    <button onClick={() => alert('你好')}>点击我</button>
    <input type="password" />
    <h3>这个将会被删除</h3>
    2, 3
    <ul>
      <li>1</li>
      <li>2</li>
    </ul>
  </div>
)

TinyReact.render(virtualDOM, root)

console.log(virtualDOM)
