import Vue from 'vue'
import Vuex from 'vuex'
import modules from './modules'
import VuexPersistence from 'vuex-persist'

Vue.use(Vuex)

const persist = new VuexPersistence({
  reducer: (state) => ({
    cartdrawer: {
      cart: state.cartdrawer.cart,
      sizes: state.cartdrawer.sizes
    }
  })
})

const store = new Vuex.Store({
  modules,
  plugins: [persist.plugin]
})

export default store