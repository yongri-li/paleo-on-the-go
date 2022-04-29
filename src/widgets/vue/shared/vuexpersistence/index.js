import VuexPersistence from 'vuex-persist'

export const persist = new VuexPersistence({
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
