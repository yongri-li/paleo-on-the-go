import { apiService } from '@shared/services'
import addressActions from './addresses/_actions'
import chargesActions from './charges/_actions'
import onetimesActions from './onetimes/_actions'
import subscriptionsActions from './subscriptions/_actions'

export default {
  async customerSetState({ commit }) {
    try {
      const apiClient = new apiService()
      const { data } = await apiClient.get('/v1/customer/account')
      const { shopifyCustomer, rechargeCustomer } = data

      if (shopifyCustomer) commit('CUSTOMER_SET_SHOPIFY', shopifyCustomer)
      if (rechargeCustomer) commit('CUSTOMER_SET_RECHARGE', rechargeCustomer)
      commit('CUSTOMER_SET_READY')
      return { success: 'ACTION_SUCCESS' }
    } catch {
      return { error: 'ACTION_ERROR' }
    }
  },
  async customerSetResources({ state, commit, dispatch }, payload) {
    try {
      const apiClient = new apiService()
      const { resources } = payload
      const resourcesInState = state.resources
      const resourceKeys = resources.filter(key => !resourcesInState[key])
      if (resourceKeys.length > 0) {
        const { data } = await apiClient.get('/v1/customer/resources', {
          params: { resources: resourceKeys }
        })

        await commit('CUSTOMER_SET_RESOURCES', data.resources)
      }
      return { success: 'ACTION_SUCCESS' }
    } catch {
      return { error: 'ACTION_ERROR' }
    }
  },
  async customerUpdateBilling({ commit }, payload) {
    try {
      const { updates, address } = payload
      const apiClient = new apiService()
      const { data } = await apiClient.put('/v1/customer/billing', { data: { address } })
      const { customer, error } = data
      if (customer) {
        commit('CUSTOMER_SET_RECHARGE', customer)
        return { success: 'ACTION_SUCCESS' }
      }
      if (error) return { error }
    } catch {
      return { error: 'ACTION_ERROR' }
    }
  },
  ...addressActions,
  ...chargesActions,
  ...onetimesActions,
  ...subscriptionsActions
}
