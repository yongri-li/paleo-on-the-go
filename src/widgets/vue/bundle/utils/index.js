export const formatPrice = cents => {
  const price = (cents / 100).toFixed(2);
  return '$' + price;
}

export const handleize = string => {
  return string.replace(/\W+/g, '-').toLowerCase();
}

export const scrollToTop = ($element) => {
  $element.scroll({
    top: 0,
    behavior: 'smooth'
  })
}
