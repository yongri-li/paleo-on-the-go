import axios from 'axios'
import { cookieService } from '@shared/services'

const allCookies = document.cookie

const apiUrl = allCookies
  .split('; ')
  .find(row => row.includes('ss_api_url'))
  ?.split('=')[1]
const apiKey = allCookies
  .split('; ')
  .find(row => row.includes('ss_api_key'))
  ?.split('=')[1]
const apiCustomerToken = allCookies
  .split('; ')
  .find(row => row.includes('ss_customer_token'))
  ?.split('=')[1]
const apiAccessToken = allCookies
  .split('; ')
  .find(row => row.includes('ss_access_token'))
  ?.split('=')[1]

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
