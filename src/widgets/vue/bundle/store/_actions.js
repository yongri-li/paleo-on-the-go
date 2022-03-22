import {
  ADD_PRODUCT_TO_CART,
  REDUCE_PRODUCT_TO_CART,
  REMOVE_PRODUCT_TO_CART,
  CHANGE_SIZE_SELECTED,
  CLEAN_CART_ITEMS,
  ADD_PRODUCT_TO_CART_WITH_QT,
  MODAL_SETUP,
  MODAL_CLOSE
} from './_mutations-type'

import { changeRouter } from '../utils'

export default {
  addToCart({ commit, getters }, {idCollection, idProduct, where}) {
    const productFound = getters.getProductFromCollectionsByIDs({idCollection,idProduct})
    commit( ADD_PRODUCT_TO_CART, { product: productFound, where } )
  },
  reduceToCart({ commit, getters }, {idProduct, where}) {
    commit( REDUCE_PRODUCT_TO_CART, { idProduct, where } )

    const productAfterReduce = getters.getProductFromCartByID({ id: idProduct, where })
    if (productAfterReduce.quantity === 0) {
      commit( REMOVE_PRODUCT_TO_CART, { idProduct, where } )
    }
  },
  validateChangeSizeSelected({ commit, getters, dispatch }, newVal) {
    const { length, orderType } = getters.getLengthAndTypeCart
    const newValType = newVal === 'onetime' ? 'onetime' : 'subscription'

    if(length > 0 && orderType !== newValType) {
      commit( MODAL_SETUP, {
        component: 'ModalConfirm',
        settings: {
          params: { newVal }
        }
      })
    }
    else {
      dispatch('changeSizeSelected', newVal)
    }
  },
  changeSizeSelected({ commit, getters }, newVal) {
    commit( CHANGE_SIZE_SELECTED, { val: newVal } )
    const sizeSelected = getters.getSizeSelected
    const changed = changeRouter(sizeSelected.order_type)
    if(changed) {
      commit( CLEAN_CART_ITEMS )
    }
    commit( MODAL_CLOSE )
  },
  setPrebuiltBoxToCart({ commit, getters }, listProduct) {
    commit(CLEAN_CART_ITEMS)

    listProduct.forEach(product => {
      const [id, qt] = product.split('x')
      const productFound = getters.getFirstProductFromCollectionsByID(id)
      commit( ADD_PRODUCT_TO_CART_WITH_QT, {
        product: productFound,
        where: 'items',
        quantity: parseInt(qt)
      })
    })
  }
}