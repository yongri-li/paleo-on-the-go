const state = {
  modal: {
    settings: {
      open: false,
      params: {},
      cancel: () => { console.log('close the modal') },
      continue: () => {}
    },
    component: false,
    content: {
      title: '',
      description: ''
    }
  }
}

export default () => ({ ...state })