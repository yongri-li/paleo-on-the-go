import {
  ADD_BOX_TO_CART,
  SET_SIZE_SELECTED
} from './_mutations-type'

export default {
  [ADD_BOX_TO_CART] (state, { items }) {
    state.cartItems.box = [...items]
  },
  [SET_SIZE_SELECTED] (state, { sizeSelected }) {
    state.sizeSelected = sizeSelected
  }
}