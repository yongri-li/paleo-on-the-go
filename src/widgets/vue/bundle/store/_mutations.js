export default {
  BUNDLE_SELECT_PLAN(state, plan) {
    state.selectedPlan = plan;
  },
  BUNDLE_SET_SELECTED(state, bundle) {
    state.bundle = bundle;
    console.log(state.bundle)
  },
  BUNDLE_SET_ORIGINAL_SELECTIONS(state, selections) {
    state.originalSelections = selections;
  },
  BUNDLE_CHANGE_ACTIVE_STEP(state, payload) {
    const [stepIndex, direction] = payload;
    switch (direction) {
      case 'inc':
        state.activeStep++;
        break;
      case 'dec':
        state.activeStep--;
        break;
      default:
        state.activeStep = stepIndex;
    }
  },
  BUNDLE_SET_INACTIVE_SUBSCRIBER(state, status){
    state.inactiveSubscriber = status;
  },
  BUNDLE_SET_ISSUBSCRIBER(state, status){
    state.isSubscriber = status;
  },  
  // BUNDLE_SET_INACTIVE_SUBS(state, status){
  //   state.isInactiveSubs = status;
  // },
  BUNDLE_SET_EXISTING_CUSTOMER(state, status){
    state.isLoggedInCustomer = status;
  },
  BUNDLE_ADD_CHILD(state, product) {
    const children = state.bundle.children;
    const index = children.findIndex(child => {
      return child.id === product.id
    });
    if (index > -1) {
      children[index] = product
    } else {
      let item = product;
      if (!item.quantity) {
        item.quantity = 1;
      }
      children.push(item);
    }
    state.bundle.children = [...children];
  },
  BUNDLE_REMOVE_CHILD(state, product) {
    const children = state.bundle.children;
    const index = children.findIndex((child) => {
      return child.id === product.id
    })
    if (index > -1) {
      children.splice(index, 1)
    }
    state.bundle.children = [...children];
  },
  BUNDLE_UPSELL_OPTIN(state, payload) {
    const { item, upsellId } = payload;
    const children = state.bundle.children;
    const index = children.findIndex(child => {
      return child.id === item.id
    });
    children[index] = {
      ...item,
      upsellId
    };
    state.bundle.children = [...children];
  },
  BUNDLE_UPSELL_OPTOUT(state, item) {
    const children = state.bundle.children;
    const index = children.findIndex(child => {
      return child.id === item.id
    });
    children[index] = {
      ...item,
    };
    state.bundle.children = [...children];
  },
  BUNDLE_CLEAR_CHILDREN(state) {
    state.bundle.children = [];
  },
  BUNDLE_ADD_ADDON(state, product) {
    const addOns = state.bundle.addOns;
    const index = addOns.findIndex((addOn) => {
      return addOn.id === product.id
    })
    if (index > -1) {
      addOns[index] = product
    // } else {
    //   let item = product;
    //   item.quantity = 1;
    //   addOns.push(item);
    // }
    } else {
      let item = product;
      if (!item.quantity) {
        item.quantity = 1;
      }
      addOns.push(item);
    }    
    state.bundle.addOns = [...addOns];
  },


  BUNDLE_REMOVE_ADDON(state, product) {
    const addOns = state.bundle.addOns;
    const index = addOns.findIndex((addOns) => {
      return addOns.id === product.id
    })
    if (index > -1) {
      addOns.splice(index, 1)
    }
    state.bundle.addOns = [...addOns];
  },
  BUNDLE_SET_MODAL(state, payload) {
    state.modal = { ...payload }
  },
  BUNDLE_SET_ROUTES(state, routes) {
    state.routes = [...routes];
  },
  BUNDLE_SET_CUSTOMER(state, customer) {
    state.customer = customer;
  }
}