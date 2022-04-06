import {
  CHANGE_FREQUENCY_SELECTED
} from './_mutations-type'

export default {
  [CHANGE_FREQUENCY_SELECTED] (state, frequency) {
    state.frequencySelected = frequency
  }
}