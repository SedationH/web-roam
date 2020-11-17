

## 虚拟DOM

what?

通过 js对象来描述dom对象

why?

手动操作DOM麻烦 -> jQuery来简化DOM操作 -> MVVM框架进一步封装DOM操作 解决UI & 状态的同步

MVVM可以通过模版引擎和虚拟DOM实现

模版引擎可以完成DOM的替换工作，但不能跟踪状态变化，也不够高效

虚拟DOM可以跟踪状态，通过算法优化DOM操作流程

总的来看，**复杂视图**下虚拟DOM可以更好的管理状态和提高渲染性能



抽象来看 虚拟DOM是对数据的抽象，视图的重要来源就是数据，虚拟DOM不是说只能在web平台使用，这是一种对象抽象方法

web只是个平台，通过对数据的抽象，可以完成web，小程序，ssr，原生应用等各个平台的UI渲染



开源实现

[virtual-dom](https://github.com/Matt-Esch/virtual-dom)

[snabbdom](https://github.com/snabbdom/snabbdom)

> Virtual DOM is awesome. It allows us to express our application's view as a function of its state. But existing solutions were way way too bloated, too slow, lacked features, had an API biased towards OOP and/or lacked features I needed.
>
> Snabbdom consists of an extremely simple, performant and extensible core that is only ≈ 200 SLOC. It offers a modular architecture with rich functionality for extensions through custom modules. To keep the core simple, all non-essential functionality is delegated to modules.
>
> You can mold Snabbdom into whatever you desire! Pick, choose and customize the functionality you want. Alternatively you can just use the default extensions and get a virtual DOM library with high performance, small size and all the features listed below.

