import { _arrayMergeByKeys } from '@shared/scripts'

export default {
  CUSTOMER_UPDATE_SUBSCRIPTIONS(state, payload) {
    const prevSubscriptions = [ ...state.resources.subscriptions ]
    const { subscriptions, keys } = payload
    const filteredSubscriptions = _arrayMergeByKeys({ 
      prevArray: prevSubscriptions, newArray: subscriptions, keys 
    })
    state.resources.subscriptions = [ ...filteredSubscriptions, ...subscriptions ]
  }
}