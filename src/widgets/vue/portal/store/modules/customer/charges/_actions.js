import { apiService } from '@shared/services'

export default {
  async customerUpdateChargesDate({ commit }, payload) {
    try {
      const { addressId, updates } = payload
      // const apiClient = new apiService()

      // for testing only
      let apiClient = new apiService()
      const allCookiez = await document.cookie
      const apiAccessToken = await allCookiez
        .split('; ')
        .find(row => row.includes('ss_access_token'))
        ?.split('=')[1]
      apiClient.headers['X-Api-Access-Token'] = apiAccessToken
      // for testing only end

      const { data } = await apiClient.put(`/v1/customer/charges/date`, { data: { addressId, updates } })
      const { charges, onetimes, subscriptions, error } = data
      const success = true
      // const teststate = state.resources.charges
      console.log(data, 'data from charge changeteststate')
      if (charges) await commit('CUSTOMER_UPDATE_CHARGES', { charges, keys: ['id', 'addressId'] })
      if (onetimes) await commit('CUSTOMER_UPDATE_ONETIMES', { onetimes })
      if (subscriptions) await commit('CUSTOMER_UPDATE_SUBSCRIPTIONS', { subscriptions })
      return { charges, onetimes, subscriptions, error, success }
    } catch {
      return { error: 'ACTION_ERROR' }
    }
  },
  // async customerExpediateCharges({ commit }, payload) {
  //   try {
  //     const { addressId, updates } = payload
  //     const apiClient = new apiService()
  //     const { data } = await apiClient.post(`/v1/customer/charges/process`, {
  //       data: { addressId: addressId, charges: updates }
  //     })
  //     const { charges, onetimes, subscriptions, error } = data
  //     if (charges) await commit('CUSTOMER_UPDATE_CHARGES', { charges, keys: ['id', 'addressId'] })
  //     if (onetimes) await commit('CUSTOMER_UPDATE_ONETIMES', { onetimes })
  //     if (subscriptions) await commit('CUSTOMER_UPDATE_SUBSCRIPTIONS', { subscriptions })
  //     return { charges, onetimes, subscriptions, error }
  //   } catch {
  //     return { error: 'ACTION_ERROR' }
  //   }
  // },
  async customerChargesSkip({ commit }, payload) {
    console.log('customer charges skipsss')
    try {
      const { addressId, updates } = payload

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

      // const apiClient = new apiService()
      const { data } = await apiClient.post(`/v1/customer/charges/skip`, { data: { addressId, updates } })

      console.log('data', data)
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
    console.log('unskiiiippped2!')
    try {
      const { addressId, updates } = payload

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

      // const apiClient = new apiService()
      const { data } = await apiClient.post(`/v1/customer/charges/unskip`, { data: { addressId, updates } })
      if (charges) await commit('CUSTOMER_UPDATE_CHARGES', { charges, keys: ['id', 'addressId'] })
      if (onetiems) await commit('CUSTOMER_UPDATE_ONETIMES', { onetimes })
      if (subscriptions) await commit('CUSTOMER_UPDATE_SUBSCRIPTIONS', { subscriptions })
      return { charges, onetimes, subscriptions, error }
    } catch {
      return { error: 'ACTION_ERROR' }
    }
  }

  // Future Skips..
  // async setNewCharge({ commit }, payload) {
  //   const { charges } = payload
  //   commit('SET_NEW_CHARGES', { charges, keys: ['id', 'addressId'] })
  // },
}
