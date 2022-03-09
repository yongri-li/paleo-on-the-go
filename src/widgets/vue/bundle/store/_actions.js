import {
  ADD_PRODUCT_TO_CART,
  REDUCE_PRODUCT_TO_CART,
  REMOVE_PRODUCT_TO_CART
} from './_mutations-type'

export default {
  addToCart({ commit }, product) {
    commit( ADD_PRODUCT_TO_CART, { product } )
  },
  reduceToCart({ commit, getters }, product) {
    commit( REDUCE_PRODUCT_TO_CART, { product } )

    const productFound = getters.getItemFromCartByID(product.id)
    if (productFound.quantity === 0) {
      commit( REMOVE_PRODUCT_TO_CART, { product } )
    }
  }
}