const {
  faqsSection,
  navigation,
  children,
  addOns,
  plans,
  account,
  types,
  masterCollections,
  wildcard
} = window.Scoutside.bundle;

const emptyBundle = {
  children: [],
  size: null,
  addOns: []
}

const selectedBundle = window.sessionStorage.getItem('ss.bundleSelections');

const bundle = selectedBundle ? JSON.parse(selectedBundle) : emptyBundle;

const planProducts = [
  {
    title: 'A La Carte',
    price: '1299',
    text: 'Min. 8 Meals per Order',
    minimum: 8
  },
  {
    title: '6 Meals',
    subscription: true,
    price: '1199',
    text: 'Subscribe & Save 8%',
    minimum: 6
  },
  {
    title: '10 Meals',
    subscription: true,
    price: '1099',
    text: 'Subscribe & Save 15%',
    minimum: 10,
    mostPopular: true
  },
  {
    title: '14 Meals',
    subscription: true,
    price: '999',
    text: 'Subscribe & Save 23%',
    minimum: 14
  },
];

const sortOptionsNewCustomer = [
  {
    title: 'Best Sellers',
    handle: 'best-seller'
  },
  {
    title: 'Top Rated',
    handle: 'top-rated'
  },
  {
    title: 'New Items',
    handle: 'new-item'
  }
];

const sortOptionsExistingCustomer = [
  {
    title: 'Best Sellers',
    handle: 'best-seller'
  },
  {
    title: 'New Items',
    handle: 'new-item'
  },
  {
    title: 'My Favorites',
    handle: 'my-favorites'
  },
  {
    title: 'Top Rated',
    handle: 'top-rated'
  },
  {
    title: 'Protein (High to Low)',
    handle: 'protein'
  },
  {
    title: 'Carbs (Low to High)',
    handle: 'carbohydrates'
  },
  {
    title: 'Calories (Low to High)',
    handle: 'calories'
  }
];

export default () => ({
  assets: window.Scoutside.assets,
  customer: window.Scoutside.customer,
  userShipZipsandCutoffs: window.Scoutside.shop,
  plans: {
    ...plans,
    products: planProducts
  },
  faqsSection,
  navigation,
  children, 
  addOns,
  wildcard,
  selectedPlan: null,
  bundle: {
    ...bundle
  },
  account,
  sortOptionsNewCustomer,
  sortOptionsExistingCustomer,
  types,
  routes: [],
  customer: {},
  activeStep: 0,
  masterCollections,
  inactiveSubscriber: false,
  inactiveSubs: false,
  isLoggedInCustomer: false,
  isSubscriber: false
})