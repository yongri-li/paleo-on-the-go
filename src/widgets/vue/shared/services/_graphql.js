import axios from 'axios'

export default class GRAPHQL {
  constructor() {
    this.url = '/api/2020-07/graphql.json'
    this.headers = {
      'x-shopify-storefront-access-token': window.Scoutside.api.storefront_token,
      accept: 'application/json',
      'content-type': 'application/graphql'
    }
  }
  async post(payload = {}) {
    const { query, params } = payload
    const response = await axios.post(this.url, query, { headers: this.headers, params })
    return response
  }
}
