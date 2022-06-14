import { MODAL_CLOSE, MODAL_SETUP } from './_mutations-type'

export default {
  [MODAL_CLOSE](state) {
    state.modal.settings.open = false
  },
  [MODAL_SETUP](state, { component, settings, content, fromPortal }) {
    state.modal.component = require(`../../../components/Modals/${component}.vue`).default
    state.modal.settings = {
      open: true,
      ...settings
    }
    state.modal.content = content
  }
}
