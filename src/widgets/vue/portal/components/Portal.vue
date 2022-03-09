<template>
  <div :class="_buildModifiers('c-portal', modifiers)">
    <c-portalHero class="c-portal__hero" v-if="customerReady" />
    <c-portalHeader class="c-portal__header" v-if="customerReady" data-portal-header />
    <!--     <div class="c-portal__page o-container"> -->
    <c-loading
      class="c-portal__loading"
      v-if="!customerReady"
      :modifiers="['isSecondary', 'isHollow', 'isLargest']"
    />
    <transition name="t-content-fade" v-if="customerReady" mode="out-in">
      <router-view class="c-portal__content" :key="$route.name" />
    </transition>
    <!--     </div> -->
    <c-sidebar class="c-portal__sidebar" v-if="customerReady" data-portal-header />
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import setup from '../_setup'
import cPortalHeader from './theme/cPortalHeader.vue'
import cPortalHero from './theme/cPortalHero.vue'
import cSidebar from './theme/cSidebar.vue'
import cLoading from '@shared/components/core/cLoading.vue'
import { apiService } from '@shared/services'

export default {
  props: {
    modifiers: {
      type: Array,
      default: () => []
    }
  },
  components: {
    cPortalHeader,
    cPortalHero,
    cSidebar,
    cLoading
  },
  computed: {
    ...mapGetters('customer', ['customerReady']),
    state() {
      //  Testing Onlyyy
      return this.$store.state
    },
    preventScroll() {
      return this.$store.getters['ui/uiSettingByKey']('preventScroll')
    },
    allCookies() {
      return document.cookie
    },
    // for testing only
    apiAccessToken() {
      return this.allCookies
        .split('; ')
        .find(row => row.includes('ss_access_token'))
        ?.split('=')[1]
    },
    apiTest() {
      return new apiService()
    }

    // addresses() {
    //   return this.$store.state.customer.resources.addresses
    // },
    // addressId() {
    //   return this.$store.state.customer.resources.addresses[0].id
    // },
    // customerId() {
    //   return this.$store.state.customer.resources.addresses[0].customerId
    // }

    // onetimes() {
    //   return this.$store.state.customer.resources.onetimes
    // },
  },
  methods: {
    setReady() {
      const shopifyInterval = setInterval(() => {
        this.shopifyReady = window.Scoutside.api.ready
        if (this.shopifyReady) clearInterval(shopifyInterval)
      }, 100)
    },

    // For testing setup only! Remove once Portal connection is fixed
    updateAPIheader() {
      this.apiTest.headers['X-Api-Access-Token'] = this.apiAccessToken
    },
    async getRCdata() {
      const apiClient = new apiService()
      const { data } = await this.apiTest.get(
        '/v1/customer/resources?resources=addresses,charges,orders,subscriptions,onetimes'
      )

      //const { data2 } = await this.apiTest.get('/v1/customers/81820410')

      const { rechargeCustomer, resources } = data //shopifyCustomer,

      console.log('rechargeCustomer', rechargeCustomer)

      this.state.customer.resources = { ...resources }
      this.state.customer.recharge = true
      this.state.customer.ready = true

      const { portal, shop, bundle, customer } = await window.Scoutside
      this.state.customer.shopifyCustomer = customer
      this.state.shopify = customer
      this.state.customize.shop = { ...shop }
      this.state.customize.content = { ...portal }
      this.state.products = { ...portal.products.catalog }
    }
  },
  async mounted() {
    //await setup(this)
    this.setReady()
    setTimeout(() => {
      this.updateAPIheader()
    }, 300)
    setTimeout(() => {
      this.getRCdata()
    }, 500)
  },
  watch: {
    preventScroll: {
      handler(val) {
        const body = document.querySelector('[data-body]')
        if (val) body.classList.add('o-body--noScroll')
        else body.classList.remove('o-body--noScroll')
      }
    }
  }
}
</script>

<style lang="scss">
.c-portal {
  background-color: $color-ecru;
}
.c-portal__loading {
  margin: 150px auto;
}
.c-portal__content {
  opacity: 1;
}
.t-content-fade-enter,
.t-content-fade-leave-to {
  opacity: 0;
}
.t-content-fade-leave,
.t-content-fade-enter-to {
  transition-duration: 0.15s;
  transition-property: opacity;
  opacity: 1;
}
</style>
