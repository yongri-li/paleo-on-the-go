import router from '../_router'

export const formatPrice = cents => {
  const price = (cents / 100).toFixed(2);
  return '$' + price;
}

export const changeRouter = param => {
  const currentParam = router.history.current.params.box

  if(param !== 'addons' && param !== currentParam) {
    router.push(param)
    return true
  }

  return false
}

export const sortProducts = ({products, sortType}) => {
  if(sortType) {
    sortType = sortType.toLowerCase().replace(/ /g,'-')

    if(sortType === 'newest') {
      products.sort((a,b) => new Date(b.created_at) - new Date(a.created_at))
    }
  }

  return products
}