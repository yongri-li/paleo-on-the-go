import Vue from 'vue'
import mixins from '@shared/mixins'
import plugins from '@shared/plugins'
import plp from './components/plp.vue'

/* Register Mixins */
Vue.mixin(mixins)

/* Register Plugins */
plugins.forEach(plugin => Vue.use(plugin))

/* Register Component */
Vue.customElement('v-plp', plp)
