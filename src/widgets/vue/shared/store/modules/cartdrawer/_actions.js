import { apiService } from '@shared/services'

import {
  ADD_BOX_TO_CART,
  SET_SIZE_SELECTED,
  CREATE_ROUTE_PROTECTION_PRODUCT,
  REMOVE_ROUTE_PROTECTION_TO_CART,
  ADD_ROUTE_PROTECTION_TO_CART
} from './_mutations-type'

export default {
  async setDataFromBox({ commit }, { items, addons, sizeSelected }) {
    let products = items.map(item => ({
      ...item,
      order_type: sizeSelected.order_type
    }))
    addons.forEach(item => {
      products.push({
        ...item,
        order_type: 'addons'
      })
    })

    commit(ADD_BOX_TO_CART, { items: products })
    commit(SET_SIZE_SELECTED, { sizeSelected })
  },
  // UPDATES to Existing PORTAL Customers
  async customerUpdatePlan({ state }, payload) {
    const { addressId, updates, deletes } = payload
    const appRequest = await fetch('https://paleo-custom-app.herokuapp.com/plan/update', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-paleo-key': window.Scoutside.api.custom_app_key
      },
      body: JSON.stringify({
        addressId,
        updates,
        deletes
      })
    })
  },
  async customerCreateSubscriptions({ commit }, payload) {
    const apiClient = new apiService()
    const { addressId, creates } = payload
    const { data } = await apiClient.post('/v1/customer/subscriptions', {
      data: { addressId, creates }
    })
    const { charges, subscriptions, error } = data
    return { subscriptions, error }
  },
  async customerDeleteSubscriptions({ commit }, payload) {
    const apiClient = new apiService()
    const { addressId, ids } = payload
    const { data } = await apiClient.delete('/v1/customer/subscriptions', {
      data: { addressId, ids }
    })
    const { charges, subscriptions, error } = data
    return { subscriptions, error }
  },
  // ONETIME ADDONS
  async customerDeleteOnetimes({ commit }, payload) {
    const apiClient = new apiService()
    const { addOnsIds, addressId } = payload
    const { data } = await apiClient.delete('/v1/customer/onetimes', {
      data: { addressId, ids: addOnsIds }
    })
    const { charges, onetimes, error } = data
    return { onetimes, error }
  },
  async customerCreateOnetimes({ commit }, payload) {
    const apiClient = new apiService()
    const { creates } = payload
    const { addressId } = payload
    const { data } = await apiClient.post('/v1/customer/onetimes', {
      data: { addressId, creates }
    })
    const { charges, onetimes, error } = data
    return { onetimes, error }
  },
  // Route Shipping Protection
  async setRouteProduct({ commit }) {
    const response = await fetch('/products/routeins.js')
    const routeProduct = await response.json()
    commit(CREATE_ROUTE_PROTECTION_PRODUCT, { routeProduct })
    return routeProduct
  },
  async addRouteProduct({ commit, getters }, { routeProduct, variant }) {

    // calculate where put the route product
    const hasSubscription = getters.getSubscriptionItems.length > 0
    const where = hasSubscription ? 'box' : 'general'

    // Remove some product we have before
    commit(REMOVE_ROUTE_PROTECTION_TO_CART, { where })

    // create routeProduct to add
    routeProduct = {
      ...routeProduct,
      variants: [variant],
      hide: true,
      order_type: hasSubscription ? 'subscription' : 'general',
      quantity: 1,
      price: variant.price,
      route_protection: true
    }

    // add product
    commit(ADD_ROUTE_PROTECTION_TO_CART, { routeProduct, where })
  },
  removeRouteProductToCart({ commit, getters }) {
    const hasSubscription = getters.getSubscriptionItems.length > 0
    const where = hasSubscription ? 'box' : 'general'

    commit(REMOVE_ROUTE_PROTECTION_TO_CART, { where })
  }
}
