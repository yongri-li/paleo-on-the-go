import VuexPersistence from 'vuex-persist'

export const persist = new VuexPersistence({
  reducer: state => ({
    cartdrawer: {
      cartItems: state.cartdrawer?.cartItems,
      sizeSelected: state.cartdrawer?.sizeSelected
    },
    babcart: {
      cart: state.babcart?.cart,
      currentRouteProduct: state.babcart?.currentRouteProduct,
      currentRouteVariant: state.babcart?.currentRouteVariant
    },
    mealcart: {
      sizes: state.mealcart?.sizes
    }
  })
})
