const state = {
  frequencies: [
    {
      label: 'Ships Every 2 Week',
      labelOption: '2 Week',
      week: 2
    },
    {
      label: 'Ships Every 4 Week',
      labelOption: '4 Week',
      week: 4
    },
    {
      label: 'Ships Every 6 Week',
      labelOption: '6 Week',
      week: 6
    },
    {
      label: 'Ships Every 8 Week',
      labelOption: '8 Week',
      week: 8
    },
  ],
  frequencySelected: {
    label: 'Ships Every 2 Week',
    labelOption: '2 Week',
    week: 2
  }
}

export default () => ({ ...state })