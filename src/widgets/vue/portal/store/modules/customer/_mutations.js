import addressesMutations from './addresses/_mutations'
import chargesMutations from './charges/_mutations'
import onetimesMutations from './onetimes/_mutations'
import subscriptionsMutations from './subscriptions/_mutations'

export default {
  CUSTOMER_SET_READY(state) {
    state.ready = true
  },
  CUSTOMER_SET_GOOOP(state, payload) {
    state.gooop = { ...payload };
  },
  CUSTOMER_SET_DELIVERYDAYS(state, payload) {
    state.deliverydays = [ ...payload ];
  },  
  CUSTOMER_SET_DDAY(state, payload) {
    state.setdday = payload;
  },  
  CUSTOMER_SET_NEWSELECTEDMENU(state, payload) {
    state.isNewSelected = payload;
  },   
  CUSTOMER_SET_DELIVERYDAY(state, payload) {
    state.deliveryday = payload;
  },    
  CUSTOMER_SET_DELIVERYDATE(state, payload) {
    state.deliverydate = payload;
  }, 
  CUSTOMER_SET_RECHARGE(state, payload) {
    if(payload) state.recharge = { ...payload }
  },
  CUSTOMER_SET_SHOPIFY(state, payload) {
    if(payload) state.shopify = { ...payload }
  },
  CUSTOMER_SET_NEXTSKIPPED(state, payload) {
    state.isNextSkipped = payload;
  },
  CUSTOMER_SET_NEXTCHRGDATE(state, payload) {
    state.nextSchChrgDate = payload;
  },    
  CUSTOMER_SET_RESOURCES(state, payload) {
    if(payload) state.resources = { ...state.resources, ...payload }
  },
  ...addressesMutations,
  ...chargesMutations,
  ...onetimesMutations,
  ...subscriptionsMutations
}