import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'BoxMealDefault',
    component: require("./pages/BoxMeal.vue").default
  },
  {
    path: '/:box',
    name: 'BoxMeal',
    component: require("./pages/BoxMeal.vue").default
  }
];

const router = new VueRouter({
  routes,
  scrollBehavior (to, from, savedPosition) {
    return { x: 0, y: 0 }
  }
})

export default router
