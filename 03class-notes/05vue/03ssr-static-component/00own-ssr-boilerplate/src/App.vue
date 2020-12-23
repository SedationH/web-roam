<template>
  <div id="app">
    <h1 @click="onClick">{{ message }}</h1>
    <input type="text" v-model="message" />
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      message: '',
    }
  },
  methods: {
    onClick() {
      console.log('Hello World!')
    },
  },
}
</script>

<style></style>
