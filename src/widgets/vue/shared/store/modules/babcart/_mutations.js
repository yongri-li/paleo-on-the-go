import {
  ADD_PRODUCT_TO_CART,
  ADD_PRODUCT_TO_CART_WITH_QT,
  ADD_PRODUCTS_TO_CART_FROM_PORTAL,
  REDUCE_PRODUCT_TO_CART,
  REMOVE_PRODUCT_TO_CART,
  CLEAN_ALL_CART
} from './_mutations-type'

export default {
  [ADD_PRODUCT_TO_CART] (state, { product, where, quantity = 1 }) {
    const indexFound = state.cart[where].findIndex(item => item.id === product.id)
    if(indexFound > -1) {
      state.cart[where][indexFound].quantity += quantity
    }
    else {
      state.cart[where].push({
        quantity,
        ...product
      })
    }
  },
  [ADD_PRODUCT_TO_CART_WITH_QT] (state, { product, where, quantity }) {
    const indexFound = state.cart[where].findIndex(item => item.id === product.id)
    if(indexFound > -1) {
      state.cart[where][indexFound].quantity += quantity
    }
    else {
      state.cart[where].push({
        quantity,
        ...product
      })
    }
  },
  [ADD_PRODUCTS_TO_CART_FROM_PORTAL] (state, { products, where }) {
    state.cart[where] = [...products]
  },
  [REDUCE_PRODUCT_TO_CART] (state, { idProduct, where }) {
    const indexFound = state.cart[where].findIndex(item => item.id === idProduct)
    if(indexFound > -1) {
      state.cart[where][indexFound].quantity--
    }
  },
  [REMOVE_PRODUCT_TO_CART] (state, { idProduct, where }) {
    const indexFound = state.cart[where].findIndex(item => item.id === idProduct)
    state.cart[where].splice(indexFound, 1)
  },
  [CLEAN_ALL_CART] (state) {
    state.cart = {
      items: [],
      addons: []
    }
  }
}