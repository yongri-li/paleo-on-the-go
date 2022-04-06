const state = {
  frequencies: [
    {
      label: '2 Week',
      week: 2
    },
    {
      label: '4 Week',
      week: 4
    },
    {
      label: '6 Week',
      week: 6
    },
    {
      label: '8 Week',
      week: 8
    },
  ],
  frequencySelected: {
    label: '2 Week',
    week: 2
  }
}

export default () => ({ ...state })