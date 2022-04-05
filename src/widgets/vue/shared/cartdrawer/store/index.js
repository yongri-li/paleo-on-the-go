import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersistence from 'vuex-persist'

Vue.use(Vuex)

const persist = new VuexPersistence({
  reducer: (state) => ({
    cart: state.cart,
    sizes: state.sizes
  })
})

const store = new Vuex.Store({
  state: require('./_state').default,
  getters: require('./_getters').default,
  mutations: require('./_mutations').default,
  actions: require('./_actions').default,
  plugins: [persist.plugin]
})

export default store