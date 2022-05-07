<template>
  <div :class="_buildModifiers('c-portal', modifiers)">
    <c-portalHero class="c-portal__hero" v-if="customerReady && heroReady" />
    <c-portalHeader class="c-portal__header" v-if="customerReady" data-portal-header />
    <c-loading
      class="c-portal__loading"
      v-if="!customerReady"
      :modifiers="['isSecondary', 'isHollow', 'isLargest']"
    />
    <transition name="t-content-fade" v-if="customerReady" mode="out-in">
      <router-view class="c-portal__content" :key="$route.name" :allProducts="allProducts" />
    </transition>
    <c-sidebar class="c-portal__sidebar" v-if="customerReady" data-portal-header />
    <c-modal class="c-portal__modal" v-if="customerReady" data-portal-modal />
  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
import setup from '../_setup'
import redirect from '../_redirect'
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
      allProducts: window.Scoutside.portal.products.allproducts,
      shopifyReady: false,
      heroReady: false
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
    ...mapGetters('customer', ['customerReady', 'customerRecharge']),
    state() {
      //  Testing Onlyyy
      return this.$store.state
    },
    preventScroll() {
      return this.$store.getters['ui/uiSettingByKey']('preventScroll')
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
    ...mapActions('customer', ['customerSetResources']),
    setReady() {
      const shopifyInterval = setInterval(() => {
        this.shopifyReady = window.Scoutside.api.ready
        if (this.shopifyReady) clearInterval(shopifyInterval)
      }, 100)
    }
    // apiTest() {
    //   return new apiService()
    // },
    // async getRCdata() {
    //   const apiClient = new apiService()
    //   const { data } = await this.apiTest.get(
    //     '/v1/customer/resources?resources=addresses,charges,orders,subscriptions,onetimes'
    //   )
    //   const accounts = await this.apiTest.get('/v1/customer/account')
    //   const { rechargeCustomer, resources } = data
    //   console.log('dataa', data)
    //   this.state.customer.resources = { ...resources }
    //   this.state.customer.recharge = accounts.data.rechargeCustomer
    //   this.state.rechargeCustomer = accounts.data.rechargeCustomer
    //   this.state.customer.ready = true
    //   const { portal, shop, bundle, customer } = await window.Scoutside
    //   this.state.customer.shopifyCustomer = customer
    //   this.state.shopify = customer
    //   this.state.customize.shop = { ...shop }
    //   this.state.customize.content = { ...portal }
    //   this.state.products = { ...portal.products.catalog }
    // }
  },
  async created() {
    const { success, error } = await this.customerSetResources({
      resources: ['addresses', 'charges', 'subscriptions', 'orders', 'onetimes']
    })
    const { portal, shop, bundle, customer } = await window.Scoutside
    this.state.products = { ...portal.products.catalog }
    this.heroReady = !!portal
  },
  async mounted() {
    this.setReady()
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
    },
    shopifyReady: {
      immediate: true,
      handler(val) {
        if (val) setup(this)
      }
    },
    customerReady: {
      handler(val) {
        if (val) redirect(this)
      }
    },
    $route: {
      handler(val) {
        if (val.name) {
          redirect(this)
        }
      }
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
