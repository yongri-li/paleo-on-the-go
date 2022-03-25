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