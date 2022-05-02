import { apiService } from '@shared/services'

export const _authRecover = async ({ email }) => {
  const apiClient = new apiService()
  const { data } = await apiClient.post('/v1/customer/recover', { data: { email } })
  const { error } = data
  return { error }
}
