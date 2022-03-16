import {
  ADD_PRODUCT_TO_CART,
  REDUCE_PRODUCT_TO_CART,
  REMOVE_PRODUCT_TO_CART
} from './_mutations-type'

export default {
  addToCart({ commit, getters }, {idCollection, idProduct}) {
    const productFound = getters.getProductFromCollectionsByIDs({idCollection,idProduct})
    commit( ADD_PRODUCT_TO_CART, { product: productFound } )
  },
  reduceToCart({ commit, getters }, idProduct) {
    commit( REDUCE_PRODUCT_TO_CART, { idProduct } )

    const productAfterReduce = getters.getItemFromCartByID(idProduct)
    if (productAfterReduce.quantity === 0) {
      commit( REMOVE_PRODUCT_TO_CART, { idProduct } )
    }
  }
}