import Vue from 'vue'
import mixins from '@shared/mixins'
import plugins from '@shared/plugins'
import pdp from './components/pdp.vue'

/* Register Mixins */
Vue.mixin(mixins)

/* Register Plugins */
plugins.forEach(plugin => Vue.use(plugin))

/* Register Component */
Vue.customElement('v-pdp', pdp)
