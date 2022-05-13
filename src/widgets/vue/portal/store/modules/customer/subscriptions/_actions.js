import { apiService } from '@shared/services'

export default {
  async customerUpdateSubscriptions({ commit }, payload) {
    const apiClient = new apiService()
    const { addressId, dontCommit, updates } = payload
    console.log('payloadpayload', payload)
    const { data } = await apiClient.put('/v1/customer/subscriptions', {
      data: { addressId, updates }
    })
    const { charges, subscriptions, error } = data
    if (charges && !dontCommit)
      await commit('CUSTOMER_UPDATE_CHARGES', { charges, keys: ['id', 'addressId'] })
    if (subscriptions) await commit('CUSTOMER_UPDATE_SUBSCRIPTIONS', { subscriptions })
    return { subscriptions, charges, error }
  },
  async customerCreateSubscriptions({ commit }, payload) {
    const apiClient = new apiService()
    const { addressId, creates } = payload
    console.log(payload)
    const { data } = await apiClient.post('/v1/customer/subscriptions', {
      data: { addressId, creates }
    })
    const { charges, subscriptions, error } = data
    return { subscriptions, error }
  }
}
