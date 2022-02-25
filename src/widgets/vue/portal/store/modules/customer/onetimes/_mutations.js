import { _arrayMergeByKeys } from '@shared/scripts'

export default {
  CUSTOMER_UPDATE_ONETIMES(state, payload) {
    const prevOnetimes = [ ...state.resources.onetimes ]
    const { onetimes, keys } = payload
    const filteredOnetimes = _arrayMergeByKeys({ 
      prevArray: prevOnetimes, newArray: onetimes, keys 
    })
    state.resources.onetimes = [ ...filteredOnetimes, ...onetimes ]
  }
}