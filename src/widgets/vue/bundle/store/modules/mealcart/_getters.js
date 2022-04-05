export default {
  getProductFromCartByID: (state) => ({id, where}) => {
    const productFound = state.cart[where].find(item => item.id === id)
    return productFound
  },
  getSizeSelected: (state) => {
    const sizeFound = state.sizes.find(size => size.selected)
    return sizeFound
  },
  getLengthAndTypeCart: (state) => {
    const cartLength = state.cart.items.length
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