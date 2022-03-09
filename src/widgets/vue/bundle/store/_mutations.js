import {
  ADD_PRODUCT_TO_CART,
  REDUCE_PRODUCT_TO_CART,
  REMOVE_PRODUCT_TO_CART
} from './_mutations-type'

export default {
  [ADD_PRODUCT_TO_CART] (state, { product }) {
    const indexFound = state.cart.items.findIndex(item => item.id === product.id)
    if(indexFound > -1) {
      state.cart.items[indexFound].quantity++
    }
    else {
      state.cart.items.push({
        quantity: 1,
        ...product
      })
    }
  },
  [REDUCE_PRODUCT_TO_CART] (state, { product }) {
    const indexFound = state.cart.items.findIndex(item => item.id === product.id)
    if(indexFound > -1) {
      state.cart.items[indexFound].quantity--
    }
  },
  [REMOVE_PRODUCT_TO_CART] (state, { product }) {
    const indexFound = state.cart.items.findIndex(item => item.id === product.id)
    state.cart.items.splice(indexFound, 1)
  }
}