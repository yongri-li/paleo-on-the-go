export default {
  getSubscriptionItems: state => {
    return state.cartItems.box.filter(item => item.order_type === 'subscription')
  },
  getOnetimeItems: state => {
    return state.cartItems.box.filter(item => item.order_type === 'onetime')
  },
  getAddonsItems: state => {
    return state.cartItems.box.filter(item => item.order_type === 'addons')
  },
  getBoxPrices: state => {
    let sub = 0
    let final = 0
    state.cartItems.box.forEach(({ price, quantity, order_type }) => {
      sub += price * quantity
      if (order_type === 'subscription') {
        const discount = state.sizeSelected.discount / 100
        price = price * (1 - discount)
      }
      final += price * quantity
    })

    return {
      sub,
      final
    }
  },
  getGeneralPrices: state => {
    let final = 0
    state.cartItems.general.forEach(({ price, quantity }) => {
      final += price * quantity
    })
    return final
  },
  routeProductInCart: state => {
    return state.cartItems.general.find(item => item.route_protection)
  },
  getSubTotalPricesWithoutRoute: (state, getters) => {
    const boxPrice = getters.getBoxPrices.final
    const generalPrice = getters.getGeneralPrices
    const routePrice = getters.routeProductInCart ? getters.routeProductInCart.price : 0
    return boxPrice + generalPrice - routePrice
  }
}

//////////import { sortProducts } from '../../utils'

// export default {
//   getProductsFromRoute: (state) => ($route) => {
//     const param = $route.params.box
//     const collectionFound = state.collections.find(collection => collection.url === param)
//     let products = !!collectionFound ? collectionFound.products : state.collections[0].products

//     const queryRouter = $route.query
//     const keys = Object.keys(queryRouter)
//     keys.forEach(key => {
//       if(queryRouter[key]) {
//         const valSplit = queryRouter[key].split(',')
//         if(key === 'preference' || key === 'product_type') {
//           let prop = key === 'preference' ? 'tags' : 'type'
//           valSplit.forEach(val => {
//             products = products.filter(product => product[prop].includes(val))
//           })
//         }
//       }
//     })
//     return sortProducts({
//       products: [...products],
//       sortType: queryRouter.sort
//     })
//   },
//   getProductFromCollectionsByIDs: (state) => ({idCollection, idProduct}) => {
//     const collectionFound = state.collections.find(collection => collection.id === idCollection)
//     const productFound = collectionFound.products.find(product => product.id === idProduct)
//     return productFound
//   },
//   getProductFromCartByID: (state) => ({id, where}) => {
//     const productFound = state.cart[where].find(item => item.id === id)
//     return productFound
//   },
//   getFirstProductFromCollectionsByID: (state) => (idProduct) => {
//     const collectionFound = state.collections.find(collection => collection.products.find(product => product.id == idProduct))
//     let productFound = {}
//     if(!!collectionFound) {
//       productFound = collectionFound.products.find(product => product.id == idProduct)
//     }
//     return productFound
//   },
//   getSizeSelected: (state) => {
//     const sizeFound = state.sizes.find(size => size.selected)
//     return sizeFound
//   },
//   getPrebuiltByBox: (state) => (sizeNumber) => {
//     const prebuiltFilter = state.prebuilt.items.filter(box => box.products.find(product => product.size == sizeNumber))

//     const options = prebuiltFilter.length ? prebuiltFilter : []
//     return options
//   },
//   getProductPrebuilt: (state) => ({ bundlename, size }) => {
//     const boxFound = state.prebuilt.items.find(box => box.bundlename === bundlename)
//     const productsFound = boxFound.products.find(product => product.size == size)
//     return productsFound.list
//   },
//   getLengthAndTypeCart: (state) => {
//     const cartLength = state.cart.items.length
//     const sizeFound = state.sizes.find(size => size.selected)
//     return {
//       length: cartLength,
//       orderType: sizeFound.order_type
//     }
//   },
//   getAddOnsSubtotal: (state) => {
//     let subtotal = 0
//     state.cart.addons.forEach(addon => {
//       subtotal += addon.price * addon.quantity
//     })
//     return subtotal
//   },
//   getItemSubtotal: (state) => {
//     let subtotal = 0
//     state.cart.items.forEach(item => {
//       subtotal += item.price * item.quantity
//     })
//     return subtotal
//   }
// }
