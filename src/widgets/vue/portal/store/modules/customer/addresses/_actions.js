import { apiService } from '@shared/services'
import { mapMutations } from 'vuex'

export default {
  async customerUpdateAddress({ commit }, payload) {
    try {
      const apiClient = new apiService()
      const { updates } = payload
      const { data } = await apiClient.put('/v1/customer/address', { data: { address: updates } }) //data: { address }
      const { address, error } = data
      if (address) {
        console.log('address fired')
        //this.$store.commit('customer/CUSTOMER_UPDATE_ADDRESSES', { addresses: [address] }, { root: true })
        return { success: 'ACTION_SUCCESS' }
      }
      return { address, error }
    } catch {
      return { error: 'ACTION_ERROR' }
    }
  },
  async customerUpdateAddressItems({ commit }, payload) {
    // for testing only
    let apiClient = new apiService()
    const allCookiez = await document.cookie
    const apiAccessToken = await allCookiez
      .split('; ')
      .find(row => row.includes('ss_access_token'))
      ?.split('=')[1]
    apiClient.headers['X-Api-Access-Token'] = apiAccessToken
    console.log('apiClientapiClient', apiAccessToken)
    // for testing only end

    const { addressId, updatesOnetimes, updatesSubscriptions } = payload
    console.log('payload', payload)
    const { data } = await apiClient.put('/v1/customer/items', {
      data: { addressId, updatesOnetimes, updatesSubscriptions }
    })
    const { charges, onetimes, subscriptions, error } = data
    console.log('remove cancel', data)
    if (charges) await commit('CUSTOMER_UPDATE_CHARGES', { charges, keys: ['id', 'addressId'] })
    if (onetimes) await commit('CUSTOMER_UPDATE_ONETIMES', { onetimes })
    if (subscriptions) await commit('CUSTOMER_UPDATE_SUBSCRIPTIONS', { subscriptions })
    return { onetimes, subscriptions, error }
  },
  async customerUpdateAddressDiscount({ commit }, payload) {
    try {
      const { addressId, discountCode } = payload
      let apiClient = new apiService()

      // for testing only
      const allCookiez = await document.cookie
      const apiAccessToken = await allCookiez
        .split('; ')
        .find(row => row.includes('ss_access_token'))
        ?.split('=')[1]
      apiClient.headers['X-Api-Access-Token'] = apiAccessToken
      console.log('apiClientapiClient', apiClient, apiAccessToken)
      // for testing only end

      const { data } = await apiClient.put('/v1/customer/address/discount', {
        data: { addressId, discountCode }
      })
      const { address, charges, error } = data
      if (charges) await commit('CUSTOMER_UPDATE_CHARGES', { charges, keys: ['id', 'addressId'] })
      if (address) {
        commit('CUSTOMER_UPDATE_ADDRESSES', { addresses: [address] })
        return { success: 'ACTION_SUCCESS' }
      }
      return { address, charges, error }
    } catch {
      return { error: 'ACTION_ERROR' }
    }
  }
}
///
