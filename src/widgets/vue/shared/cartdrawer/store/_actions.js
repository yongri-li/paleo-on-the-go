import {
  CLEAN_ALL_CART
} from './_mutations-type'

export default {
  removeProducts({commit}) {
    commit(CLEAN_ALL_CART)
  }
}