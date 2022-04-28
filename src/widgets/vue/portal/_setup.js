import { setIntervalAsync } from 'set-interval-async/dynamic'
import Cookies from 'universal-cookie'
const cookies = new Cookies()

console.log('newnewnw')
const delay = async ms => {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export default async app => {
  await delay(250)
  console.log('third')

  const { dispatch, commit } = app.$store
  const { portal, shop, bundle } = window.Scoutside
  const { products } = portal

  console.log(products, portal, shop)
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
