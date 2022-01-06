import { apiService } from '@shared/services'

export default {
  async customerUpdateOnetimes({ commit }, payload) {
    const { addressId, updates } = payload
    const { data } = await apiService.put('/customer/onetimes', { 
      addressId, updates 
    })
    const { charges, onetimes, error } = data
    if(charges) await commit('CUSTOMER_UPDATE_CHARGES', { charges, keys: ['id', 'addressId'] })
    if(onetimes) await commit('CUSTOMER_UPDATE_ONETIMES', { onetimes })
    return { onetimes, error }
  }
}