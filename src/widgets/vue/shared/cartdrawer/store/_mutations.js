import { _arrayMergeByKeys } from '@shared/scripts'
import {
  ADD_PRODUCT_TO_CART,
  ADD_PRODUCTS_TO_CART,
  REDUCE_PRODUCT_TO_CART,
  REMOVE_PRODUCT_TO_CART,
  CHANGE_SIZE_SELECTED,
  CLEAN_CART_ITEMS,
  CLEAN_ALL_CART,
  ADD_PRODUCT_TO_CART_WITH_QT,
  MODAL_CLOSE,
  MODAL_SETUP,
  FILTER_TOGGLE_ACTIVE
} from './_mutations-type'

export default {
  [ADD_PRODUCTS_TO_CART](state, { productsArr, where }) {
    state.cart[where] = productsArr
  },
  [ADD_PRODUCT_TO_CART](state, { product, where }) {
    const indexFound = state.cart[where].findIndex(item => item.id === product.id)
    if (indexFound > -1) {
      state.cart[where][indexFound].quantity++
    } else {
      state.cart[where].push({
        quantity: 1,
        ...product
      })
    }
  },
  [ADD_PRODUCT_TO_CART_WITH_QT](state, { product, where, quantity }) {
    const indexFound = state.cart[where].findIndex(item => item.id === product.id)
    if (indexFound > -1) {
      state.cart[where][indexFound].quantity += quantity
    } else {
      state.cart[where].push({
        quantity,
        ...product
      })
    }
  },
  [REDUCE_PRODUCT_TO_CART](state, { idProduct, where }) {
    const indexFound = state.cart[where].findIndex(item => item.id === idProduct)
    if (indexFound > -1) {
      state.cart[where][indexFound].quantity--
    }
  },
  [REMOVE_PRODUCT_TO_CART](state, { idProduct, where }) {
    const indexFound = state.cart[where].findIndex(item => item.id === idProduct)
    state.cart[where].splice(indexFound, 1)
  },
  [CHANGE_SIZE_SELECTED](state, { val }) {
    // change current size
    const indexCurrentSize = state.sizes.findIndex(size => size.selected)
    state.sizes[indexCurrentSize].selected = false
    // active the correct size
    const indexCorrectSize = state.sizes.findIndex(size => size.val === val)
    state.sizes[indexCorrectSize].selected = true
  },
  [CLEAN_CART_ITEMS](state) {
    state.cart.items = []
  },
  [CLEAN_ALL_CART](state) {
    state.cart = {
      items: [],
      addons: []
    }
  },
  [MODAL_CLOSE](state) {
    state.modal.settings.open = false
  },
  [MODAL_SETUP](state, { component, settings }) {
    state.modal.component = require(`../../../bundle/components/Modals/${component}.vue`).default
    state.modal.settings = {
      open: true,
      ...settings
    }
  },
  [FILTER_TOGGLE_ACTIVE](state, { tag, active }) {
    const indexFound = state.filters.findIndex(filter => filter.tag === tag)
    if (indexFound > -1) {
      state.filters[indexFound].active = active
    }
  },
  CUSTOMER_UPDATE_SUBSCRIPTIONS(state, payload) {
    const prevSubscriptions = [...state.resources.subscriptions]
    const { subscriptions, keys } = payload
    const filteredSubscriptions = _arrayMergeByKeys({
      prevArray: prevSubscriptions,
      newArray: subscriptions,
      keys
    })
    state.resources.subscriptions = [...filteredSubscriptions, ...subscriptions]
  },
  CUSTOMER_UPDATE_CHARGES(state, payload) {
    const prevCharges = [...state.resources.charges]
    const { charges, keys } = payload
    const filteredCharges = _arrayMergeByKeys({
      prevArray: prevCharges,
      newArray: charges,
      keys
    })
    state.resources.charges = [...filteredCharges, ...charges]
  },
  CUSTOMER_UPDATE_ONETIMES(state, payload) {
    const prevOnetimes = [...state.resources.onetimes]
    const { onetimes, keys } = payload
    const filteredOnetimes = _arrayMergeByKeys({
      prevArray: prevOnetimes,
      newArray: onetimes,
      keys
    })
    state.resources.onetimes = [...filteredOnetimes, ...onetimes]
  }
}
