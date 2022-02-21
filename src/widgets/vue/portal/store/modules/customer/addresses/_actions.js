import { apiService } from '@shared/services'

export default {
  async customerUpdateAddress({ commit }, payload) {
    try {
      const { updates } = payload
      const apiClient = new apiService()
      const { data } = await apiClient.put('/v1/customer/address', { data: { address: updates } })
      const { address, error } = data
      if (address) {
        commit('CUSTOMER_UPDATE_ADDRESSES', { addresses: [address] })
        return { success: 'ACTION_SUCCESS' }
      }
      return { address, error }
    } catch {
      return { error: 'ACTION_ERROR' }
    }
  },
  async customerUpdateAddressDiscount({ commit }, payload) {
    try {
      const { addressId, discountCode } = payload
      const apiClient = new apiService()
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
  },
  async customerUpdateAddressItems({ commit }, payload) {
    try {
      const { addressId, updatesOnetimes, updatesSubscriptions } = payload
      const apiClient = new apiService()

      const { data } = await apiClient.put('/v1/customer/items', {
        data: {
          addressId,
          updatesOnetimes,
          updatesSubscriptions
        }
      })

      const { charges, onetimes, subscriptions, error } = data

      if (charges) await commit('CUSTOMER_UPDATE_CHARGES', { charges, keys: ['id', 'addressId'] })
      if (onetimes) await commit('CUSTOMER_UPDATE_ONETIMES', { onetimes })
      if (subscriptions) await commit('CUSTOMER_UPDATE_SUBSCRIPTIONS', { subscriptions })

      return { onetimes, subscriptions, error }
    } catch {
      return { error: 'ACTION_ERROR' }
    }
  },
  async customerUpdatePlanToDFMenu({ commit }, payload) {
    //const { addressId, subscriptionIds } = payload;
    const appRequest = await fetch('https://fmp-app-production.herokuapp.com/plan/update', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-fmp-key': window.Scoutside.api.fmp_app_key
      },
      body: JSON.stringify({
        addressId: payload.addressId,
        updates: payload.updates,
        deletes: payload.deletes
      })
    })

    return appRequest
  },
  async customerUpdatePlan({ state }, payload) {
    const { customer } = state
    const { addressId, subscriptionIds } = customer
    const appRequest = await fetch('https://fmp-app-production.herokuapp.com/plan/update', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-fmp-key': window.Scoutside.api.fmp_app_key
      },
      body: JSON.stringify({
        addressId,
        updates: payload.updates,
        deletes: subscriptionIds
      })
    })
  }
}
