import { formatPrice } from '@shared/utils'

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
    let discount = 1
    state.cartItems.box.forEach(({ price, quantity, order_type }) => {
      if (order_type === 'subscription') {
        discount = (100 - state.sizeSelected.discount) / 100
      }
      if (order_type === 'subscription' || order_type === 'onetime') {
        sub += price * quantity
        price = +(Math.round((price * discount) / 100 + 'e+2') + 'e-2')
        final += price * quantity
      }
    })
    return { sub, final }
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
    const boxPrice = getters.getBoxPrices.final * 100
    const generalPrice = getters.getGeneralPrices
    const addonPrice = getters.getAddonPrices
    const routePrice = getters.routeProductInCart ? getters.routeProductInCart.price : 0
    return boxPrice + addonPrice + generalPrice - routePrice
  }
}
