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
  },
  UI_SET_MODAL(state, payload) {
    state.settings.preventScroll = true
    state.modal = { ...state.modal, ...payload }
  },
  UI_CLOSE_MODAL(state, payload) {
    state.modal = { 
      component: false, content: false, settings: {},
      modifiers: [], side: 'right' 
    }
    if(!state.sidebar.component) state.settings.preventScroll = false
  },
  UI_TOGGLE_DEFAULT_MENU(state, bool) {
    state.defaultMenuOpen = bool;
  },
  UI_TOGGLE_SKIP_PROCESSING(state, bool) {
    state.skipsProcessing = bool;
  },
  UI_TOGGLE_DELVDATE_PROCESSING(state, bool) {
    state.delvDateProcessing = bool;
  },    
  UI_TOGGLE_NO_SKIPS_RETURNED(state, bool) {
    state.noSkipsReturnedFromApp = bool;
  },    
  UI_TOGGLE_NO_DFMENU_RETURNED(state, bool) {
    state.noDFMenuReturnedFromApp = bool;
  },    
  UI_TOGGLE_DIETARY_PREFERENCES(state, bool) {
    state.dietPreferencesOpen = bool;
  },
  UI_PAST_CUTOFF_EST(state, bool) {
    state.pastCutoffEST = bool;
  },  
  UI_SET_TIME_EST(state, payload) {
    state.timeEST = payload;
  } 
}