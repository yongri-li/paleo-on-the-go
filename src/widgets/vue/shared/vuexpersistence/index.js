import VuexPersistence from 'vuex-persist'

export const persist = new VuexPersistence({
  reducer: state => ({
    cartdrawer: {
      cartItems: state.cartdrawer?.cartItems,
      sizeSelected: state.cartdrawer?.sizeSelected
    },
    babcart: {
      cart: state.babcart?.cart
    },
    mealcart: {
      sizes: state.mealcart?.sizes
    }
  })
})
