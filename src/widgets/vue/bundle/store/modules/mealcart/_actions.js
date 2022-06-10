import { changeRouter } from '../../../utils'
import store from '../../index'

import { CHANGE_SIZE_SELECTED } from './_mutations-type'

import { MODAL_CLOSE, MODAL_SETUP } from '../modals/_mutations-type'

import { ADD_PRODUCT_TO_CART, CLEAN_ALL_CART } from '@shared/store/modules/babcart/_mutations-type'

export default {
  setSizeFromRoute({ commit }, { val }) {
    commit(CHANGE_SIZE_SELECTED, { val })
    store.commit(`babcart/${CLEAN_ALL_CART}`)
  },
  validateChangeSizeSelected({ state, getters, dispatch }, newVal) {
    const { length, orderType } = getters.getLengthAndTypeCart
    const newValType = newVal === 'onetime' ? 'onetime' : 'subscription'

    if (length > 0 && orderType !== newValType) {
      store.commit(`modals/${MODAL_SETUP}`, {
        component: 'ModalConfirmBoxSizes',
        settings: {
          params: { newVal }
        },
        content: {
          ...state.modal[newValType]
        }
      })
    } else {
      dispatch('changeSizeSelected', newVal)
    }
  },
  changeSizeSelected({ commit, getters }, newVal) {
    commit(CHANGE_SIZE_SELECTED, { val: newVal })
    const sizeSelected = getters.getSizeSelected
    const changed = changeRouter(sizeSelected.order_type)
    if (changed) {
      store.commit(`babcart/${CLEAN_ALL_CART}`)
    }

    store.commit(`modals/${MODAL_CLOSE}`)
  },
  validateSetPrebuilt({ getters, dispatch }, listProduct) {
    const { length } = getters.getLengthAndTypeCart
    if (length > 0) {
      store.commit(`modals/${MODAL_SETUP}`, {
        component: 'ModalConfirmPreBuilt',
        settings: {
          params: { listProduct }
        }
      })
    } else {
      dispatch('setPrebuiltBoxToCart', listProduct)
    }
  },
  checkBundleProducts({ rootGetters }, listProduct) {
    let products = []
    listProduct.forEach(product => {
      const [id, qt] = product.split('x')
      const productFound = rootGetters['products/getFirstProductFromCollectionsByID'](id)
      products.push(productFound)
      return productFound
    })
    return products
  },
  setPrebuiltBoxToCart({ rootGetters }, listProduct) {
    store.commit(`babcart/${CLEAN_ALL_CART}`)

    listProduct.forEach(product => {
      const [id, qt] = product.split('x')
      const productFound = rootGetters['products/getFirstProductFromCollectionsByID'](id)
      if (productFound) {
        store.commit(`babcart/${ADD_PRODUCT_TO_CART}`, {
          product: productFound,
          where: 'items',
          quantity: parseInt(qt)
        })
      }
    })

    store.commit(`modals/${MODAL_CLOSE}`)
  }
}
