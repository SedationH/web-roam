使用的时候注意下版本

`    "snabbdom": "^0.7.4"` 不然导包和使用都可能会出现问题



具体使用参看src下两个js文件即可



## Debug

### patch

patch用于对比传入的 oldVnode & vnode进行比较和DOM操作 是init 函数返回的函数 init![image-20201116192342105](/Users/sedationh/Library/Application Support/typora-user-images/image-20201116192342105.png)

createElement 前后

![image-20201116192429390](http://picbed.sedationh.cn/image-20201116192429390.png)

![image-20201116192530449](http://picbed.sedationh.cn/image-20201116192530449.png)

代码并不多

```js
return function patch(oldVnode: VNode | Element, vnode: VNode): VNode {
  let i: number, elm: Node, parent: Node;
  const insertedVnodeQueue: VNodeQueue = [];
  for (i = 0; i < cbs.pre.length; ++i) cbs.pre[i]();

  if (!isVnode(oldVnode)) {
    oldVnode = emptyNodeAt(oldVnode);
  }

  // 看是否是同一个节点
  if (sameVnode(oldVnode, vnode)) {
    patchVnode(oldVnode, vnode, insertedVnodeQueue);
  } else {
    elm = oldVnode.elm as Node;
    parent = api.parentNode(elm);

    // 这里根据vnode创建了DOM但是还没有放到页面上
    createElm(vnode, insertedVnodeQueue);

    // 进行插入
    if (parent !== null) {
      api.insertBefore(parent, vnode.elm as Node, api.nextSibling(elm));
      removeVnodes(parent, [oldVnode], 0, 0);
    }
  }

  for (i = 0; i < insertedVnodeQueue.length; ++i) {
    (((insertedVnodeQueue[i].data as VNodeData).hook as Hooks).insert as any)(insertedVnodeQueue[i]);
  }
  for (i = 0; i < cbs.post.length; ++i) cbs.post[i]();
  return vnode;
};
```



removeVnodes



patchVnode  中 updateChildren 是diff算法的核心逻辑

即同层元素如何更高效的处理 -> O(n)

今个看得我有点懵



