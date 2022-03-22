import {
  ADD_PRODUCT_TO_CART,
  REDUCE_PRODUCT_TO_CART,
  REMOVE_PRODUCT_TO_CART,
  CHANGE_SIZE_SELECTED,
  CLEAN_CART_ITEMS,
  ADD_PRODUCT_TO_CART_WITH_QT,
  MODAL_CLOSE,
  MODAL_SETUP
} from './_mutations-type'

export default {
  [ADD_PRODUCT_TO_CART] (state, { product, where }) {
    const indexFound = state.cart[where].findIndex(item => item.id === product.id)
    if(indexFound > -1) {
      state.cart[where][indexFound].quantity++
    }
    else {
      state.cart[where].push({
        quantity: 1,
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
  [CHANGE_SIZE_SELECTED] (state, { val }) {
    // change current size
    const indexCurrentSize = state.sizes.findIndex(size => size.selected)
    state.sizes[indexCurrentSize].selected = false
    // active the correct size
    const indexCorrectSize = state.sizes.findIndex(size => size.val === val)
    state.sizes[indexCorrectSize].selected = true
  },
  [CLEAN_CART_ITEMS] (state) {
    state.cart.items = []
  },
  [MODAL_CLOSE] (state) {
    state.modal.settings.open = false
  },
  [MODAL_SETUP] (state, { component, settings }) {
    state.modal.component = require(`../components/Modals/${component}.vue`).default
    state.modal.settings = {
      open: true,
      ...settings
    }
  }
}