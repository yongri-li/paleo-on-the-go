import { _arrayMergeByKeys } from '@shared/scripts'

import {
  ADD_BOX_TO_CART,
  SET_SIZE_SELECTED,
  CLEAR_BOX
} from './_mutations-type'

export default {
  [ADD_BOX_TO_CART] (state, { items }) {
    state.cartItems.box = [...items]
  },
  [SET_SIZE_SELECTED] (state, { sizeSelected }) {
    state.sizeSelected = sizeSelected
  },
  [CLEAR_BOX] (state) {
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
  }
}