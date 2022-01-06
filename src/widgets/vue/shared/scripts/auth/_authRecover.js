import { apiService } from '@shared/services'

export const _authRecover = async({ email }) => {
  const { data } = await apiService.post('/customer/recover', { data: { email }})
  const { error } = data
  return { error }
}