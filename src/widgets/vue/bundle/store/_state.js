const {
  sizes,
  collections
} = window.Scoutside.bundle

const state = {
  sizes,
  collections,
  cart: {
    items: [],
  }
}

export default () => ({ ...state })