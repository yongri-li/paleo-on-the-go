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
  // SUBSCRIPTIONS
  async customerCreateSubscriptions({ commit }, payload) {
    const apiClient = new apiService()
    const { addressId, creates } = payload
    const { data } = await apiClient.post('/v1/customer/subscriptions', {
      data: { addressId, creates }
    })
    // const { charges, onetimes, error } = data
    const { charges, subscriptions, error } = data
    // if (charges) await commit('CUSTOMER_UPDATE_CHARGES', { charges, keys: ['id', 'addressId'] })
    // if (subscriptions) await commit('CUSTOMER_UPDATE_SUBSCRIPTIONS', { subscriptions })
    return { subscriptions, error }
  },
  async customerDeleteSubscriptions({ commit }, payload) {
    const apiClient = new apiService()
    const { addressId, ids } = payload
    const { data } = await apiClient.delete('/v1/customer/subscriptions', {
      data: { addressId, ids }
    })
    const { charges, subscriptions, error } = data
    // if (charges) await commit('CUSTOMER_UPDATE_CHARGES', { charges, keys: ['id', 'addressId'] })
    // if (subscriptions) await commit('CUSTOMER_UPDATE_SUBSCRIPTIONS', { subscriptions })
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
  async addRouteProduct({ commit }, { routeProduct, variant }) {
    // Remove some product we have before
    commit(REMOVE_ROUTE_PROTECTION_TO_CART)

    // create routeProduct to add
    routeProduct = {
      ...routeProduct,
      variants: [variant],
      hide: true,
      order_type: 'general',
      quantity: 1,
      price: variant.price,
      route_protection: true
    }

    // add product
    commit(ADD_ROUTE_PROTECTION_TO_CART, { routeProduct })
  },
  removeRouteProductToCart({ commit }) {
    commit(REMOVE_ROUTE_PROTECTION_TO_CART)
  }
}
