import { apiService } from '@shared/services'

export default {
  async customerUpdateChargesDate({ commit }, payload) {
    try {
      const apiClient = new apiService()
      const { addressId, updates } = payload
      const { data } = await apiClient.put(`/v1/customer/charges/date`, { data: { addressId, updates } })
      const { charges, onetimes, subscriptions, error } = data
      const success = true
      if (charges) await commit('CUSTOMER_UPDATE_CHARGES', { charges, keys: ['id', 'addressId'] })
      if (onetimes) await commit('CUSTOMER_UPDATE_ONETIMES', { onetimes })
      if (subscriptions) await commit('CUSTOMER_UPDATE_SUBSCRIPTIONS', { subscriptions })
      return { charges, onetimes, subscriptions, error, success }
    } catch {
      return { error: 'ACTION_ERROR' }
    }
  },
  async customerChargesSkip({ commit }, payload) {
    try {
      const apiClient = new apiService()
      const { data } = await apiClient.post(`/v1/customer/charges/skip`, { data: { addressId, updates } })
      const { charges, onetimes, subscriptions, error } = data
      if (charges) await commit('CUSTOMER_UPDATE_CHARGES', { charges, keys: ['id', 'addressId'] })
      if (onetiems) await commit('CUSTOMER_UPDATE_ONETIMES', { onetimes })
      if (subscriptions) await commit('CUSTOMER_UPDATE_SUBSCRIPTIONS', { subscriptions })
      return { charges, onetimes, subscriptions, error }
    } catch {
      return { error: 'ACTION_ERROR' }
    }
  },
  async customerChargesUnskip({ commit }, payload) {
    try {
      const { addressId, updates } = payload
      const apiClient = new apiService()
      const { data } = await apiClient.post(`/v1/customer/charges/unskip`, { data: { addressId, updates } })
      if (charges) await commit('CUSTOMER_UPDATE_CHARGES', { charges, keys: ['id', 'addressId'] })
      if (onetiems) await commit('CUSTOMER_UPDATE_ONETIMES', { onetimes })
      if (subscriptions) await commit('CUSTOMER_UPDATE_SUBSCRIPTIONS', { subscriptions })
      return { charges, onetimes, subscriptions, error }
    } catch {
      return { error: 'ACTION_ERROR' }
    }
  }
}
