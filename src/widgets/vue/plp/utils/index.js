export const formatPrice = cents => {
    const price = (cents / 100).toFixed(2)
    return '$' + price
}

export const handleize = string => {
    return string.replace(/\W+/g, '-').toLowerCase()
}
