import {
  CHANGE_SIZE_SELECTED
} from './_mutations-type'

export default {
  [CHANGE_SIZE_SELECTED] (state, { val }) {
    // change current size
    const indexCurrentSize = state.sizes.findIndex(size => size.selected)
    state.sizes[indexCurrentSize].selected = false
    // active the correct size
    const indexCorrectSize = state.sizes.findIndex(size => size.val === val)
    state.sizes[indexCorrectSize].selected = true
  }
}