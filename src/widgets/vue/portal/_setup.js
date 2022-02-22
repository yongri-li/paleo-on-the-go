// import Cookies from 'universal-cookie'
// const cookies = new Cookies()

// export default async (app) => {
//   const { dispatch, commit } = app.$store
//   const { portal, shop } = window.Scoutside

//   // SET BASE DATA
//   await Promise.all([
//     commit('customize/CUSTOMIZE_SET_STATE', { shop, content: portal }),
//     dispatch('customer/customerSetState')
//   ])
// }

import { setIntervalAsync } from 'set-interval-async/dynamic'
import Cookies from 'universal-cookie'
import customerSetResources from '../portal/store/modules/customer/_actions'

const cookies = new Cookies()

console.log('asdasdasdasdsad')

// export default async app => {
//   const { dispatch, commit } = app.$store
//   const { portal, shop, bundle } = window.Scoutside
//   const { products } = portal

//   console.log('app test ghere')

//   // SET BASE DATA
//   await Promise.all([
//     commit('customize/CUSTOMIZE_SET_STATE', { shop, content: portal }),
//     commit('products/PRODUCTS_SET_CATALOG', { catalog: products.catalog }),
//     commit('products/PRODUCTS_SET_INVENTORY', { inventory: products.inventory }),
//     commit('bundle/BUNDLE_SET_CONTENT', bundle),
//     dispatch('customer/customerSetState')
//   ])

//   // SET INVENTORY LOOP
//   setIntervalAsync(async () => {
//     await dispatch('products/productsSyncInventory')
//   }, 300000)
// }
console.log(customerSetResources)
//customerSetState()
customerSetResources()

const app = async () => {
  // const { dispatch, commit } = app.$store
  // console.log(app, this.$store)
  const { portal, shop, bundle } = window.Scoutside
  const { products } = portal

  console.log('app test ghere', portal, shop, bundle, products)

  // SET BASE DATA
  await Promise.all([
    commit('customize/CUSTOMIZE_SET_STATE', { shop, content: portal }),
    commit('products/PRODUCTS_SET_CATALOG', { catalog: products.catalog }),
    commit('products/PRODUCTS_SET_INVENTORY', { inventory: products.inventory }),
    commit('bundle/BUNDLE_SET_CONTENT', bundle),
    dispatch('customer/customerSetState')
  ])

  // SET INVENTORY LOOP
  setIntervalAsync(async () => {
    await dispatch('products/productsSyncInventory')
  }, 300000)
}

app()
