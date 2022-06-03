const state = {
  settings: { ...window.Scoutside.cart },
  modal: {
    component: false,
    content: false,
    settings: {},
    modifiers: []
  }
}

export default () => ({ ...state })
