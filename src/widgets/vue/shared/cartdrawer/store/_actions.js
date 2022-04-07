import {
  ADD_BOX_TO_CART,
  SET_SIZE_SELECTED
} from './_mutations-type'

export default {
  async setDataFromBox({ commit }, { items, addons, sizeSelected }) {
    let products = items.map(item => (
      {
        ...item,
        order_type: sizeSelected.order_type
      }
    ))
    addons.forEach(item => {
      products.push({
        ...item,
        order_type: 'addons'
      })
    })

    commit(ADD_BOX_TO_CART, { items: products })
    commit(SET_SIZE_SELECTED, { sizeSelected })
  }
}