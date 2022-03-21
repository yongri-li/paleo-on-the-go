import dayjs from 'dayjs'

export const _buildUpdates = ({ items, action, values }) => {
  return items.map(item => {
    const { id, scheduledAt } = item
    const tomorrow = dayjs().add(1, 'day')
    let dateValue = false
    let intervalFrequency = false
    let intervalUnit = false
    switch (action) {
      case 'activate':
        return { id, status: 'ACTIVE' }
        break
      case 'cancel':
        return { id, status: 'CANCELLED' }
        break
      case 'date':
        dateValue = values.date ? values.date : tomorrow
        return { id, next_charge_scheduled_at: dayjs(dateValue).format('YYYY-MM-DDT00:00:00') }
        break
      case 'delay':
        intervalFrequency = values.frequency ? values.frequency : 1
        intervalUnit = values.unit ? values.unit : 'month'
        dateValue = scheduledAt ? dayjs(scheduledAt).add(intervalFrequency, intervalUnit) : tomorrow
        return { id, next_charge_scheduled_at: dayjs(dateValue).format('YYYY-MM-DDT00:00:00') }
        break
      default:
        return { id, ...values }
    }
  })
}
