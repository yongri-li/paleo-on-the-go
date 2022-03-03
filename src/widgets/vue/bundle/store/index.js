import Vue from 'vue'
import Vuex from 'vuex'

const { account } = require('./_state').default();

Vue.use(Vuex)

const store = new Vuex.Store({
  state: require('./_state').default,
  actions: require('./_actions').default,
  getters: require('./_getters').default,
  mutations: require('./_mutations').default,
})

export default store;