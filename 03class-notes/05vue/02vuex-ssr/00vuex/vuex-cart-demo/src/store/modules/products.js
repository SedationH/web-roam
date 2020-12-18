import axios from 'axios'

export default {
  namespaced: true,
  state: {
    products: [{ id: 1, title: 'iPad Pro', price: 500.01 }]
  },
  mutations: {
    setProducts(state, products) {
      state.products = products
    }
  },
  actions: {
    async getAllProducts(context) {
      const { data } = await axios({
        method: 'GET',
        url: 'http://127.0.0.1:3000/products'
      })
      context.commit('setProducts', data)
    }
  }
}
