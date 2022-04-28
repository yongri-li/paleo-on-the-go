import { apiService } from '@shared/services'
import { mapMutations } from 'vuex'
import { changeRouter } from '../../../bundle/utils'

import {
  ADD_BOX_TO_CART,
  SET_SIZE_SELECTED,
  CREATE_ROUTE_PROTECTION_PRODUCT,
  REMOVE_ROUTE_PROTECTION_TO_CART,
  ADD_ROUTE_PROTECTION_TO_CART,
  ADD_PRODUCT_TO_CART,
  ADD_PRODUCTS_TO_CART,
  REDUCE_PRODUCT_TO_CART,
  REMOVE_PRODUCT_TO_CART,
  CLEAN_ALL_CART,
  ADD_PRODUCT_TO_CART_WITH_QT,
  MODAL_SETUP,
  MODAL_CLOSE
} from './_mutations-type'

export default {
  addToCartFromPortal() {
    console.log('q3eqdawdawxx', 'asdasdhi')
    //commit(ADD_PRODUCTS_TO_CART, { productsArr, where })
  },
  // addToCartFromPortal({ commit }, { productsArr, where }) {
  //   console.log('q3eqdawdawxx', productsArr, where)
  //   //commit(ADD_PRODUCTS_TO_CART, { productsArr, where })
  // },
  newCleanCart({ commit, getters }) {
    commit(CLEAN_ALL_CART)
  },
  newAddToCart({ commit, getters }, { product, where }) {
    commit(ADD_PRODUCT_TO_CART, { product, where })
  },
  addToCart({ commit, getters }, { idCollection, idProduct, where }) {
    const product = getters.getProductFromCartByID({ id: idProduct, where })
    if (!!product) {
      commit(ADD_PRODUCT_TO_CART, { product, where })
      return
    }
    const productFound = getters.getProductFromCollectionsByIDs({ idCollection, idProduct })
    commit(ADD_PRODUCT_TO_CART, { product: productFound, where })
  },
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

// import { apiService } from '@shared/services'
// import { mapMutations } from 'vuex'

// import {
//   ADD_PRODUCT_TO_CART,
//   ADD_PRODUCTS_TO_CART,
//   REDUCE_PRODUCT_TO_CART,
//   REMOVE_PRODUCT_TO_CART,
//   CHANGE_SIZE_SELECTED,
//   CLEAN_ALL_CART,
//   ADD_PRODUCT_TO_CART_WITH_QT,
//   MODAL_SETUP,
//   MODAL_CLOSE
// } from './_mutations-type'

// import { changeRouter } from '../../../bundle/utils'

// export default {
//   addToCartFromPortal({ commit, getters }, { productsArr, where }) {
//     commit(ADD_PRODUCTS_TO_CART, { productsArr, where })
//   },
//   newCleanCart({ commit, getters }) {
//     commit(CLEAN_ALL_CART)
//   },
//   newAddToCart({ commit, getters }, { product, where }) {
//     commit(ADD_PRODUCT_TO_CART, { product, where })
//   },
//   addToCart({ commit, getters }, { idCollection, idProduct, where }) {
//     const product = getters.getProductFromCartByID({ id: idProduct, where })
//     if (!!product) {
//       commit(ADD_PRODUCT_TO_CART, { product, where })
//       return
//     }
//     const productFound = getters.getProductFromCollectionsByIDs({ idCollection, idProduct })
//     commit(ADD_PRODUCT_TO_CART, { product: productFound, where })
//   },
//   reduceToCart({ commit, getters }, { idProduct, where }) {
//     commit(REDUCE_PRODUCT_TO_CART, { idProduct, where })

//     const productAfterReduce = getters.getProductFromCartByID({ id: idProduct, where })
//     if (productAfterReduce.quantity === 0) {
//       commit(REMOVE_PRODUCT_TO_CART, { idProduct, where })
//     }
//   },
//   validateChangeSizeSelected({ commit, getters, dispatch }, newVal) {
//     const { length, orderType } = getters.getLengthAndTypeCart
//     const newValType = newVal === 'onetime' ? 'onetime' : 'subscription'

//     if (length > 0 && orderType !== newValType) {
//       commit(MODAL_SETUP, {
//         component: 'ModalConfirmBoxSizes',
//         settings: {
//           params: { newVal }
//         }
//       })
//     } else {
//       dispatch('changeSizeSelected', newVal)
//     }
//   },
//   changeSizeSelected({ commit, getters }, newVal) {
//     commit(CHANGE_SIZE_SELECTED, { val: newVal })
//     const sizeSelected = getters.getSizeSelected
//     const changed = changeRouter(sizeSelected.order_type)
//     if (changed) {
//       commit(CLEAN_ALL_CART)
//     }

//     commit(MODAL_CLOSE)
//   },
//   validateSetPrebuilt({ commit, getters, dispatch }, listProduct) {
//     const { length } = getters.getLengthAndTypeCart
//     if (length > 0) {
//       commit(MODAL_SETUP, {
//         component: 'ModalConfirmPreBuilt',
//         settings: {
//           params: { listProduct }
//         }
//       })
//     } else {
//       dispatch('setPrebuiltBoxToCart', listProduct)
//     }
//   },
//   setPrebuiltBoxToCart({ commit, getters }, listProduct) {
//     commit(CLEAN_ALL_CART)

//     listProduct.forEach(product => {
//       const [id, qt] = product.split('x')
//       const productFound = getters.getFirstProductFromCollectionsByID(id)
//       commit(ADD_PRODUCT_TO_CART_WITH_QT, {
//         product: productFound,
//         where: 'items',
//         quantity: parseInt(qt)
//       })
//     })

//     commit(MODAL_CLOSE)
//   },
//   // SUBSCRIPTIONS
//   async customerCreateSubscriptions({ commit }, payload) {
//     const apiClient = new apiService()
//     const { addressId, creates } = payload
//     const { data } = await apiClient.post('/v1/customer/subscriptions', {
//       data: { addressId, creates }
//     })
//     // const { charges, onetimes, error } = data
//     const { charges, subscriptions, error } = data
//     // if (charges) await commit('CUSTOMER_UPDATE_CHARGES', { charges, keys: ['id', 'addressId'] })
//     // if (subscriptions) await commit('CUSTOMER_UPDATE_SUBSCRIPTIONS', { subscriptions })
//     return { subscriptions, error }
//   },
//   // async customerUpdateSubscriptions({ commit }, payload) {
//   //   const apiClient = new apiService()
//   //   const { addressId, updates } = payload
//   //   const { data } = await apiClient.put('/v1/customer/subscriptions', {
//   //     data: { addressId, updates }
//   //   })
//   //   const { charges, subscriptions, error } = data
//   //   if (charges) await commit('CUSTOMER_UPDATE_CHARGES', { charges, keys: ['id', 'addressId'] })
//   //   if (subscriptions) await commit('CUSTOMER_UPDATE_SUBSCRIPTIONS', { subscriptions })
//   //   console.log(subscriptions)
//   //   return { subscriptions, error }
//   // },
//   async customerDeleteSubscriptions({ commit }, payload) {
//     const apiClient = new apiService()
//     const { addressId, ids } = payload
//     const { data } = await apiClient.delete('/v1/customer/subscriptions', {
//       data: { addressId, ids }
//     })
//     const { charges, subscriptions, error } = data
//     // if (charges) await commit('CUSTOMER_UPDATE_CHARGES', { charges, keys: ['id', 'addressId'] })
//     // if (subscriptions) await commit('CUSTOMER_UPDATE_SUBSCRIPTIONS', { subscriptions })
//     return { subscriptions, error }
//   },
//   // ONETIME ADDONS
//   async customerDeleteOnetimes({ commit }, payload) {
//     const apiClient = new apiService()
//     const { addOnsIds, addressId } = payload
//     const { data } = await apiClient.delete('/v1/customer/onetimes', {
//       data: { addressId, ids: addOnsIds }
//     })
//     const { charges, onetimes, error } = data
//     return { onetimes, error }
//   },
//   async customerCreateOnetimes({ commit }, payload) {
//     const apiClient = new apiService()
//     const { creates } = payload
//     const { addressId } = payload
//     const { data } = await apiClient.post('/v1/customer/onetimes', {
//       data: { addressId, creates }
//     })
//     const { charges, onetimes, error } = data
//     return { onetimes, error }
//   }
// }
