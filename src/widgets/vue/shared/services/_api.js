import axios from 'axios'
import { cookieService } from '@shared/services'
import { setIntervalAsync } from 'set-interval-async/dynamic'

const allCookies = document.cookie
const getApiData = (cookie, ssdata) => {
  return cookie
    .split('; ')
    .find(row => row.includes(ssdata))
    ?.split('=')[1]
}
const lsAccToken = localStorage.getItem('api_access_token')
const apiUrl = getApiData(allCookies, 'ss_api_url')
const apiKey = getApiData(allCookies, 'ss_api_key')
const apiCustomerToken = getApiData(allCookies, 'ss_customer_token')
let apiAccessToken = getApiData(allCookies, 'ss_access_token')
if (!apiAccessToken) apiAccessToken = lsAccToken

export default class API {
  constructor() {
    this.url = decodeURIComponent(apiUrl)
    this.headers = {
      'Content-Type': 'application/json; charset=utf-8',
      'X-Api-Key': apiKey,
      'X-Api-Customer-Token': apiCustomerToken,
      'X-Api-Access-Token': apiAccessToken
    }
    // this.headers = {
    //   'Content-Type': 'application/json; charset=utf-8',
    //   'X-Api-Key': cookieService.getItem({ key: 'ss_api_key' }),
    //   'X-Api-Customer-Token': cookieService.getItem({ key: 'ss_customer_token' }),
    //   'X-Api-Access-Token': cookieService.getItem({ key: 'ss_access_token' })
    // }
  }
  async get(endpoint, payload = {}) {
    const { params } = payload
    const url = `${this.url}${endpoint}`
    const response = await axios.get(url, { headers: this.headers, params })
    return response
  }
  async post(endpoint, payload = {}) {
    const { data, params } = payload
    const url = `${this.url}${endpoint}`
    const response = await axios.post(url, data, { headers: this.headers, params })
    return response
  }
  async put(endpoint, payload = {}) {
    const { data, params } = payload
    const url = `${this.url}${endpoint}`
    const response = await axios.put(url, data, { headers: this.headers, params })
    return response
  }
  async delete(endpoint, payload = {}) {
    const { data, params } = payload
    const url = `${this.url}${endpoint}`
    const response = await axios.delete(url, { data, headers: this.headers, params })
    return response
  }
}

// import axios from 'axios'
// import { cookieService } from '@shared/services'

// export default class API {
//   async url () {
//     return await cookieService.getItem({ key: 'ss_api_url' })
//   }
//   async headers () {
//     return {
//       "Content-Type": "application/json; charset=utf-8",
//       "X-Api-Key": await cookieService.getItem({ key: 'ss_api_key' }),
//       "X-Api-Customer-Token": await cookieService.getItem({ key: 'ss_customer_token' }),
//       "X-Api-Access-Token": await cookieService.getItem({ key: 'ss_access_token' })
//     }
//   }
//   async get (endpoint, payload = {}) {
//     const { params } = payload
//     const baseUrl = await this.url()
//     const url = `${baseUrl}${endpoint}`
//     const headers = await this.headers()
//     const response = await axios.get(url, { headers, params })
//     return response
//   }
//   async post (endpoint, payload = {}) {
//     const { data, params } = payload
//     const baseUrl = await this.url()
//     const url = `${baseUrl}${endpoint}`
//     const headers = await this.headers()
//     const response = await axios.post(url, data, { headers, params })
//     return response
//   }
//   async put (endpoint, payload = {}) {
//     const { data, params } = payload
//     const baseUrl = await this.url()
//     const url = `${baseUrl}${endpoint}`
//     const headers = await this.headers()
//     const response = await axios.put(url, data, { headers, params })
//     return response
//   }
//   async delete (endpoint, payload = {}) {
//     const { data, params } = payload
//     const baseUrl = await this.url()
//     const url = `${baseUrl}${endpoint}`
//     const headers = await this.headers()
//     const response = await axios.delete(url, { headers, params })
//     return response
//   }
// }
