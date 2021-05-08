style scoped是如何实现的

与之相关的::v-deep 的原理呢？



```vue
<style lang="scss" scoped>
::v-deep .v-stepper__step {
  flex: 1;
  background: gray;
  height: 1px;
  padding: 0;
  top: 50%;

  .v-stepper__step__step {
    display: none;
  }
}
</style>
```



![image-20210506172001455](http://picbed.sedationh.cn/image-20210506172001455.png)



注意对于使用scoped的组件，内部~~所有~~的节点都添加了data-v-xxx一个和组件相关联的随机码来标示唯一

如果不使用::v-deep

```vue
<style lang="scss" scoped>
.v-stepper__step {
  flex: 1;
  background: gray;
  height: 1px;
  padding: 0;
  top: 50%;

  .v-stepper__step__step {
    display: none;
  }
}
</style>
```



![image-20210506172403219](http://picbed.sedationh.cn/image-20210506172403219.png)



还需要理解下。