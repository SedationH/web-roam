import Vue from "vue"
import Vuex from "../vuex"

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    count: 0,
    msg: "Hello World"
  },
  getters: {
    reverseMsg(state) {
      return state.msg
        .split("")
        .reverse()
        .join("")
    }
  },
  mutations: {
    increate(state, payload) {
      state.count += payload
    }
  },
  actions: {
    increateAsync(context, payload) {
      setTimeout(() => {
        context.commit("increate", payload)
      }, 2000)
    }
  }
})
