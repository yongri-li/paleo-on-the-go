export default {
  CUSTOMER_UPDATE_PAYMENT_METHOD(state, payload) {
    const { paymentMethod } = payload

    const paymentMethods = [...state.resources.paymentMethods]
    const index = paymentMethods.findIndex(item => paymentMethod.id === item.id)
    paymentMethods[index] = paymentMethod

    state.resources.paymentMethods = paymentMethods
  }
}
