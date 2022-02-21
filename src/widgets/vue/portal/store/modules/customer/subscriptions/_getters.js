export default {
  customerSubscriptions: state => state.resources.subscriptions,
  customerSubscriptionById: state => id => {
    const { subscriptions } = state.resources
    if(subscriptions) {
      return subscriptions.find(subscription => subscription.id === id)
    }
  },
  customerSubscriptionsByIds: state => ids => {
    const { subscriptions } = state.resources
    if(subscriptions) {
      return subscriptions.filter(subscription => ids.includes(subscription.id))
    }
  },
  customerSubscriptionsByAddress: state => addressId => {
    const { subscriptions } = state.resources
    if(subscriptions && addressId) {
      return subscriptions.filter(subscription => {
        return subscription.addressId === addressId
      })
    }
  },
  customerSubscriptionsByBundle: state => id => {
    const { subscriptions } = state.resources
    const bundleChildren = subscriptions.filter(subscription => {
      return subscription.properties.find(property => {
        return property.name === 'bundle_type' && property.value === 'child'
      })
    })
    return bundleChildren.filter(bundleChild => {
      return bundleChild.properties.find(property => {
        return property.name === 'bundle_id' && property.value === id
      })
    })
  }
}