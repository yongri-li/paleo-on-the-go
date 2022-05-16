const state = {
  cart: {
    items: [],
    addons: []
  },
  currentRouteProduct: {},
  currentRouteVariant: {}
}

export default () => ({ ...state })
