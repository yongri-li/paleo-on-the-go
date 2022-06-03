export default {
  UI_SET_MODAL(state, payload) {
    console.log('asd4', state, payload)
    state.settings.preventScroll = true
    state.modal = { ...state.modal, ...payload }
  },
  UI_CLOSE_MODAL(state, payload) {
    state.modal = {
      component: false,
      content: false,
      settings: {},
      modifiers: [],
      side: 'right'
    }
  }
}
