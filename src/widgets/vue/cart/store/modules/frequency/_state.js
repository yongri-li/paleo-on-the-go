const state = {
  frequencies: [
    {
      label: 'Ships Every 2 Weeks',
      labelOption: '2 Weeks',
      week: 2
    },
    {
      label: 'Ships Every 4 Weeks',
      labelOption: '4 Weeks',
      week: 4
    },
    {
      label: 'Ships Every 6 Weeks',
      labelOption: '6 Weeks',
      week: 6
    },
    {
      label: 'Ships Every 8 Weeks',
      labelOption: '8 Weeks',
      week: 8
    }
  ],
  frequencySelected: {
    label: 'Ships Every 2 Weeks',
    labelOption: '2 Weeks',
    week: 2
  }
}

export default () => ({ ...state })
