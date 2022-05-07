import { apiService } from '@shared/services'

export const _authRecover = async ({ email }) => {
  const apiClient = new apiService()
  const { data } = await apiClient.post('/v1/customer/recover', { data: { email } })
  const { error } = data
  return { error }
}

// import axios from 'axios'

// export const _authRecover = async ({ email }) => {
//   const payload = {
//     email,
//     form_type: 'recover_customer_password'
//   }
//   const response = await axios.post('/account/recover', payload)
//   return response
// }
