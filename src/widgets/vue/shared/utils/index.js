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

export const beforeOrAfterCutoffTime = () => {
  // if before cutoffday or on cutoffday but before cutoff time: before
  // otherwise, after cuttoff
  // set and use these global valirables
}

export const getDeliveryDaysByZip = (userZip, zipTable) => {
  const zipToJson = JSON.parse(zipTable)
  const zipData = Object.entries(zipToJson)
  var deliveryDay1, deliveryDay2

  let userInfoByZip = Object.entries(zipData).filter(function(o) {
    return userZip <= o[1][1]['zip_1'] && userZip >= o[1][1]['zip_0']
  })

  if (userInfoByZip.length > 0) {
    deliveryDay1 = userInfoByZip[0][1][1]['delivery_day1']
    deliveryDay2 = userInfoByZip[0][1][1]['delivery_day2']
  }

  let shipDays1 = deliveryDay1.includes(',') ? deliveryDay1.split(',') : deliveryDay1
  let shipDays2 = deliveryDay2.includes(',') ? deliveryDay2.split(',') : deliveryDay2
  let shipDays1t = Array.isArray(shipDays1) ? shipDays1.map(trm => trm.trim()) : shipDays1
  let shipDays2t = Array.isArray(shipDays2) ? shipDays2.map(trm => trm.trim()) : shipDays2

  const allShipDays = Array.isArray(shipDays1t)
    ? shipDays1t.concat(shipDays2t)
    : shipDays1t.split(',').concat(shipDays2t)

  const shipNums = allShipDays.map(day => cnvtDayToNum0(day))

  return shipNums
}

export const getChargeDaysByUserZip = (userZip, ziptable, delivdate) => {
  // const userZip = sessionStorage.getItem(localstoragezip)
  const zipToJson = JSON.parse(ziptable)
  const zipData = Object.entries(zipToJson)
  var deliveryDay1, deliveryDay2, chargeDay1, chargeDay2
  delivdate = delivdate.toLowerCase()

  let userInfoByZip = Object.entries(zipData).filter(function(o) {
    return userZip <= o[1][1]['zip_1'] && userZip >= o[1][1]['zip_0']
  })

  if (userInfoByZip.length > 0) {
    deliveryDay1 = userInfoByZip[0][1][1]['delivery_day1']
    deliveryDay2 = userInfoByZip[0][1][1]['delivery_day2']
    chargeDay1 = userInfoByZip[0][1][1]['charge_day1']
    chargeDay2 = userInfoByZip[0][1][1]['charge_day2']
  }

  let shipDays1 = deliveryDay1.includes(',') ? deliveryDay1.split(',') : deliveryDay1
  let shipDays2 = deliveryDay2.includes(',') ? deliveryDay2.split(',') : deliveryDay2
  let shipDays1t = Array.isArray(shipDays1) ? shipDays1.map(trm => trm.trim()) : shipDays1
  let shipDays2t = Array.isArray(shipDays2) ? shipDays2.map(trm => trm.trim()) : shipDays2

  if (shipDays1t.includes(delivdate)) {
    return chargeDay1
  }
  if (shipDays2t.includes(delivdate)) {
    return chargeDay2
  }
}

export const zipAllowsCustomNote = (jsonnotes, storedzip) => {
  const zipObjs = JSON.parse(jsonnotes)
  const zipList = Object.entries(zipObjs)
  let checkByZip

  const checkIfZipAllowsNotes = (data, userzip) => {
    checkByZip = Object.entries(data).filter(function(o) {
      if (userzip <= o[1][1]['zip_1'] && userzip >= o[1][1]['zip_0']) {
        return o[0]
      } else {
        return false
      }
    })
  }

  checkIfZipAllowsNotes(zipList, storedzip)
  return checkByZip.length ? true : false
}

// checks if it is cutofd day and if past 6pm est. if so, greys out upcoming pending charge
// export const isPastCutoffDayTime = (cutoffdate, pastcuttrue) => {
export const isPastCutoffDayTime = cutoffdate => {
  const date = new Date()
  const today = date.getDay()
  const cutoffday = new Date(cutoffdate).getDay()
  const nowEST = date.getUTCHours() - 4

  if (today === cutoffday && (nowEST > 14 || nowEST <= 3)) {
    setTimeout(function checkTime() {
      if (nowEST >= 15 || nowEST <= 3) {
        alert('asdasd')
        return true
      }
      setTimeout(checkTime, 3000)
    }, 500)
  }
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
  let day = date
    .getDate()
    .toString()
    .padStart(2, '0')
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

export const shipDateBasedOnCharge = (chargeDate, shipDay) => {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

  const shipDayNumber = days.indexOf(shipDay)
  const newDate = new Date(chargeDate)
  const diff = newDate.getDate() - newDate.getDay()
  const weekStart = new Date(newDate.setDate(diff))
  const addNum = shipDayNumber < 3 ? 7 : 0
  const newDelvDate = new Date(weekStart.setDate(weekStart.getDate() + (shipDayNumber + addNum)))

  return newDelvDate
}

export const nextDelvBasedOnCharge = (chargeDate, shipDay) => {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

  const today = new Date()
  const todayNum = today.getDay()
  const shipDayNumber = days.indexOf(shipDay)
  const newDate = new Date(chargeDate)
  const diff = newDate.getDate() - newDate.getDay()
  const weekStart = new Date(newDate.setDate(diff))
  const num = shipDayNumber < 3 ? 7 : 0
  const addNum = todayNum > 3 || todayNum === 0 ? num + 7 : num
  const newDelvDate = new Date(weekStart.setDate(weekStart.getDate() + (shipDayNumber + addNum)))

  return newDelvDate
}

export const nextChrgAndDelvDateBasedOnDelvDay = shipDay => {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  const shipA = [0, 1, 2]
  const monTue = [1, 2]

  const today = new Date()
  const todayNum = today.getDay()
  const nowUTC = today.getUTCHours()
  const nowEST = nowUTC < 5 ? nowUTC + 24 - 5 : nowUTC - 5

  const shipDayNum = days.indexOf(shipDay)
  const chrgDayNum = shipA.includes(shipDayNum) ? 4 : 1

  const diff = today.getDate() - today.getDay()
  const weekStart = new Date(today.setDate(diff))
  const weekStart2 = new Date(today.setDate(diff))
  const num = shipDayNum < 3 || (shipDayNum >= 3 && monTue.includes(todayNum)) ? 7 : 0
  const addNum = todayNum > 3 || todayNum === 0 ? num + 7 : num
  const addCnum = (chrgDayNum === 4 && todayNum < 3) || (chrgDayNum === 1 && todayNum < chrgDayNum) ? 0 : 7

  // (chrgDayNum === 4 && todayNum < 3) ||
  // (chrgDayNum === 4 && todayNum === 4 && nowEST < 10) ||
  // (chrgDayNum === 1 && todayNum < chrgDayNum) ||
  // (chrgDayNum === 1 && todayNum === 1 && nowEST < 10)
  //   ? 0
  //   : 7

  // add one more OR above for when wed (3 day) after 6pm est

  console.log(shipDayNum, chrgDayNum, addNum, diff, addCnum, weekStart)
  const newDelvDate = new Date(weekStart.setDate(weekStart.getDate() + (shipDayNum + addNum)))
  const newChrgDate = new Date(weekStart2.setDate(weekStart2.getDate() + (chrgDayNum + addCnum)))

  return [newChrgDate, newDelvDate]
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

export const sortProducts = ({products, sortType}) => {
  if(sortType) {
    sortType = sortType.toLowerCase().replace(/ /g,'-')

    if(sortType === 'newest') {
      products.sort((a,b) => new Date(b.created_at) - new Date(a.created_at))
    }
  }

  return products
}

export const getPriceWithDiscount = ({price, discount}) => {
  discount = discount / 100
  return price * (1 - discount)
}