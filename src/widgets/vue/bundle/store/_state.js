const { collections } = window.Scoutside.bundle

const state = {
  collections,
  cart: {
    items: []
  }
}

export default () => ({ ...state })