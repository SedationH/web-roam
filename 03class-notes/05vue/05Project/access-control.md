资源

![image-20210127184042170](http://picbed.sedationh.cn/image-20210127184042170.png)

菜单

![image-20210127184340221](http://picbed.sedationh.cn/image-20210127184340221.png)



资源是对请求调用的抽象，菜单是对可见页面的抽象

在具体    **账户**   与   **资源和页面**   之间，通过角色进行集中配置

> 当我们讨论到前端应用的权限控制时，不是在讨论如何去控制权限，而是在讨论如何将用户权限反映到页面元素的显隐上。如果用户没有权限访问请求，不仅会造成请求资源的浪费，还会降低用户体验。前端的权限控制就是为了解决这类问题。
>
> RBAC 是目前普遍使用的一种权限模型。本文会讨论如何基于 RBAC 权限模型去实现前端应用的权限控制。
>
> ## **RBAC 简介**
>
> RBAC（Role-Based Access Control）即：基于角色的访问控制。RBAC 认为授权其实就是 who, what, how 三者之间的关系，即 who 对 what 进行 how 操作。简单来说就是某个角色 (who) 对某些资源 (what) 拥有怎样的 (how) 权限。
>
> 在 RBAC 中，用户只和角色关联，而角色对应了一组权限。通过为不同的用户分配不同的角色，从而让不同的用户拥有不同的权限。
>
> 相比于 ACL（Access Control List）直接为用户赋予权限的方式，RBAC 通过角色为用户和权限之间架起了一座桥梁，从而简化了用户和权限之间的关系，让权限配置更易于扩展和维护。
>
> 
>
> 作者：橘子小睿
> 链接：https://zhuanlan.zhihu.com/p/99172614
> 来源：知乎
> 著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。



token 是账户的唯一标示，后端维护着对于这个账户的menuList & Operation Control 

页面级别的控制通过router进行管理，在登录完成后，获取到token，通过token拿到用户可见菜单，通过router.addRoutes进行动态添加



组件和内容级别的用指令来处理吧，这里还要设计好配套的数据结构



此处参考 

> 分析 https://juejin.cn/post/6844903882338861063  
>
> vue-admin 的路由动态添加样例 https://github.com/PanJiaChen/vue-element-admin/blob/master/src/permission.js#L43
>
> ## 这篇文章写的特好 https://mp.weixin.qq.com/s/b-D2eH1mLwL_FkaZwjueSw

