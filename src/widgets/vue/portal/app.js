import Vue from 'vue'
import mixins from '@shared/mixins'
import plugins from '@shared/plugins'
import router from './_router'
import store from './store'
import cartDrawerStore from '@shared/cartdrawer/store'
import Portal from './components/Portal.vue'

const { newAddToCart, newCleanCart, addToCartFromPortal } = cartDrawerStore.actions
const fullStore = store
fullStore._actions.newAddToCart = newAddToCart
fullStore._actions.newCleanCart = newCleanCart
fullStore._actions.addToCartFromPortal = addToCartFromPortal

console.log(fullStore, cartDrawerStore)
// wrappedActionHandler(payload)

/* Register Mixins */
Vue.mixin(mixins)

/* Register Plugins */
plugins.forEach(plugin => Vue.use(plugin))

/* Register Component */
Portal.store = fullStore
Portal.router = router
Vue.customElement('v-portal', Portal)
