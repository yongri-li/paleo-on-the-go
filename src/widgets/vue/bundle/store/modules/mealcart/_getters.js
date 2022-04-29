export default {
  getSizeSelected: (state) => {
    const sizeFound = state.sizes.find(size => size.selected)
    return sizeFound
  },
  getLengthAndTypeCart: (state, getters, rootState) => {
    const cartLength = rootState.babcart.cart.items.length
    const sizeFound = state.sizes.find(size => size.selected)
    return {
      length: cartLength,
      orderType: sizeFound.order_type
    }
  },
  getPrebuiltByBox: (state) => (sizeNumber) => {
    const prebuiltFilter = state.prebuilt.items.filter(box => box.products.find(product => product.size == sizeNumber))

    const options = prebuiltFilter.length ? prebuiltFilter : []
    return options
  },
  getProductPrebuilt: (state) => ({ bundlename, size }) => {
    const boxFound = state.prebuilt.items.find(box => box.bundlename === bundlename)
    const productsFound = boxFound.products.find(product => product.size == size)
    return productsFound.list
  }
}