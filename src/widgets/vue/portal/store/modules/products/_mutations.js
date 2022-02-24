export default {
  PRODUCTS_SET_CATALOG(state, payload) {
    const { catalog } = payload
    if (catalog) state.catalog = [...catalog]
  },
  PRODUCTS_SET_INVENTORY(state, payload) {
    const { inventory } = payload
    if (inventory) state.inventory = { ...inventory }
  }
  // SET_DEFAULT_MENU_ITEMS(state, payload) {
  //   state.defaultMenuItems = payload;
  // }
}
