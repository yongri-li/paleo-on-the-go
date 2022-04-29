import { parseItemsFromPrebuilt } from '../../../utils'
const { sizes, prebuilt } = window.Scoutside.bundle

const state = {
  // cart: {
  //   items: [],
  //   addons: []
  // },
  sizes,
  prebuilt: {
    content: prebuilt.content,
    items: parseItemsFromPrebuilt(prebuilt.items)
  }
}

export default () => ({ ...state })