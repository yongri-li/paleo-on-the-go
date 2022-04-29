import {
  ADD_PRODUCT_TO_CART,
  ADD_PRODUCTS_TO_CART_FROM_PORTAL,
  REDUCE_PRODUCT_TO_CART,
  REMOVE_PRODUCT_TO_CART,
} from './_mutations-type'

export default {
  addToCart({ commit }, {product, where}) {
    commit( ADD_PRODUCT_TO_CART, { product, where } )
  },
  reduceToCart({ commit, getters }, {idProduct, where}) {
    commit( REDUCE_PRODUCT_TO_CART, { idProduct, where } )

    const productAfterReduce = getters.getProductFromCartByID({ id: idProduct, where })
    if (productAfterReduce.quantity === 0) {
      commit( REMOVE_PRODUCT_TO_CART, { idProduct, where } )
    }
  },
  addToCartFromPortal({ commit }, {items, addons}) {
    console.log('items', items);
    console.log('addons', addons);
    commit( ADD_PRODUCTS_TO_CART_FROM_PORTAL, { products: items.productsArr, where: items.where } )
    commit( ADD_PRODUCTS_TO_CART_FROM_PORTAL, { products: addons.productsArr, where: addons.where } )
  }
}