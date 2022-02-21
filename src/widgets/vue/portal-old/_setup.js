import Cookies from 'universal-cookie'
const cookies = new Cookies()

export default async (app) => {
  const { dispatch, commit } = app.$store
  const { portal, shop } = window.Scoutside
  
  // SET BASE DATA
  await Promise.all([
    commit('customize/CUSTOMIZE_SET_STATE', { shop, content: portal }),
    dispatch('customer/customerSetState')
  ])
}