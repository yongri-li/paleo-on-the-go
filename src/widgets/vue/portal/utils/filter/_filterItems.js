export const _filterItemsByAddOns = items => {
  return items.filter(item => item.properties.find(property => property.name === '_addOn'))
}

export const _filterItemsBySubscription = items => {
  return items.filter(item => !item.properties.find(property => property.name === '_addOn'))
}

export const _filterItemsByStatus = ({ items, status }) => {
  return items.filter(item => {
    const cancelled = item.status === 'CANCELLED'
    const noCharge = item.scheduledAt === null
    if (status === 'active') return !cancelled && !noCharge
    if (type === 'inactive') return cancelled || noCharge
  })
}

export const _filterTest = item => item * 3
