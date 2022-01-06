import { apiService } from '@shared/services'

export default {
  async customerUpdateAddressItems({ commit }, payload) {
    const { addressId, updatesOnetimes, updatesSubscriptions } = payload
    const { data } = await apiService.put('/customer/items', { 
      data: { addressId, updatesOnetimes, updatesSubscriptions }
    })
    const { charges, onetimes, subscriptions, error } = data
    if(charges) await commit('CUSTOMER_UPDATE_CHARGES', { charges, keys: ['id', 'addressId'] })
    if(onetimes) await commit('CUSTOMER_UPDATE_ONETIMES', { onetimes })
    if(subscriptions) await commit('CUSTOMER_UPDATE_SUBSCRIPTIONS', { subscriptions })
    return { onetimes, subscriptions, error }
  }
}