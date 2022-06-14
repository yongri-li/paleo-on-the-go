import { parseItemsFromPrebuilt } from '../../../utils'
const { sizes, prebuilt, mealcart } = window.Scoutside.bundle

const state = {
  // cart: {
  //   items: [],
  //   addons: []
  // },
  sizes,
  prebuilt: {
    content: prebuilt.content,
    items: parseItemsFromPrebuilt(prebuilt.items),
    cleared: false
  },
  modal: {
    subscription: {
      title: mealcart.content.title_popup_onetime_subscription,
      description: mealcart.content.description_popup_onetime_subscription
    },
    onetime: {
      title: mealcart.content.title_popup_subscription_onetime,
      description: mealcart.content.description_popup_subscription_onetime
    }
  }
}

export default () => ({ ...state })
