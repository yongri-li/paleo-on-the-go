<template>
  <div :class="_buildModifiers('c-portal', modifiers)">
    <c-portalHero class="c-portal__hero" v-if="customerReady" />
    <c-portalHeader class="c-portal__header" v-if="customerReady" data-portal-header />
    <c-loading
      class="c-portal__loading"
      v-if="!customerReady"
      :modifiers="['isSecondary', 'isHollow', 'isLargest']"
    />
    <transition name="t-content-fade" v-if="customerReady" mode="out-in">
      <router-view class="c-portal__content" :key="$route.name" :allProducts="allProducts" />
      <!-- :addressId="addressId" -->
    </transition>
    <c-sidebar class="c-portal__sidebar" v-if="customerReady" data-portal-header />
    <c-modal class="c-portal__modal" v-if="customerReady" data-portal-modal />
  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations } from 'vuex'
import setup from '../_setup'
import cPortalHeader from './theme/cPortalHeader.vue'
import cPortalHero from './theme/cPortalHero.vue'
import cModal from './theme/cModal.vue'
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
  data() {
    return {
      allProducts: window.Scoutside.portal.products.allproducts
    }
  },
  components: {
    cPortalHeader,
    cPortalHero,
    cModal,
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
    apiTest() {
      return new apiService()
    },
    addresses() {
      return this.$store.state.customer.resources.addresses
    },
    addressIds() {
      const addrIds = this.addresses?.map(adr => adr.id)
      return addrIds
    }
  },
  methods: {
    ...mapMutations('customer', ['CUSTOMER_SET_ADDRESS_IDS']),
    setReady() {
      const shopifyInterval = setInterval(() => {
        this.shopifyReady = window.Scoutside.api.ready
        if (this.shopifyReady) clearInterval(shopifyInterval)
      }, 100)
    },
    async getRCdata() {
      const apiClient = new apiService()
      const { data } = await this.apiTest.get(
        '/v1/customer/resources?resources=addresses,charges,orders,subscriptions,onetimes'
      )
      const accounts = await this.apiTest.get('/v1/customer/account')
      const { rechargeCustomer, resources } = data
      console.log('dataa', data)
      this.state.customer.resources = { ...resources }
      this.state.customer.recharge = accounts.data.rechargeCustomer
      this.state.rechargeCustomer = accounts.data.rechargeCustomer
      this.state.customer.ready = true
      const { portal, shop, bundle, customer } = await window.Scoutside
      this.state.customer.shopifyCustomer = customer
      this.state.shopify = customer
      this.state.customize.shop = { ...shop }
      this.state.customize.content = { ...portal }
      this.state.products = { ...portal.products.catalog }
    }
  },
  created() {
    // const ccAct = document.cookie.split('; ').find(row => row.includes('ss_access_token'))
    // const ccApiAccessToken = ccAct?.split('=')[1]
    // const lsApiAccessToken = localStorage.getItem('api_access_token')
    // lsApiAccessToken ? null : localStorage.setItem('api_access_token', ccApiAccessToken)
    //this.getRCdata()
  },
  async mounted() {
    //await setup(this)
    this.setReady()
    //this.getRCdata()
    // setTimeout(() => {
    //   this.updateAPIheader()
    // }, 300)
    setTimeout(() => {
      this.getRCdata()
    }, 1031)
  },
  watch: {
    preventScroll: {
      handler(val) {
        const body = document.querySelector('[data-body]')
        if (val) body.classList.add('o-body--noScroll')
        else body.classList.remove('o-body--noScroll')
      }
    },
    addresses() {
      this.$nextTick(() => {
        this.CUSTOMER_SET_ADDRESS_IDS(this.addressIds)
      })
    }
  }
}
</script>

<style lang="scss">
.c-portal {
  background-color: $color-ecru;

  @include media-tablet-down {
    /*overflow-y: scroll;*/
  }
}
.c-portal__loading {
  background-color: $color-white;
  margin: 150px auto;
}
.c-portal__content {
  opacity: 1;

  @include media-mobile-down {
    width: calc(100% - 2rem);
    margin: 0 auto;
  }
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
