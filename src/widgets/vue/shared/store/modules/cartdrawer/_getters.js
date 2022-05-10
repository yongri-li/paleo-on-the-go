export default {
  getSubscriptionItems: state => {
    return state.cartItems.box.filter(item => item.order_type === 'subscription')
  },
  getOnetimeItems: state => {
    return state.cartItems.box.filter(item => item.order_type === 'onetime')
  },
  getAddonsItems: state => {
    return state.cartItems.box.filter(item => item.order_type === 'addons')
  },
  getBoxPrices: state => {
    let sub = 0
    let final = 0
    state.cartItems.box.forEach(({ price, quantity, order_type }) => {
      sub += price * quantity
      if (order_type === 'subscription') {
        const discount = state.sizeSelected.discount / 100
        price = price * (1 - discount)
      }
      final += price * quantity
    })

    return {
      sub,
      final
    }
  },
  getAddonPrices: state => {
    let final = 0
    state.cartItems.box.forEach(({ price, quantity, order_type }) => {
      if (order_type === 'addons') {
        final += price * quantity
      }
    })
    return final
  },
  getGeneralPrices: state => {
    let final = 0
    state.cartItems.general.forEach(({ varPrice, price, quantity }) => {
      final += varPrice ? varPrice * quantity : price * quantity
    })
    return final
  },
  routeProductInCart: state => {
    return state.cartItems.general.find(item => item.route_protection)
  },
  getSubTotalPricesWithoutRoute: (state, getters) => {
    const boxPrice = getters.getBoxPrices.final
    const generalPrice = getters.getGeneralPrices
    const routePrice = getters.routeProductInCart ? getters.routeProductInCart.price : 0
    return boxPrice + generalPrice - routePrice
  }
}
