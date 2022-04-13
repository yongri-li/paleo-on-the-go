import { sortProducts } from '../../utils'

export default {
  getProductsFromRoute: state => $route => {
    const param = $route.params.box
    const collectionFound = state.collections.find(collection => collection.url === param)
    let products = !!collectionFound ? collectionFound.products : state.collections[0].products

    const queryRouter = $route.query
    const keys = Object.keys(queryRouter)
    keys.forEach(key => {
      if (queryRouter[key]) {
        const valSplit = queryRouter[key].split(',')
        if (key === 'preference' || key === 'product_type') {
          let prop = key === 'preference' ? 'tags' : 'type'
          valSplit.forEach(val => {
            products = products.filter(product => product[prop].includes(val))
          })
        }
      }
    })
    return sortProducts({
      products: [...products],
      sortType: queryRouter.sort
    })
  },
  getProductFromCollectionsByIDs:
    state =>
    ({ idCollection, idProduct }) => {
      const collectionFound = state.collections.find(collection => collection.id === idCollection)
      const productFound = collectionFound.products.find(product => product.id === idProduct)
      return productFound
    },
  getProductFromCartByID:
    state =>
    ({ id, where }) => {
      const productFound = state.cart[where].find(item => item.id === id)
      return productFound
    },
  getFirstProductFromCollectionsByID: state => idProduct => {
    const collectionFound = state.collections.find(collection =>
      collection.products.find(product => product.id == idProduct)
    )
    let productFound = {}
    if (!!collectionFound) {
      productFound = collectionFound.products.find(product => product.id == idProduct)
    }
    return productFound
  },
  getSizeSelected: state => {
    const sizeFound = state.sizes.find(size => size.selected)
    return sizeFound
  },
  getPrebuiltByBox: state => sizeNumber => {
    const prebuiltFilter = state.prebuilt.items.filter(box =>
      box.products.find(product => product.size == sizeNumber)
    )

    const options = prebuiltFilter.length ? prebuiltFilter : []
    return options
  },
  getProductPrebuilt:
    state =>
    ({ bundlename, size }) => {
      const boxFound = state.prebuilt.items.find(box => box.bundlename === bundlename)
      const productsFound = boxFound.products.find(product => product.size == size)
      return productsFound.list
    },
  getLengthAndTypeCart: state => {
    const cartLength = state.cart.items.length
    const sizeFound = state.sizes.find(size => size.selected)
    return {
      length: cartLength,
      orderType: sizeFound.order_type
    }
  },
  getAddOnsSubtotal: state => {
    let subtotal = 0
    state.cart.addons.forEach(addon => {
      subtotal += addon.price * addon.quantity
    })
    return subtotal
  },
  getItemSubtotal: state => {
    let subtotal = 0
    state.cart.items.forEach(item => {
      subtotal += item.price * item.quantity
    })
    return subtotal
  }
}
