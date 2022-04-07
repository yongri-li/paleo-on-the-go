export default {
  getSubscriptionItems: (state) => {
    return state.cartItems.box.filter(item => item.order_type === 'subscription')
  },
  getOnetimeItems: (state) => {
    return state.cartItems.box.filter(item => item.order_type === 'onetime')
  },
  getAddonsItems: (state) => {
    return state.cartItems.box.filter(item => item.order_type === 'addons')
  },
  getBoxPrices: (state) => {
    let sub = 0
    let final = 0
    state.cartItems.box.forEach(({price, quantity, order_type}) => {
      sub += price * quantity
      if(order_type === 'subscription') {
        const discount = state.sizeSelected.discount / 100
        price = price * (1 - discount)
      }
      final += price * quantity
    });

    return {
      sub,
      final
    }
  },
  getGeneralPrices: (state) => {
    let final = 0
    state.cartItems.general.forEach(({price, quantity}) => {
      final += price * quantity
    })
    return final
  }
}