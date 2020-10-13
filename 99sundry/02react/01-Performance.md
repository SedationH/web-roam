## 关于React的性能优化

我们使用React进行组件化开发，使用组件合成我们想要的功能

从组件开发的时的包裹来看，有

```html
<Father>
	<Children></Children>
</Father>
```

在React里，如果父组件re-render了，子组件也是默认跟随re-render

> If a parent component re-renders, its child components re-render as well. React does this by default because preventing a re-render of child components could lead to bugs, and the re-rendering mechanism of React is still fast.



React对此进行了优化，尽管有些re-render不需要，但是渲染的速度很快

当我们的项目变大，组件数量剧增，相关数据计算又比较耗时的时候，就需要有针对性的让某些组件不需要re-render



主要方法

对于设计大量计算的数据防止重复计算

```react
React.useMemo(() => getSumComments(stories), [
    stories,
  ]);
```



将组件进行memo

```js
export default React.memo(
	function List(props){
    return (
    	<div>List</div>
    )
  }
)
```

如果组件中的props涉及到函数

就在function signature的位置使用useCallback包裹相关函数

```js
const handleButtonClick = useCallback(item => {
    dispatchStories({
      type: 'REMOVE_STORY',
      payload: item,
    });
  }, [])
```



useRef也是个很好用的方法，可以看作是在整个函数外创建了一个长期存在的imutable数据，而xRef.current是mitable的

可以用于useEffect中来判断组件是首次渲染还是re-render，有选择的执行相关逻辑



最后

Now, after we went through these scenarios for `useMemo`, `useCallback`, and `memo`, remember that these shouldn’t necessarily be used by default. Apply these performance optimization only if you run into a performance bottlenecks. Most of the time this shouldn’t happen, because React’s rendering mechanism is pretty efficient by default. 

Keep Simple and Concise :heart:

