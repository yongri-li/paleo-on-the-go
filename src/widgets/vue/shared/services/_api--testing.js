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

import axios from 'axios'
import { cookieService } from '@shared/services'
// import universalCookie from 'universal-cookie'

// const Cookies = new universalCookie()

// let allCookies

// async getHeaders(){
//   await allCookies = document.cookie
// }

// const apiKey = allCookies
//   .split('; ')
//   .find(row => row.includes('ss_api_key'))
//   ?.split('=')[1]
// const apiCustomerToken = allCookies
//   .split('; ')
//   .find(row => row.includes('ss_customer_token'))
//   ?.split('=')[1]
// const apiAccessToken = allCookies
//   .split('; ')
//   .find(row => row.includes('ss_access_token'))
//   ?.split('=')[1]

// console.log('asdasdadxxx', apiKey, apiAccessToken, apiCustomerToken)

export default class API {
  // getItem({ key }) {
  //   return Cookies.get(key)
  // }

  constructor() {
    // this.url = cookieService.getItem({ key: 'ss_api_url' })
    // this.url = allCookies.split('; ').find(row => row.includes('ss_api_url'))

    async function setHeaders() {
      const allCookies = await document.cookie

      const apiKey = await allCookies
        .split('; ')
        .find(row => row.includes('ss_api_key'))
        ?.split('=')[1]
      const apiCustomerToken = await allCookies
        .split('; ')
        .find(row => row.includes('ss_customer_token'))
        ?.split('=')[1]
      const apiAccessToken = await allCookies
        .split('; ')
        .find(row => row.includes('ss_access_token'))
        ?.split('=')[1]
    }

    setHeaders()

    console.log('asdasdadxxx2', apiKey, apiAccessToken, apiCustomerToken)

    this.url = 'https://portal-node-production.herokuapp.com'
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
    const response = axios.get(url, { headers: this.headers, params })
    console.log('responseeeee', response)
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
    console.log(response)
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

import axios from 'axios'
import { cookieService } from '@shared/services'
// import universalCookie from 'universal-cookie'

// const Cookies = new universalCookie()

let allCookiez = document.cookie
let apiKey
let apiCustomerToken
let apiAccessToken

const allCookies = async res => {
  let asd = await document.cookie
  //const asd = await document.cookie
  return asd
}

async function setApiData() {
  apiKey = await allCookies
    .split('; ')
    .find(row => row.includes('ss_api_key'))
    ?.split('=')[1]
  apiCustomerToken = await allCookies
    .split('; ')
    .find(row => row.includes('ss_customer_token'))
    ?.split('=')[1]
  apiAccessToken = await allCookies
    .split('; ')
    .find(row => row.includes('ss_access_token'))
    ?.split('=')[1]

  return
}

console.log(allCookiez)
// getCookieData()
// if (allCookies) setApiData()

// if (allCookies) console.log(allCookies, 'asdasdadxxx3', apiKey, apiAccessToken, apiCustomerToken)

export default class API {
  // getItem({ key }) {
  //   return Cookies.get(key)
  // }

  constructor() {
    // this.url = cookieService.getItem({ key: 'ss_api_url' })
    // this.url = allCookies.split('; ').find(row => row.includes('ss_api_url'))
    this.url = 'https://portal-node-production.herokuapp.com'
    this.headers = {
      'Content-Type': 'application/json; charset=utf-8',
      'X-Api-Key': apiKey,
      'X-Api-Customer-Token': apiCustomerToken,
      'X-Api-Access-Token': apiAccessToken
    }
  }
  // async url() {
  //   return (allCookies = await document.cookie)
  // }

  // async headers() {
  //   return {
  //     'Content-Type': 'application/json; charset=utf-8',
  //     'X-Api-Key': await allCookies
  //       .split('; ')
  //       .find(row => row.includes('ss_api_key'))
  //       ?.split('=')[1],
  //     'X-Api-Customer-Token': await allCookies
  //       .split('; ')
  //       .find(row => row.includes('ss_customer_token'))
  //       ?.split('=')[1],
  //     'X-Api-Access-Token': await allCookies
  //       .split('; ')
  //       .find(row => row.includes('ss_access_token'))
  //       ?.split('=')[1]
  //   }
  // }

  async get(endpoint, payload = {}) {
    const { params } = payload
    const url = `${this.url}${endpoint}`
    const response = await axios.get(url, { headers: this.headers, params })
    console.log('responseeeee', response)
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
    console.log(response)
    return response
  }
  async delete(endpoint, payload = {}) {
    const { data, params } = payload
    const url = `${this.url}${endpoint}`
    const response = await axios.delete(url, { data, headers: this.headers, params })
    return response
  }
}
