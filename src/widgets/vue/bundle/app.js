import Vue from 'vue';
import mixins from '@shared/mixins';
import plugins from '@shared/plugins';
import store from './store';
import router from './_router';
import Bundle from './components/Bundle.vue';

/* Register Filters */
// filters.forEach(filter => {
//   const key = Object.keys(filter)[0];
//   const fn = filter[key]
//   Vue.filter(key, fn)
// });

/* Register Mixins */
Vue.mixin(mixins);

/* Register Plugins */
plugins.forEach(plugin => Vue.use(plugin));

/* Register Component */
Bundle.store = store
Bundle.router = router
Vue.customElement('v-bundle', Bundle);