import { _arrayMergeByKeys } from '@shared/scripts'

export default {
  CUSTOMER_UPDATE_CHARGES(state, payload) {
    const prevCharges = [ ...state.resources.charges ]
    const { charges, keys } = payload
    const filteredCharges = _arrayMergeByKeys({ 
      prevArray: prevCharges, newArray: charges, keys 
    })
    state.resources.charges = [ ...filteredCharges, ...charges ]  
  },
  PRODUCTS_SET_FUTURE_SKIPS(state, futureSkips) {
    state.futureSkips = futureSkips;
  },
  // SET_STATUS_TO_SKIPPED(state, deliverydate) {
  //   state.resources.charges.slice(-2, -1)[0].status = "SKIPPED"
  //   console.log('stattusSk,', state.resources.charges.slice(-2, -1)[0].status)
  // },
  SET_NEW_CHARGES(state, payload) {
    const prevCharges = [ ...state.resources.charges ]
    const { charges, keys } = payload
    const filteredCharges = _arrayMergeByKeys({ 
      prevArray: prevCharges, newArray: charges, keys 
    })
    state.resources.charges = [ ...filteredCharges, ...charges ]
  }
}