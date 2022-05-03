import {
  FILTER_TOGGLE_ACTIVE,
  CLEAN_ALL_FILTERS
} from './_mutations-type'

export default {
  [FILTER_TOGGLE_ACTIVE] (state, { tag, active }) {
    const indexFound = state.filters.findIndex(filter => filter.tag === tag)
    if(indexFound > -1) {
      state.filters[indexFound].active = active
    }
  },
  [CLEAN_ALL_FILTERS] (state) {
    state.filters.forEach(filter => {
      filter.active = false
    })
  }
}