export const _filterItemsByAddOns = (items) => {
  return items.filter(item => item.properties.find(property => property.name === "_addOn"));
}

export const _filterItemsBySubscription = (items) => {
  return items.filter(item => !item.properties.find(property => property.name === "_addOn"));
}
