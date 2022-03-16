export default {
  customerOneTest: state => state.resources.orders[0],
  customerOnetimes: state => test => {
    const { onetimes } = state.resources
    return onetimes
  },
  customerOnetimeById: state => id => {
    const { onetimes } = state.resources
    if (onetimes) {
      return onetimes.find(onetime => onetime.id === id)
    }
  },
  customerOnetimesByIds: state => ids => {
    const { onetimes } = state.resources
    if (onetimes) {
      return onetimes.filter(onetime => ids.includes(onetime.id))
    }
  },
  customerOnetimesByAddress: state => address => {
    const { onetimes } = state.resources
    if (onetimes && address) {
      return onetimes.filter(subscription => {
        return subscription.addressId === address.id
      })
    }
  },
  customerOnetimesByAddressId: state => addressid => {
    const { onetimes } = state.resources
    if (onetimes && addressid) {
      return onetimes.filter(subscription => {
        return subscription.addressId === addressid
      })
    }
  }
}
