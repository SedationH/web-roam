import Vue from 'vue'
import App from './App.vue'

// If we use a shared instance across multiple requests,
// it will easily lead to cross-request state pollution.
export function createApp() {
  const app = new Vue({
    render: h => h(App),
  })
  return { app }
}
