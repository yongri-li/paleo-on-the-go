// For testing until Portal setup is fixed
const { customer } = window.Scoutside

export default () => ({
  ready: false,
  recharge: false,
  shopify: customer,
  //shopify: false,
  resources: {
    addresses: false,
    charges: false,
    onetimes: false,
    orders: false,
    subscriptions: false
  }
})
