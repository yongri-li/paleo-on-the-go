import {
  CLEAN_ALL_CART
} from './_mutations-type'

export default {
  [CLEAN_ALL_CART] (state) {
    state.cart = {
      box: [],
      addons: [],
      pdp: []
    }
  },
}