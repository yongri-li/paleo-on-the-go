import { sortProducts } from '@shared/utils'

export default {
  getProductsFromRoute: (state) => ($route) => {
    const param = $route.params.box
    const collectionFound = state.collections.find(collection => collection.url === param)
    let products = !!collectionFound ? collectionFound.products : state.collections[0].products

    const queryRouter = $route.query
    const keys = Object.keys(queryRouter)
    keys.forEach(key => {
      if(queryRouter[key]) {
        const valSplit = queryRouter[key].split(',')
        if(key === 'preference' || key === 'product_type') {
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
  getProductFromCollectionsByIDs: (state) => ({idCollection, idProduct}) => {
    const collectionFound = state.collections.find(collection => collection.id === idCollection)
    const productFound = collectionFound.products.find(product => product.id === idProduct)
    return productFound
  },
  getFirstProductFromCollectionsByID: (state) => (idProduct) => {
    const collectionFound = state.collections.find(collection => collection.products.find(product => product.id == idProduct))
    let productFound = {}
    if(!!collectionFound) {
      productFound = collectionFound.products.find(product => product.id == idProduct)
    }
    return productFound
  }
}