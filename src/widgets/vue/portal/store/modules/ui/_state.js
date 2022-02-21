const {
  dietaryPreferences,
} = window.Scoutside.portal;

export default () => ({
  settings: {
    preventScroll: false
  },
  sidebar: {
    component: false,
    content: false,
    settings: {},
    modifiers: [],
    side: 'right'
  },
  modal: {
    component: false,
    content: false,
    settings: {},
    modifiers: []
  },
  dietaryPreferences,
  defaultMenuOpen: false,
  skipsProcessing: false,
  delvDateProcessing: false,
  noSkipsReturnedFromApp: false,
  noDFMenuReturnedFromApp: false,
  pastCutoffEST: false,
  timeEST: null
})