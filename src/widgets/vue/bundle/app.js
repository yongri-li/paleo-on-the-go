import Vue from 'vue'
import mixins from '@shared/mixins'
import plugins from '@shared/plugins'
import store from './store'
import router from './_router'
import Bundle from './Bundle.vue'

/* Register Mixins */
Vue.mixin(mixins)

/* Register Plugins */
plugins.forEach(plugin => Vue.use(plugin))

/* Register Component */
Bundle.store = store
Bundle.router = router
Vue.customElement('v-bundle', Bundle)