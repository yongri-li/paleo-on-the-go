import { apiService } from '@shared/services'

export const _authRecover = async ({ email }) => {
  const { data } = await apiService.post('/v1/customer/recover', { data: { email } })
  const { error } = data
  return { error }
}
