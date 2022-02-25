export default {
  UI_SET_SIDEBAR(state, payload) {
    state.settings.preventScroll = true
    state.sidebar = { ...state.sidebar, ...payload }
  },
  UI_CLOSE_SIDEBAR(state, payload) {
    state.sidebar = { 
      component: false, content: false, settings: {},
      modifiers: [], side: 'right' 
    }
    if(!state.modal.component) state.settings.preventScroll = false
  }
}