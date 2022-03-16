import {
  ADD_PRODUCT_TO_CART,
  REDUCE_PRODUCT_TO_CART,
  REMOVE_PRODUCT_TO_CART,
  CHANGE_SIZE_SELECTED
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
  [REDUCE_PRODUCT_TO_CART] (state, { idProduct }) {
    const indexFound = state.cart.items.findIndex(item => item.id === idProduct)
    if(indexFound > -1) {
      state.cart.items[indexFound].quantity--
    }
  },
  [REMOVE_PRODUCT_TO_CART] (state, { idProduct }) {
    const indexFound = state.cart.items.findIndex(item => item.id === idProduct)
    state.cart.items.splice(indexFound, 1)
  },
  [CHANGE_SIZE_SELECTED] (state, { val }) {
    // change current size
    const indexCurrentSize = state.sizes.findIndex(size => size.selected)
    state.sizes[indexCurrentSize].selected = false
    // active the correct size
    const indexCorrectSize = state.sizes.findIndex(size => size.val === val)
    state.sizes[indexCorrectSize].selected = true
  }
}