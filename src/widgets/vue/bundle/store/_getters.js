export default {
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