export default {
  getProductFromCollectionsByIDs: (state) => ({idCollection, idProduct}) => {
    const collectionFound = state.collections.find(collection => collection.id === idCollection)
    const productFound = collectionFound.products.find(product => product.id === idProduct)
    return productFound
  },
  getItemFromCartByID: (state) => (id) => {
    const productFound = state.cart.items.find(item => item.id === id)
    return productFound
  },
  getSizeSelected: (state) => {
    const sizeFound = state.sizes.find(size => size.selected)
    return sizeFound
  },
  getPrebuiltByBox: (state) => (sizeNumber) => {
    const prebuiltFilter = state.prebuilt.items.filter(box => box.products.find(product => product.size == sizeNumber))

    const options = prebuiltFilter.length ? prebuiltFilter : []
    return options
  },
}