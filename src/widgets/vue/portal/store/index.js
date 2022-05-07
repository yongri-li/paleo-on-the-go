import Vue from 'vue'
import Vuex from 'vuex'
import modules from './modules'
import { persist } from '../../shared/vuexpersistence'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules,
  plugins: [persist.plugin]
})

console.log('portal store:', store, store.plugins)

export default store
