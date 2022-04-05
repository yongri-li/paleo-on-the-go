import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: require('./_state').default,
  getters: require('./_getters').default
})

export default store