import { _arrayMergeByKeys } from '@shared/scripts'

export default {
  CUSTOMER_UPDATE_ADDRESSES(state, payload) {
    const prevAddresses = [...state.resources.addresses]
    const { addresses, keys } = payload
    const filteredAddresses = _arrayMergeByKeys({
      prevArray: prevAddresses,
      newArray: addresses,
      keys
    })
    state.resources.addresses = [...filteredAddresses, ...addresses]
  },
  CUSTOMER_SET_ADDRESS_IDS(state, payload) {
    if (payload) {
      state.addressIds = payload
    }
  }
}
