export default {
  getItemFromCartByID: (state) => (id) => {
    const productFound = state.cart.items.find(item => item.id === id)
    return productFound
  }
}