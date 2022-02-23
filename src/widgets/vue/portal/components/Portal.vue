<template>
  <div :class="_buildModifiers('c-portal', modifiers)">
    <c-portalHeader class="c-portal__header" v-if="customerReady" data-portal-header />
    <div class="c-portal__page o-container">
      <c-loading
        class="c-portal__loading"
        v-if="!customerReady"
        :modifiers="['isSecondary', 'isHollow', 'isLargest']"
      />
      <transition name="t-content-fade" v-if="customerReady" mode="out-in">
        <router-view class="c-portal__content" :key="$route.name" />
      </transition>
    </div>
    <c-sidebar class="c-portal__sidebar" v-if="customerReady" data-portal-header />
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import setup from '../_setup'
import cPortalHeader from './theme/cPortalHeader.vue'
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
    apiKey() {
      return this.allCookies
        .split('; ')
        .find(row => row.includes('ss_api_key'))
        ?.split('=')[1]
    },
    apiCustomerToken() {
      return this.allCookies
        .split('; ')
        .find(row => row.includes('ss_customer_token'))
        ?.split('=')[1]
    },
    apiAccessToken() {
      return this.allCookies
        .split('; ')
        .find(row => row.includes('ss_access_token'))
        ?.split('=')[1]
    },
    // for testing only
    apiTest() {
      return new apiService()
    }
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
      const { shopifyCustomer, rechargeCustomer, resources } = data

      this.state.customer.resources = { ...resources }
      this.state.customer.recharge = true
      this.state.customer.ready = true

      const { portal, shop, bundle } = await window.Scoutside
      this.state.customize.shop = { ...shop }
      this.state.customize.content = { ...portal }
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
