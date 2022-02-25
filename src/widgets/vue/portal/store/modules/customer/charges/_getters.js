import { _buildCharges } from '@vue/portal/utils'
import { addDaysToDate, convertToYYYYMMDDlocalT } from '@vue/shared/utils'

export default {
  customerCharges: state => state.resources.charges,
  customerUpcomingCharge: state => {
    const { charges } = state.resources
    if (charges) {
      return charges.filter(charge => charge.status === 'QUEUED')
    }
  },
  customerUpcomingCharges: state => {
    const { charges } = state.resources
    const today = new Date()
    // const todayUTC = today.getUTCHours()
    // today.setUTCHours(todayUTC)

    if (charges) {
      return charges
        .filter(charge => {
          const chargeDay = new Date(charge.scheduled_at)
          // chargeDay.setUTCHours(10, 10, 0, 0) //5:10am EST
          // return charge.status !== 'SUCCESS' && chargeDay > today //old: addDaysToDate(today,-1)
          return charge.status !== 'SUCCESS' && chargeDay >= today
        })
        .sort((firstEl, secondEl) => {
          return firstEl.scheduled_at > secondEl.scheduled_at ? 1 : -1
        })
    }
  },
  customerCancelledCharges: state => {
    const { charges } = state.resources
    if (charges) {
      return charges.filter(charge => charge.status === 'CANCELLED')
    }
  },
  customerChargeError: state => {
    const { charges } = state.resources
    if (charges) {
      return charges.find(charge => charge.status === 'ERROR')
    }
  },
  customerChargeById: state => id => {
    const { charges } = state.resources
    if (charges) {
      return charges.find(charge => charge.id === id)
    }
  },
  customerChargesByItemId: state => id => {
    const { charges } = state.resources
    if (charges) {
      return charges.filter(charge =>
        charge.lineItems.find(lineItem => {
          return lineItem.subscriptionId === id
          // return lineItem.itemId === id
        })
      )
    }
  },
  customerChargesByAddress: state => address => {
    const { charges } = state.resources
    if (charges) {
      const addressCharges = charges.filter(charge => charge.addressId === address.id)
      return { raw: addressCharges, ..._buildCharges({ charges: addressCharges }) }
    }
  },
  customerChargeItems: (state, getters) => charge => {
    const ids = charge.lineItems.map(lineItem => lineItem.itemId)
    const subscriptions = getters.customerSubscriptionsByIds(ids)
    const onetimes = getters.customerOnetimesByIds(ids)
    return [...subscriptions, ...onetimes]
  },
  customerChargeToAddress: state => addressId => {
    const { addresses } = state.resources
    return addresses.find(address => address.id === addressId)
  }
}
