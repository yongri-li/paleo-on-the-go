import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersistence from 'vuex-persist'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: require('./_state').default,
  getters: require('./_getters').default,
  mutations: require('./_mutations').default,
  actions: require('./_actions').default,
  plugins: [new VuexPersistence().plugin]
})

export default store