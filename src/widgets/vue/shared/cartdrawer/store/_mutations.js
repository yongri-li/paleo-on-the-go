import { _arrayMergeByKeys } from '@shared/scripts'

import {
  ADD_PRODUCT_TO_CART,
  ADD_PRODUCTS_TO_CART,
  ADD_BOX_TO_CART,
  SET_SIZE_SELECTED,
  CLEAR_BOX,
  CLEAN_CART_ITEMS,
  CLEAN_ALL_CART,
  CREATE_ROUTE_PROTECTION_PRODUCT,
  REMOVE_ROUTE_PROTECTION_TO_CART,
  ADD_ROUTE_PROTECTION_TO_CART
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
  [ADD_BOX_TO_CART](state, { items }) {
    state.cartItems.box = [...items]
  },
  [SET_SIZE_SELECTED](state, { sizeSelected }) {
    state.sizeSelected = sizeSelected
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
  [CLEAR_BOX](state) {
    state.cartItems.box = []
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
  },
  [CREATE_ROUTE_PROTECTION_PRODUCT](state, { routeProduct }) {
    state.routeProduct = {
      ...routeProduct
    }
  },
  [REMOVE_ROUTE_PROTECTION_TO_CART](state) {
    const indexFound = state.cartItems.general.findIndex(item => item.route_protection)
    if (indexFound > -1) {
      state.cartItems.general.splice(indexFound, 1)
    }
  },
  [ADD_ROUTE_PROTECTION_TO_CART](state, { routeProduct }) {
    state.cartItems.general.push({
      ...routeProduct
    })
  }
}
