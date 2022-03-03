export default {
  mealsAvailable: state => state.children.reduce((accumulator, collection) => accumulator + collection.products.length, 0),
  addOnsAvailable: state => state.addOns.collections.reduce((accumulator, collection) => accumulator + collection.products.length, 0),
  totalAddOns: state => state.bundle.addOns.reduce((accumulator, item) => accumulator + item.quantity, 0),
  mealsSelected: state => state.bundle.children.reduce((accumulator, child) => accumulator + child.quantity, 0),
  totalMealsSelected: state => state.bundle.children.reduce((accumulator, child) => accumulator + child.quantity, 0) + state.bundle.addOns.reduce((accumulator, child) => accumulator + child.quantity, 0),
  allProducts: state => state.children.flatMap(collection => collection.products),
  allAddOns: state => state.addOns.collections.flatMap(collection => collection.products),
  allWildcard: state => state.wildcard.collections.flatMap(collection => collection.products),
  favoritesIds: state => state.customer.tags ? state.customer.tags.filter(tag => tag.indexOf('favorite::') === 0).map(tag => Number(tag.split('favorite::')[1])) : [],
  customerGroup: state => {
    if (state.customer.nextChargeDate) {
      const chargeDay = new Date(state.customer.nextChargeDate).getDay();
      if (chargeDay >= 1 && chargeDay < 4) {
        return 'groupA';
      }
      return 'groupB';
    }
    return null;
  },
  groupChildren: (state, getters) => {
    const masterCollection = state.masterCollections[getters.customerGroup].map(id => Number(id));
    const newChildren = state.children.map(collection => {
      collection.products = collection.products.filter(product => masterCollection.includes(product.id));
      return collection;
    });
    return newChildren;
  },
  getZipShipJson: state => state.userShipZipsandCutoffs.custom_json
}
