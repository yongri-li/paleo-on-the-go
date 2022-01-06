import { apiService } from '@shared/services'

export default {
  async customerUpdateSubscriptions({ commit }, payload) {
    const { addressId, updates } = payload
    const { data } = await apiService.put('/customer/subscriptions', { 
      addressId, updates 
    })
    const { charges, subscriptions, error } = data
    if(charges) await commit('CUSTOMER_UPDATE_CHARGES', { charges, keys: ['id', 'addressId'] })
    if(subscriptions) await commit('CUSTOMER_UPDATE_SUBSCRIPTIONS', { subscriptions })
    return { subscriptions, error }
  }
}