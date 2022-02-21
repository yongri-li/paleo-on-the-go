export default () => ({
  ready: false,
  recharge: false,
  shopify: false,
  resources: {
    addresses: false,
    charges: false,
    onetimes: false,
    orders: false,
    subscriptions: false,
    zips: false
  },
  shipCutoffData: window.Scoutside.shop,
  gooop: {},
  deliverydays: [],
  deliveryday: '',
  deliverydate: '',
  nextSchChrgDate: '',  
  futureSkips: [],
  isNewSelected: false,
  isNextSkipped: false
})