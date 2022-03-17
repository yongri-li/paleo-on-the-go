import {
  ADD_PRODUCT_TO_CART,
  REDUCE_PRODUCT_TO_CART,
  REMOVE_PRODUCT_TO_CART,
  CHANGE_SIZE_SELECTED,
  CLEAN_CART_ITEMS
} from './_mutations-type'

import { changeRouter } from '../utils'

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
  },
  changeSizeSelected({ commit, getters }, newVal) {
    commit( CHANGE_SIZE_SELECTED, { val: newVal } )
    const sizeSelected = getters.getSizeSelected
    const changed = changeRouter(sizeSelected.order_type)
    if(changed) {
      commit( CLEAN_CART_ITEMS )
    }
  }
}