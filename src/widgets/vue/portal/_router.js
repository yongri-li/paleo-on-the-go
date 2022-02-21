
import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: "/shipments", name: "shipments",
    component: require("./components/pages/cShipments.vue").default
  },
  { 
    path: "/details", name: 'details',
    component: require('./components/pages/cManage.vue').default
  },
  { 
    path: "/orders", name: 'orders',
    component: require('./components/pages/cOrders.vue').default
  },
  { 
    path: "/dietary-preferences", name: 'preferences',
    component: require('./components/pages/cDietaryPreferences.vue').default
  },
  { 
    path: "/profile", name: 'profile',
    component: require('./components/pages/cProfile.vue').default
  },
  { 
    path: "/manage", name: 'manage',
    component: require('./components/pages/cManage.vue').default
  },
]

const router = new VueRouter({
  routes,
  base: '/account/',
  scrollBehavior (to, from, savedPosition) {
    return { x: 0, y: 0 }
  }
})

export default router