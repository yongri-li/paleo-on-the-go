export default {
  customerDefaultPaymentMethod: state => {
    const { paymentMethods } = state.resources
    if (paymentMethods && paymentMethods.length) {
      return paymentMethods.find(item => item.default === true)
    }
  }
}
