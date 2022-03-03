import { apiService } from '@shared/services';

export default {
  async customerUpdatePlan({ state }, payload) {
    const { customer } = state;
    const { addressId, subscriptionIds } = customer;
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
    });
  },
  async searchCustomer({}, payload) {
    const { email } = payload
    const query = `${email}`
    const apiClient = new apiService()
    const { data } = await apiClient.get('/v1/customer/search?query=' + query)
    const { customers, error } = data
    return { customers, error }
  },
  async customerCreateOnetimes({ state }, payload) {
    const { creates } = payload
    const { addressId } = state.customer;
    const apiClient = new apiService()
    const { data } = await apiClient.post('/v1/customer/onetimes', {
      data: { addressId, creates }
    })
    const { charges, onetimes, error } = data
    return { onetimes, error }
  },
  async customerUpdateOnetimes({  }, payload) {
    const { addressId, updates } = payload
    const apiClient = new apiService()
    const { data } = await apiClient.put('/v1/customer/onetimes', {
      data: { addressId, updates }
    })
    const { charges, onetimes, error } = data
    return { onetimes, error }
  },
  async customerDeleteOnetimes({ state }, payload) {
    const { addOnsIds, addressId } = state.customer;
    const apiClient = new apiService()
    const { data } = await apiClient.delete('/v1/customer/onetimes', {
      data: { addressId, ids: addOnsIds }
    })
    const { charges, onetimes, error } = data
    return { onetimes, error }
  }
}
