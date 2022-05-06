import { apiService } from '@shared/services'

export default {
  async customerUpdatePaymentMethod({ commit, dispatch }, payload) {
    try {
      const { paymentMethodId, updates } = payload
      console.log(payload)
      const portalClient = new apiService()
      const { data } = await portalClient.put('/v1/customer/payment-method', {
        data: { paymentMethodId, updates }
      })

      console.log(data, 'dataaa')
      const { paymentMethod, error } = data
      if (paymentMethod) {
        commit('CUSTOMER_UPDATE_PAYMENT_METHOD', { paymentMethod })
      }
      return { paymentMethod, error }
    } catch (err) {
      const error = {
        type: 'ACTIONS_ERROR',
        process: 'actions/customer/customerUpdatePaymentMethod',
        message: `${err}`
      }
      console.log('ERROR', error)
      return { error }
    }
  }
}
