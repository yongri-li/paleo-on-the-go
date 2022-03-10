export default {
  customerSubscriptionById: state => id => {
    const { subscriptions } = state.resources
    if (subscriptions) {
      return subscriptions.find(subscription => subscription.id === id)
    }
  },
  customerSubscriptionsByIds: state => ids => {
    const { subscriptions } = state.resources
    if (subscriptions) {
      return subscriptions.filter(subscription => ids.includes(subscription.id))
    }
  },
  customerSubscriptionsByAddress: state => address => {
    const { subscriptions } = state.resources
    if (subscriptions && address) {
      return subscriptions.filter(subscription => {
        return subscription.addressId === address.id
      })
    }
  },
  customerSubscriptionsByAddressId: state => addressid => {
    const { subscriptions } = state.resources
    if (subscriptions && addressid) {
      return subscriptions.filter(subscription => {
        return subscription.addressId === addressid
      })
    }
  }
}
