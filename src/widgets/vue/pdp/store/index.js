import Vue from 'vue'
import Vuex from 'vuex'
import modules from './modules'
import { persist } from '../../shared/vuexpersistence'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: require('./_state').default,
  getters: require('./_getters').default,
  actions: require('./_actions').default,
  mutations: require('./_mutations').default,
  modules,
  plugins: [persist.plugin]
})

export default store
