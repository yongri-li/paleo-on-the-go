import {
  ADD_PRODUCT_TO_CART,
  ADD_PRODUCT_TO_CART_WITH_QT,
  ADD_PRODUCTS_TO_CART_FROM_PORTAL,
  REDUCE_PRODUCT_TO_CART,
  REMOVE_PRODUCT_TO_CART,
  CLEAN_ALL_CART,
  CLEAN_ITEMS
} from './_mutations-type'

export default {
  [ADD_PRODUCT_TO_CART](state, { product, where, varInfo, quantity = 1 }) {
    console.log(where, varInfo)
    const indexFound = state.cart[where].findIndex(item => item.id === product.id)
    const varIndex = varInfo ? state.cart[where].findIndex(itm => itm.varId === varInfo.varId) : -1
    if (varIndex > -1) {
      state.cart[where][varIndex].quantity += quantity
    } else if (indexFound > -1 && !varInfo) {
      state.cart[where][indexFound].quantity += quantity
    } else {
      state.cart[where].push({
        quantity,
        ...product,
        ...varInfo
      })
    }
  },
  [ADD_PRODUCT_TO_CART_WITH_QT](state, { product, where, quantity }) {
    const indexFound = state.cart[where].findIndex(item => item.id === product.id)
    if (indexFound > -1) {
      state.cart[where][indexFound].quantity += quantity
    } else {
      state.cart[where].push({
        quantity,
        ...product
      })
    }
  },
  [ADD_PRODUCTS_TO_CART_FROM_PORTAL](state, { products, where }) {
    state.cart[where] = [...products]
  },
  [REDUCE_PRODUCT_TO_CART](state, { idProduct, where }) {
    const indexFound = state.cart[where].findIndex(item => item.id === idProduct)
    if (indexFound > -1) {
      state.cart[where][indexFound].quantity--
    }
  },
  [REMOVE_PRODUCT_TO_CART](state, { idProduct, where }) {
    const indexFound = state.cart[where].findIndex(item => item.id === idProduct)
    state.cart[where].splice(indexFound, 1)
  },
  [CLEAN_ALL_CART](state) {
    state.cart = {
      items: [],
      addons: [],
      general: []
    }
  },
  [CLEAN_ITEMS](state) {
    state.cart.items = []
  },
  SET_ROUTE_PRODUCT(state, product) {
    console.log(product)
    state.currentRouteProduct = { ...product }
  },
  SET_ROUTE_VARIANT(state, variant) {
    state.currentRouteVariant = { ...variant }
  }
}
