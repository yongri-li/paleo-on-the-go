import Vue from 'vue'
import mixins from '@shared/mixins'
import plugins from '@shared/plugins'
import store from './store'
import pdp from './components/pdp.vue'
import pdpBtm from './components/pdpBtm.vue'

/* Register Mixins */
Vue.mixin(mixins)

/* Register Plugins */
plugins.forEach(plugin => Vue.use(plugin))

/* Register Component */
pdp.store = store
Vue.customElement('v-pdp', pdp)
Vue.customElement('v-pdp-btm', pdpBtm)
