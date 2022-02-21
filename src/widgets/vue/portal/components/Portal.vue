<template>
  <div :class="_buildModifiers('c-portal', modifiers)">
    <c-portalHeader
      class="c-portal__header"
      v-if="customerReady && !display_disablePortal"
      data-portal-header
    />
    <!-- v-if="customerReady && !rechargeDown" -->
    <c-loading
      class="c-portal__loading"
      v-if="!customerReady"
      :modifiers="['isSecondary', 'isHollow', 'isLargest']"
    />
    <transition name="t-content-fade" v-if="customerReady" mode="out-in">
      <router-view :key="$route.name" />
    </transition>
    <c-sidebar
      class="c-portal__sidebar"
      v-if="customerReady"
      data-portal-sidebar
    />
    <c-modal class="c-portal__modal" v-if="customerReady" data-portal-modal />
    <c-drawer
      side="right"
      :show="defaultMenuOpen"
      :modifiers="['isFullWidth']"
      :closable="false"
      @click="defaultMenuOpen = false"
    >
      <c-defaultMenu />
    </c-drawer>
  </div>
</template>

<script>
import { mapGetters, mapState, mapActions, mapMutations } from 'vuex'
import setup from '../_setup'
import redirect from '../_redirect'
import cPortalHeader from './theme/cPortalHeader.vue'
import cLoading from '@shared/components/core/cLoading.vue'
import cSidebar from './theme/cSidebar.vue'
import cModal from './theme/cModal.vue'
import cDefaultMenu from './parts/cDefaultMenu.vue'
import cDrawer from '@shared/components/core/cDrawer.vue'
import { apiService } from '@shared/services'
import { calcDatesDiff } from '@shared/utils'

export default {
  name: 'Portal',
  props: {
    modifiers: {
      type: Array,
      default: () => []
    }
  },
  components: {
    cDrawer,
    cPortalHeader,
    cLoading,
    cModal,
    cSidebar,
    cDefaultMenu
  },
  data() {
    return {
      shopifyReady: false,
      delvDay: '',
      firstDFMset: false,
      customerEmail: '',
      firstLineItems: [],
      dfmenuarray: [],
      defaultMenuFavs: '',
      today: new Date(),
      ...window.Scoutside.shop
    }
  },
  computed: {
    ...mapState('ui', ['defaultMenuOpen']),
    ...mapState('products', ['children', 'defaultMenu', 'defaultMenuItems']),
    ...mapGetters('customer', [
      'customerReady',
      'customerRecharge',
      'customerCharges',
      'customerUpcomingCharges',
      'customerSubscriptions'
    ]),
    ...mapGetters('products', ['allProducts']),
    state() {
      //  Testing Only
      return this.$store.state
    },
    preventScroll() {
      return this.$store.getters['ui/uiSettingByKey']('preventScroll')
    },
    setCustomerEmail() {
      return (this.customerEmail = this.customerRecharge.email)
    },
    nextUpcomingCharge() {
      return this.customerUpcomingCharges?.filter(
        (chrg) => chrg.status !== ('REFUNDED' || 'CANCELLED')
      )
    },
    lastChargeObjSchAtDate() {
      return this.customerCharges[this.customerCharges.length - 1]?.scheduledAt
    },
    isCutoffDay() {
      const nxtChrg = this.nextUpcomingCharge[0]?.scheduledAt
      const diffFromCut = Math.abs(calcDatesDiff(new Date(nxtChrg), new Date()))
      return diffFromCut < 1 ? true : false
    },
    setDefaultMenuFavs() {
      return (this.defaultMenuFavs = this.defaultMenu)
    },
    nextChargeStatus() {
      return this.nextUpcomingCharge?.length
        ? this.nextUpcomingCharge[0].status
        : null
    }
  },
  methods: {
    ...mapActions('products', [
      'customerGetDefaultMenu',
      'customerSetDefaultMenu'
    ]),
    ...mapMutations('customer', [
      'CUSTOMER_SET_DELIVERYDAY',
      'CUSTOMER_SET_NEXTSKIPPED'
    ]),
    ...mapMutations('products', ['SET_DEFAULT_MENU_ITEMS']),
    ...mapMutations('ui', [
      'UI_TOGGLE_NO_DFMENU_RETURNED',
      'UI_SET_TIME_EST',
      'UI_PAST_CUTOFF_EST',
      'UI_TOGGLE_DELVDATE_PROCESSING'
    ]),
    setReady() {
      const shopifyInterval = setInterval(() => {
        this.shopifyReady = window.Scoutside.api.ready
        if (this.shopifyReady) clearInterval(shopifyInterval)
      }, 100)
    },
    async setTimeEST() {
      const nowUTC = this.today.getUTCHours()
      const nowEST = nowUTC < 5 ? nowUTC + 24 - 5 : nowUTC - 5
      const todayNum = this.today.getDay()

      let nxtChrg
      let oldChrg

      if (this.nextUpcomingCharge.length) {
        nxtChrg = this.nextUpcomingCharge[0]?.scheduledAt
        oldChrg = false
      } else {
        nxtChrg = this.lastChargeObjSchAtDate
        oldChrg = true
      }

      const cutoff = new Date(new Date(nxtChrg) - 1)
      const cutoffDay = cutoff.getDay()
      const diffFromCut = Math.abs(
        calcDatesDiff(new Date(new Date(nxtChrg) - 1), new Date())
      )
      const isCutoffDay = diffFromCut < 1 ? true : false

      this.UI_SET_TIME_EST(nowEST)

      if (nxtChrg) this.UI_TOGGLE_DELVDATE_PROCESSING(false)

      console.log(nxtChrg, oldChrg)

      if (isCutoffDay) {
        if (nowEST >= 18 || nowEST <= 3) {
          this.UI_PAST_CUTOFF_EST(true)
        }
      }
      if (oldChrg) {
        if (nowEST >= 18 || nowEST <= 3) {
          if (todayNum === 0 || todayNum === 3) {
            this.UI_PAST_CUTOFF_EST(true)
          }
        }
      }
    },
    setBundleSelections() {
      sessionStorage.setItem(
        'ss.bundleSelections',
        JSON.stringify(this.nextUpcomingCharge)
      )
    },
    async setFirstDefaultMenu() {
      const getDFMenu = await this.customerGetDefaultMenu({
        email: this.customerEmail
      })

      if (getDFMenu) {
        sessionStorage.setItem(
          'default_menu',
          JSON.stringify(this.defaultMenu.favorites)
        )
        setTimeout(() => {
          this.setDfMenuu()
        }, 500)
      } else {
        this.UI_TOGGLE_NO_DFMENU_RETURNED(true)
      }
    },
    getProductObject(id) {
      return this.allProducts.find((product) =>
        product.variants.find((varn) => varn.id === id)
      )
    },
    setSkippedStatus() {
      if (this.nextChargeStatus === 'SKIPPED') {
        this.CUSTOMER_SET_NEXTSKIPPED(true)
      }
    },
    async setDfMenuu() {
      this.dfmenuarray = []
      const arrSet = await this.defaultMenu.favorites.map(async (prod) => {
        const product = await this.getProductObject(prod.shopify_variant_id)
        const qty = prod.quantity
        let meal = { ...product }

        if (meal) {
          meal.quantity = qty
          if (meal.variants?.length > 1) {
            prod.shopify_variant_id === meal.variants[1].id
              ? (meal.upsellId = prod.shopify_variant_id)
              : delete meal.upsellId
          } else {
            delete meal.upsellId
          }
          this.dfmenuarray.push(meal)
        }
      })
      if (arrSet) this.SET_DEFAULT_MENU_ITEMS(this.dfmenuarray)
    }
  },
  async mounted() {
    this.setReady()
  },
  async created() {
    //
  },
  watch: {
    customerEmail() {
      this.setFirstDefaultMenu()
      if (this.defaultMenuItems.length < 1)
        setTimeout(() => {
          this.setDfMenuu()
        }, 500)

      // handler: "setBundleSelections"
    },
    nextUpcomingCharge() {
      this.setTimeEST()
    },
    shopifyReady: {
      immediate: true,
      handler(val) {
        if (val) setup(this)
      }
    },
    preventScroll: {
      handler(val) {
        const body = document.querySelector('[data-body]')
        if (val) body.classList.add('o-body--noScroll')
        else body.classList.remove('o-body--noScroll')
      }
    },
    customerReady: {
      handler(val) {
        if (val) redirect(this)

        setTimeout(() => {
          this.setSkippedStatus()
        }, 1000)
      }
    },
    customerRecharge: {
      async handler(customer) {
        this.customerEmail = this.customerRecharge.email
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
  background-color: $color-body;
  @include media-desktop-up {
    padding: 0;
  }
}
.c-portal__page {
  min-height: 420px;
}
.c-portal__loading {
  margin: 150px auto;
}
.c-portal__header {
  @include media-mobile-down {
    position: sticky;
    top: 0;
    z-index: $z-index-top;
  }
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
