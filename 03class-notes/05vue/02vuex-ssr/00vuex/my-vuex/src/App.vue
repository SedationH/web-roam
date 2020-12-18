<template>
  <div id="app">
    <h1>Vuex - Demo</h1>
    count：{{ $store.state.count }} <br />
    msg: {{ $store.state.msg }}

    <h2>Getter</h2>
    reverseMsg: {{ $store.getters.reverseMsg }}

    <h2>Mutation</h2>
    <button @click="$store.commit('increate', 2)">
      Mutation
    </button>

    <h2>Action</h2>
    <button @click="$store.dispatch('increateAsync', 5)">
      Action
    </button>
  </div>
</template>

<style>
body {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
