export default {
  getProductFromCartByID: (state) => ({id, where}) => {
    const productFound = state.cart[where].find(item => item.id === id)
    return productFound
  }
}