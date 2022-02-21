import { apiService } from '@shared/services'
import { graphqlService } from '@shared/services'
import addressesActions from './addresses/_actions'
import chargesActions from './charges/_actions'
import onetimesActions from './onetimes/_actions'
import subscriptionsActions from './subscriptions/_actions'

export default {
  async customerSetState({ commit }) {
    try {
      const apiClient = new apiService()
      const { data } = await apiClient.get('/v1/customer/account')
      const { shopifyCustomer, rechargeCustomer } = data
      if(shopifyCustomer) commit('CUSTOMER_SET_SHOPIFY', shopifyCustomer)
      if(rechargeCustomer) commit('CUSTOMER_SET_RECHARGE', rechargeCustomer)
      commit('CUSTOMER_SET_READY')
      return { success: 'ACTION_SUCCESS' }
    } catch {
      return { error: 'ACTION_ERROR' }
    }
  },
  async customerSetResources({ state, commit, dispatch }, payload) {
    try {
      const { resources } = payload
      const resourcesInState = state.resources
      const apiClient = new apiService()
      const { data } = await apiClient.get('/v1/customer/resources', { params: { resources: resources }})
      await commit('CUSTOMER_SET_RESOURCES', data.resources)
      
      return { success: 'ACTION_SUCCESS' }
    } catch {
      return { error: 'ACTION_ERROR' }
    }
  },
  async customerUpdateBilling({ commit }, payload) {
    try {
      const { updates } = payload
      const apiClient = new apiService()
      const { data } = await apiClient.put('/v1/customer/billing', { data: { address: updates }})
      const { customer, error } = data
      if(customer) {
        commit('CUSTOMER_SET_RECHARGE', customer)
        return { success: 'ACTION_SUCCESS' }
      }
      if(error) return { error }
    } catch {
      return { error: 'ACTION_ERROR' }
    }
  },
  async customerUpdateProfile({ commit }, payload) {
    try {
      const { updates } = payload
      const apiClient = new apiService()
      const { data } = await apiClient.put('/v1/customer/profile', { data: { profile: updates }})
      const { customer, error } = data
      if(customer) commit('CUSTOMER_SET_SHOPIFY', customer)
      return { customer, error }
    } 
    catch(err) {
      const error = { 
        type: 'ACTIONS_ERROR', 
        process: 'actions/customer/customerUpdateProfile',
        message: `${err}`
      }
      console.log('ERROR', error)
      return { error }
    }  
  },
  async customerRecoverPassword({ commit }, payload) {
    try {
      const { query } = payload
      const graphqlClient = new graphqlService()
      const { data } = await graphqlClient.post({ query })
      const customerRecover = data.data.customerRecover
      if(customerRecover.customerUserErrors.length) return { error: customerRecover.customerUserErrors }
      return { success: 'ACTION_SUCCESS' }
    } catch {
      return { error: 'ACTION_ERROR' }
    }
  },
  ...addressesActions,
  ...chargesActions,
  ...onetimesActions,
  ...subscriptionsActions
}