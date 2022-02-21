import { apiService } from '@shared/services'

export default {
  async customerUpdateChargesDate({ commit }, payload) {
    try {
      const { addressId, updates } = payload
      const apiClient = new apiService()
      const { data } = await apiClient.put(`/v1/customer/charges/date`, { data: { addressId, updates } })
      const { charges, onetimes, subscriptions, error } = data
      if (charges) await commit('CUSTOMER_UPDATE_CHARGES', { charges, keys: ['id', 'addressId'] })
      if (onetimes) await commit('CUSTOMER_UPDATE_ONETIMES', { onetimes })
      if (subscriptions) await commit('CUSTOMER_UPDATE_SUBSCRIPTIONS', { subscriptions })
      return { charges, onetimes, subscriptions, error }
    } catch {
      return { error: 'ACTION_ERROR' }
    }
  },
  async customerExpediateCharges({ commit }, payload) {
    try {
      const { addressId, updates } = payload
      const apiClient = new apiService()
      const { data } = await apiClient.post(`/v1/customer/charges/process`, {
        data: { addressId: addressId, charges: updates }
      })
      const { charges, onetimes, subscriptions, error } = data
      if (charges) await commit('CUSTOMER_UPDATE_CHARGES', { charges, keys: ['id', 'addressId'] })
      if (onetimes) await commit('CUSTOMER_UPDATE_ONETIMES', { onetimes })
      if (subscriptions) await commit('CUSTOMER_UPDATE_SUBSCRIPTIONS', { subscriptions })
      return { charges, onetimes, subscriptions, error }
    } catch {
      return { error: 'ACTION_ERROR' }
    }
  },
  async customerChargesSkip({ commit }, payload) {
    console.log('customer charges skipsss')
    try {
      const { addressId, updates } = payload
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
    console.log('unskiiiippped!')
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
  },

  // Future Skips..
  async setNewCharge({ commit }, payload) {
    const { charges } = payload
    commit('SET_NEW_CHARGES', { charges, keys: ['id', 'addressId'] })
  },
  async customerGetSkips({ commit }, payload) {
    try {
      const appRequest = await fetch(`https://fmp-app-production.herokuapp.com/skips`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-fmp-key': window.Scoutside.api.fmp_app_key,
          'x-fmp-customer': window.Scoutside.api.customer_email_hash
        },
        body: JSON.stringify({
          address_id: payload.address_id
        })
      })
      const appResponse = await appRequest.json()
      commit('PRODUCTS_SET_FUTURE_SKIPS', appResponse)
      if (appResponse) return true
    } catch {
      return false
    }
  },
  async customerFutureSkip({ commit }, payload) {
    const appRequest = await fetch(`https://fmp-app-production.herokuapp.com/skips/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-fmp-key': window.Scoutside.api.fmp_app_key,
        'x-fmp-customer': window.Scoutside.api.customer_email_hash
      },
      body: JSON.stringify({
        address_id: payload.address_id,
        date: payload.date
      })
    })
    // const appResponse = await appRequest.json();
    return appRequest
  },
  async customerFutureUnSkip({ commit }, payload) {
    const appRequest = await fetch(`https://fmp-app-production.herokuapp.com/skips/delete`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'x-fmp-key': window.Scoutside.api.fmp_app_key,
        'x-fmp-customer': window.Scoutside.api.customer_email_hash
      },
      body: JSON.stringify({
        address_id: payload.address_id,
        date: payload.date
      })
    })
    return appRequest
  }
}
