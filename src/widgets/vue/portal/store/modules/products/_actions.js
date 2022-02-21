export default {
  async productsSyncInventory({ commit }) {
    try {
      const { inventory } = window.Scoutside.products
      if (inventory) {
        commit('PRODUCTS_SET_INVENTORY', { inventory })
        return { success: 'ACTION_SUCCESS' }
      }
    } catch {
      return { error: 'ACTION_ERROR' }
    }
  },
  async customerGetDefaultMenu({ commit }, payload) {
    try {
      const appRequest = await fetch(
        `https://fmp-app-production.herokuapp.com/favorites?email=${encodeURIComponent(payload.email)}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'x-fmp-key': window.Scoutside.api.fmp_app_key,
            'x-fmp-customer': window.Scoutside.api.customer_email_hash
          }
        }
      )
      const appResponse = await appRequest.json()
      commit('PRODUCTS_SET_DEFAULT_MENU', appResponse)
      if (appResponse) return true
    } catch {
      return false
    }
  },
  async customerSetDefaultMenu({ commit }, payload) {
    const appRequest = await fetch(`https://fmp-app-production.herokuapp.com/favorites`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-fmp-key': window.Scoutside.api.fmp_app_key,
        'x-fmp-customer': window.Scoutside.api.customer_email_hash
      },
      body: JSON.stringify({
        email: payload.email,
        favorites: payload.favorites
      })
    })
    const appResponse = await appRequest.json()
    console.log('appResponse', appResponse)
    commit('PRODUCTS_SET_DEFAULT_MENU', appResponse)
    if (appResponse) return true
  }
}
