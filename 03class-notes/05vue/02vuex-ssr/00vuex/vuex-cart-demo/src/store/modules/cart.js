export default {
  namespaced: true,
  state: {
    cartProducts:
      JSON.parse(
        window.localStorage.getItem('cart-products')
      ) || []
  },
  getters: {
    totalCount: state =>
      state.cartProducts.reduce(
        (count, product) => count + product.count,
        0
      ),
    totalPrice: state =>
      state.cartProducts
        .reduce(
          (count, product) => count + product.totalPrice,
          0
        )
        .toFixed(2),
    checkedCount: state =>
      state.cartProducts.reduce(
        (sum, product) =>
          product.isChecked ? (sum += product.count) : sum,
        0
      ),
    checkedPrice: state =>
      state.cartProducts
        .reduce(
          (sum, product) =>
            product.isChecked
              ? (sum += product.totalPrice)
              : sum,
          0
        )
        .toFixed(2)
  },
  mutations: {
    addToCart(state, product) {
      const prod = state.cartProducts.find(
        item => item.id === product.id
      )
      if (prod) {
        prod.count++
        prod.isChecked = true
        prod.totalPrice = prod.count * prod.price
      } else {
        state.cartProducts.push({
          ...product,
          count: 1,
          isChecked: true,
          totalPrice: product.price
        })
      }
    },
    deleteFromCart(state, productId) {
      const index = state.cartProducts.find(
        item => item.id === productId
      )
      index !== -1 && state.cartProducts.splice(index, 1)
    },
    updateAllProductsChecked(state, checked) {
      state.cartProducts.forEach(
        product => (product.isChecked = checked)
      )
    },
    updateProductChecked(state, { checked, productId }) {
      const prod = state.cartProducts.find(
        prod => prod.id === productId
      )
      prod && (prod.isChecked = checked)
    },
    updateProduct(state, { productId, count }) {
      const product = state.cartProducts.find(
        product => product.id === productId
      )
      if (product) {
        product.count = count
        product.totalPrice = count * product.price
      }
    }
  },
  actions: {}
}
