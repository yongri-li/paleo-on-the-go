export const formatPrice = cents => {
  const price = (cents / 100).toFixed(2)
  return '$' + price
}

export const formatPriceToNumber = cents => {
  const price = (cents / 100).toFixed(2)
  return price
}

export const handleize = string => {
  return string.replace(/\W+/g, '-').toLowerCase()
}

export const convertDayToNum = day => {
  const dayToNumTable = {
    sunday: 7,
    monday: 1,
    tuesday: 2,
    wednesday: 3,
    thursday: 4,
    friday: 5,
    saturday: 6
  }
  return dayToNumTable[day]
}

export const cnvtDayToNum0 = day => {
  const dayToNumTable = {
    sunday: 0,
    monday: 1,
    tuesday: 2,
    wednesday: 3,
    thursday: 4,
    friday: 5,
    saturday: 6
  }
  return dayToNumTable[day]
}

export const convertNumberToDay = num => {
  const dayToNumTable = {
    7: 'Sunday',
    0: 'Sunday',
    1: 'Monday',
    2: 'Tuesday',
    3: 'Wednesday',
    4: 'Thursday',
    5: 'Friday',
    6: 'Saturday'
  }
  return dayToNumTable[num]
}

export const areSortedArraysEqual = (a, b) => {
  const aa = [...a].sort()
  const bb = [...b].sort()
  return aa.length === bb.length && aa.every((val, i) => val === bb[i])
}

export const setNextCutoffDate = date => {
  const deliveryDate = new Date(date)
  const nextChargeDay = new Date(deliveryDate)
  const delvDay = deliveryDate.getDay()
  let num

  delvDay >= 3 ? (num = 0) : (num = -4)

  nextChargeDay.setDate(nextChargeDay.getDate() - delvDay + num)
  new Date(deliveryDate)
  return new Date(nextChargeDay)
}

// getWeekFromDate
export const setNewDateAheadofDate = (datee, num) => {
  const date = new Date(datee)
  const selMonth = date.getMonth()
  const newDate = date.getDate()
  const d = new Date()
  const month = d.getMonth() + 1
  const year = d.getFullYear()
  const thismnth = d.getMonth()
  const daysInMonth = new Date(year, month, 0).getDate()
  selMonth > thismnth ? d.setDate(newDate + daysInMonth + num) : d.setDate(newDate + num)
  return d
}

export const setNewDateAheadofDateT = (datee, num) => {
  const date = new Date(datee)
  const selMonth = date.getMonth()
  const newDate = date.getDate()
  const d = new Date()
  const month = d.getMonth() + 1
  const year = d.getFullYear()
  const thismnth = d.getMonth()
  const daysInMonth = new Date(year, month, 0).getDate()
  selMonth > thismnth ? d.setDate(newDate + daysInMonth + num) : d.setDate(newDate + num)

  const dateStr = d.toISOString()
  const dateOnly = dateStr.split('T')[0]
  let timeOnly = dateStr.split('T')[1]
  timeOnly = 'T00:00:00'
  const fourWeeksAhead = dateOnly + timeOnly
  return fourWeeksAhead
  // return d;
}

export const setOneMonthAhead = datee => {
  const date = new Date(datee)
  const newDate = date.getDate()
  const d = new Date()
  const month = d.getMonth() + 1
  const year = d.getFullYear()
  const thismnth = d.getMonth()
  const daysInMonth = new Date(year, month, 0).getDate()
  d.setDate(newDate + daysInMonth)
  const dateStr = d.toISOString()
  const dateOnly = dateStr.split('T')[0]
  let timeOnly = dateStr.split('T')[1]
  timeOnly = 'T00:00:00'
  const monthAhead = dateOnly + timeOnly
  return monthAhead
}

export const convertDateToDDMMYYYY = datee => {
  const date = new Date(datee)
  let year = date.getFullYear()
  let month = (1 + date.getMonth()).toString().padStart(2, '0')
  let day = date.getDate().toString().padStart(2, '0')
  return month + '-' + day + '-' + year
}

export const convertToYYYYMMDDlocalT = datee => {
  const date = datee.toString()

  if (date.length > 20) {
    const thisdate = new Date(datee)
    const toISO = new Date(thisdate.getTime() - thisdate.getTimezoneOffset() * 60000).toISOString()
    //const toISO = new Date(datee).toISOString()
    const isoDate = toISO.split('T')[0]
    return isoDate + 'T00:00:00'
  } else {
    const month = date.split('-')[0]
    const day = date.split('-')[1]
    const year = date.split('-')[2]
    return year + '-' + month + '-' + day + 'T00:00:00'
  }
}

export function getWeekStart(date) {
  const newDate = new Date(date)
  const diff = newDate.getDate() - newDate.getDay()
  return new Date(newDate.setDate(diff))
}

export function startOfLastWeek(datee) {
  const d = new Date()
  const date = new Date(datee)
  const selMonth = date.getMonth() + 1
  const month = d.getMonth() + 1
  const year = d.getFullYear()
  const diff = date.getDate() - date.getDay() - 7

  const daysInMonth = new Date(year, month, 0).getDate()

  let weekStart
  selMonth > month
    ? (weekStart = new Date(d.setDate(diff + daysInMonth)))
    : (weekStart = new Date(d.setDate(diff)))
  return weekStart
}

export const calcDatesDiff = (date1, date2) => {
  const day1 = new Date(date1)
  const day2 = new Date(date2)
  let int

  day2 > day1 ? (int = 1) : (int = -1)

  const difference = Math.abs(day2 - day1) * int
  const days = difference / (1000 * 3600 * 24)
  return days
}

export const addDaysToDate = (date, days) => {
  let res = new Date(date)
  new Date(res.setDate(res.getDate() + days))
  return new Date(res)
}

export const delay = async ms => {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export function warningPop(e) {
  e.preventDefault()
  e.returnValue = 'Unsaved Changes are still Processing. Please wait'
}

export function stillProcessingWarningPopup() {
  window.addEventListener('beforeunload', warningPop)
}

export function removeReloadWarning() {
  window.removeEventListener('beforeunload', warningPop)
}

export const sortProducts = ({ products, sortType }) => {
  if (sortType) {
    sortType = sortType.toLowerCase().replace(/ /g, '-')

    if (sortType === 'newest') {
      products.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    }
  }

  return products
}

export const getPriceWithDiscount = ({ price, discount }) => {
  discount = discount / 100
  return price * (1 - discount)
}

export const getOutOfStock = ({tags, inventoryData}) => {
  let inventoryTag = 0
  const indexFound = tags.findIndex(tag => tag.includes('inventory_'))
  if(indexFound > -1) {
    inventoryTag = tags[indexFound].replace('inventory_','')
  }

  const diff = parseInt(inventoryData) - parseInt(inventoryTag)
  return diff < 0
}

export const notScrollBody = (state = true) => {
  const body = document.querySelector('body')
  if(state) {
    body.style.overflow = 'hidden'
  }
  else {
    body.style.overflow = 'initial'
  }
}