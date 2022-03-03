
import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter);

const links = window.Scoutside.bundle.navigation.links;

const routes = [
  {
    path: links[0].url, name: links[0].title,
    component: require("./components/steps/cPlans.vue").default
  },
  {
    path: links[1].url, name: links[1].title,
    component: require("./components/steps/cMeals.vue").default
  },
  {
    path: links[2].url, name: links[2].title,
    component: require("./components/steps/cAddOns.vue").default
  },
  {
    path: links[3].url, name: links[3].title,
    component: require("./components/steps/cReview.vue").default
  }
];

const router = new VueRouter({
  routes,
  scrollBehavior (to, from, savedPosition) {
    return { x: 0, y: 0 }
  }
})

export default router
