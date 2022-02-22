import { _buildCharges } from '@vue/portal/utils'

export default {
  customerChargesByItemId: state => id => {
    const { charges } = state.resources
    if(charges) {
      return charges.filter(charge => charge.lineItems.find(lineItem => {
        return lineItem.subscriptionId === id
      }))
    }
  },
  customerChargesByAddress: state => address => {
    const { charges } = state.resources
    if(charges) {
      const addressCharges = charges.filter(charge => charge.addressId === address.id)
      return { raw: addressCharges, ..._buildCharges({ charges: addressCharges }) }
    }
  }
}