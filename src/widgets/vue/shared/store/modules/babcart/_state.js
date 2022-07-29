const state = {
  cart: {
    items: [],
    addons: [],
    general: []
  },
  currentRouteProduct: {},
  currentRouteVariant: {}
}

export default () => ({ ...state })
