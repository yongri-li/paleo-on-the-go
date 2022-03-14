export default {
  getItemFromCartByID: (state) => (id) => {
    const productFound = state.cart.items.find(item => item.id === id)
    return productFound
  },
  getSizeSelected: (state) => {
    const sizeFound = state.sizes.find(size => size.selected)
    return sizeFound.val
  }
}