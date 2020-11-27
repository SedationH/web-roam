export default {
  name: "RouterView",
  render(h) {
    // this.$router
    // this.$route

    // /music/pop
    let depth = 0;
    this.routerView = true;
    let parent = this.$parent;
    while (parent) {
      if (parent.routerView) {
        depth++;
      }
      parent = parent.$parent;
    }

    const record = this.$route.matched[depth];

    if (record) {
      return h(record.component);
    }

    return h();
  }
};
