import {
  ADD_PRODUCT_TO_CART,
  REDUCE_PRODUCT_TO_CART,
  REMOVE_PRODUCT_TO_CART,
  CHANGE_SIZE_SELECTED,
  CLEAN_ALL_CART
} from './_mutations-type'

import {
  MODAL_CLOSE,
  MODAL_SETUP
} from '../modals/_mutations-type'

import { changeRouter } from '../../../utils'
import store from '../../index'

export default {
  addToCart({ commit, rootGetters }, {idCollection, idProduct, where}) {
    const productFound = rootGetters['products/getProductFromCollectionsByIDs']({idCollection,idProduct})
    commit( ADD_PRODUCT_TO_CART, { product: productFound, where } )
  },
  reduceToCart({ commit, getters }, {idProduct, where}) {
    commit( REDUCE_PRODUCT_TO_CART, { idProduct, where } )

    const productAfterReduce = getters.getProductFromCartByID({ id: idProduct, where })
    if (productAfterReduce.quantity === 0) {
      commit( REMOVE_PRODUCT_TO_CART, { idProduct, where } )
    }
  },
  setSizeFromRoute({ commit }, { val }) {
    commit( CHANGE_SIZE_SELECTED, { val } )
    commit( CLEAN_ALL_CART )
  },
  validateChangeSizeSelected({ getters, dispatch }, newVal) {
    const { length, orderType } = getters.getLengthAndTypeCart
    const newValType = newVal === 'onetime' ? 'onetime' : 'subscription'

    if(length > 0 && orderType !== newValType) {
      store.commit( `modals/${MODAL_SETUP}`, {
        component: 'ModalConfirmBoxSizes',
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
      commit( CLEAN_ALL_CART )
    }

    store.commit( `modals/${MODAL_CLOSE}` )
  },
  validateSetPrebuilt({ getters, dispatch }, listProduct) {
    const { length } = getters.getLengthAndTypeCart
    if(length > 0) {
      store.commit( `modals/${MODAL_SETUP}`, {
        component: 'ModalConfirmPreBuilt',
        settings: {
          params: { listProduct }
        }
      })
    }
    else {
      dispatch('setPrebuiltBoxToCart', listProduct)
    }
  },
  setPrebuiltBoxToCart({ commit, rootGetters }, listProduct) {
    commit(CLEAN_ALL_CART)

    listProduct.forEach(product => {
      const [id, qt] = product.split('x')
      const productFound = rootGetters['products/getFirstProductFromCollectionsByID'](id)
      console.log('productFound',productFound)
      if(productFound) {
        commit( ADD_PRODUCT_TO_CART, {
          product: productFound,
          where: 'items',
          quantity: parseInt(qt)
        })
      }
    })

    store.commit( `modals/${MODAL_CLOSE}` )
  }
}