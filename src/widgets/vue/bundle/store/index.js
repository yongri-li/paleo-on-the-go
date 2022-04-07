import Vue from 'vue'
import Vuex from 'vuex'
import modules from './modules'
import VuexPersistence from 'vuex-persist'

Vue.use(Vuex)

const persist = new VuexPersistence({
  reducer: (state) => ({
    cartdrawer: {
      cartItems: state.cartdrawer.cartItems,
      sizeSelected: state.cartdrawer.sizeSelected
    },
    mealcart: {
      cart: state.mealcart.cart,
      sizes: state.mealcart.sizes
    }
  })
})

const store = new Vuex.Store({
  modules,
  plugins: [persist.plugin]
})

export default store