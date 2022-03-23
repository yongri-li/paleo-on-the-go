import { apiService } from '@shared/services'

export default {
  async customerUpdateSubscriptions({ commit }, payload) {
    // for testing only
    let apiClient = new apiService()
    const allCookiez = await document.cookie
    const apiAccessToken = await allCookiez
      .split('; ')
      .find(row => row.includes('ss_access_token'))
      ?.split('=')[1]
    apiClient.headers['X-Api-Access-Token'] = apiAccessToken
    // for testing only end

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
  }
}
