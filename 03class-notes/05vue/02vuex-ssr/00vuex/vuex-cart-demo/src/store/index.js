import Vue from 'vue'
import Vuex from 'vuex'

import cart from './modules/cart'
import products from './modules/products'

Vue.use(Vuex)

const localSave = store => {
  store.subscribe((mutation, state) => {
    if (mutation.type.startsWith('cart/')) {
      window.localStorage.setItem(
        'cart-products',
        JSON.stringify(state.cart.cartProducts)
      )
    }
  })
}

export default new Vuex.Store({
  state: {},
  mutations: {},
  actions: {},
  modules: {
    cart,
    products
  },
  plugins: [localSave]
})
