import Vue from 'vue'
import mixins from '@shared/mixins'
import plugins from '@shared/plugins'
import Policies from './Policies.vue'

/* Register Mixins */
Vue.mixin(mixins)

/* Register Plugins */
plugins.forEach(plugin => Vue.use(plugin))

/* Register Component */
Vue.customElement('v-policies-page', Policies)