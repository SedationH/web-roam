提几个点

## CDD(Component-driven Development)

- 自下而上

- 从组件级别开始,到页面级别结束



## Vue为组件之间的交互提供了哪些？

- $root
- $parent / $children
- $refs
- 依赖注入 provide / inject
- $attrs
- $listerners



## 使用vue serve 可快速进行原型开发



## 项目组织方式

Multirepo(Multiple Repository)
每一个包对应一个项目

Monorepo(Monolithic Repository)
一个个项目仓库中管理多个模块/包



组件开发利器 [Storybook](https://storybook.js.org/docs/guides/guide-vue/)



## yarn workspaces 

解决使用monorepo目录组织模式开发组件的时候，依赖重复安装的问题

开启

```sjon
{
	"private": true,
	"workspaces": [
		"./packages/*"
	]
}
```



公共安装

```
yarn add jest -D -W
```

指定工作区安装 和 package.json 中的name有关

```js
yarn workspace name add xxx
```