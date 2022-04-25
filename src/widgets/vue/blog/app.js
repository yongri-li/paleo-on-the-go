import Vue from 'vue'
import mixins from '@shared/mixins'
import plugins from '@shared/plugins'
import Blog from './Blog.vue'

/* Register Mixins */
Vue.mixin(mixins)

/* Register Plugins */
plugins.forEach(plugin => Vue.use(plugin))

/* Register Component */
Vue.customElement('v-blog', Blog)
