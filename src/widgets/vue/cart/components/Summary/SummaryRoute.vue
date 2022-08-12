<template>
  <div class="route-widget-container" ref="routewidget">
    <!-- <div id="RouteWidget"></div> -->
    <div
      class="pw-route-protection false desktop-align-left"
      data-protection-widget="true"
      data-testid="pw-widget"
      aria-label="route package protection selector element"
    >
      <div class="pw-container" data-container="true">
        <div class="pw-widget" data-widget="true">
          <div class="pw-content-wrapper">
            <div class="pw-logo" data-logo="true" tabindex="0">
              <img
                aria-label="Lighting Logo"
                class="pw-lighting-logo"
                src="https://protect-lightning-bolt-widget.route.com/assets/logo-lighting-light.svg"
                alt="Lighting Logo"
                @click="changeModal(true)"
              />
            </div>
            <div class="pw-content">
              <div class="pw-title">
                <span data-title="true" tabindex="0">1-Click Protect</span>
              </div>
              <div class="pw-subtitle">
                <span class="pw-subtitle-text" tabindex="0" data-subtitle="true"
                  >Instantly resolve shipping issues </span
                ><a
                  class="pw-learn-more"
                  tabindex="0"
                  rel="nofollow"
                  data-subtitle-learn-more="true"
                  @click="changeModal(true)"
                  >Learn More</a
                >
              </div>
            </div>
          </div>
          <div v-if="loading" class="pw-toggle-wrapper">
            <div class="pw-price quote" data-widget-label="true" tabindex="0" data-testid="quote">
              ..loading
            </div>
          </div>
          <div v-else class="pw-toggle-wrapper">
            <div class="pw-price quote" data-widget-label="true" tabindex="0" data-testid="quote">
              {{ insurance_price }}
            </div>
            <div
              class="pw-switch"
              data-toggle="true"
              data-testid="toggle"
              role="switch"
              aria-checked="true"
              id="speakerPower"
              tabindex="0"
              @click="insurreChange"
            >
              <div class="pw-toggle" aria-checked="true">
                {{ cta }}
              </div>
            </div>
          </div>
        </div>
        <div class="pw-trademark">
          <a
            href="https://route.com/"
            target="_blank"
            class="pw-learn-more"
            tabindex="0"
            rel="nofollow"
            data-trademark-learn-more="true"
          >
            Learn More
          </a>
          <div
            class="infobox"
            role="button"
            aria-labelled="Route Trademark"
            tabindex="0"
            data-pw-trademark="true"
          >
            <span id="Route Trademark">Powered by <b>Route</b></span
            ><img
              aria-labelled="Route Trademark"
              class="pw-route-logo"
              src="https://protect-lightning-bolt-widget.route.com/assets/logo-route-black.svg"
              alt="Route Logo"
            />
          </div>
        </div>
      </div>
    </div>
    <div class="pw-msg-paleo">
      *By deselecting shipping protection, Paleo On The Go is not liable for lost, damaged, or stolen items
    </div>
    <div class="pw-border"></div>
    <summary-route-modal :open="openModal" @close-modal="changeModal(false)" />
  </div>
</template>

<script>
import { mapGetters, mapState, mapActions } from 'vuex'

import { formatPriceToNumber } from '@shared/utils'
import { routeapp } from '../../utils'

import SummaryRouteModal from './SummaryRouteModal.vue'

export default {
  components: {
    SummaryRouteModal
  },
  data() {
    return {
      loading: true,
      insurance_price: '--',
      real_insurance_price: '--',
      openModal: false,
      variant: {}
    }
  },
  computed: {
    ...mapState('cartdrawer', ['routeProduct', 'cartItems']),
    ...mapGetters('cartdrawer', [
      'getSubTotalPricesWithoutRoute',
      'routeProductInCart',
      'getSubscriptionItems'
    ]),
    subtotal() {
      return formatPriceToNumber(this.getSubTotalPricesWithoutRoute)
    },
    haveRouteProductInCart() {
      return !!this.routeProductInCart
    },
    cta() {
      return this.haveRouteProductInCart ? 'REMOVE' : 'ADD+'
    },
    onlyGiftCard() {
      const hasGiftCard = this.cartItems.general.some(itm => itm.type === 'Gift Card')
      const hasItemOrAddon = this.cartItems.box.length && true
      return hasGiftCard && !hasItemOrAddon
    }
  },
  mounted() {
    this.getQuote(true)
  },
  methods: {
    ...mapActions('cartdrawer', ['setRouteProduct']),
    getQuote(firstLoad = false) {
      const subtotal = this.subtotal
      const route_api_key = window.Scoutside.api.route_api_key
      routeapp.get_quote(route_api_key, subtotal, 'USD', async ({ insurance_price }) => {
        this.real_insurance_price = insurance_price
        await this.roundInsurePrice()
        this.loading = false
        if (this.haveRouteProductInCart && this.cta === 'ADD+') this.addProduct()

        if (firstLoad && !this.onlyGiftCard) this.addProduct()
      })
    },
    async roundInsurePrice() {
      await this.setVariantRoute()
      this.insurance_price = formatPriceToNumber(this.variant?.price)
    },
    async setVariantRoute() {
      const routeProduct = await this.getRouteProduct()
      const variantFound = routeProduct.variants.find(
        variant => formatPriceToNumber(variant?.price) >= this.real_insurance_price
      )
      this.variant = variantFound
    },
    async getRouteProduct() {
      let routeProduct = this.routeProduct
      if (!Object.keys(routeProduct).length) {
        routeProduct = await this.setRouteProduct()
      }
      return routeProduct
    },
    insurreChange() {
      if (this.haveRouteProductInCart) {
        // remove
        this.$store.dispatch('cartdrawer/removeRouteProductToCart')
      } else {
        // add
        this.addProduct()
      }
    },
    addProduct() {
      this.$store.dispatch('cartdrawer/addRouteProduct', {
        routeProduct: this.routeProduct,
        variant: this.variant
      })
    },
    changeModal(val) {
      this.openModal = val
    }
  },
  watch: {
    getSubTotalPricesWithoutRoute() {
      this.loading = true
      this.getQuote()
    }
  }
}
</script>

<style lang="scss" scoped>
.route-widget-container {
  padding: 0 0.5rem;

  .pw-msg-paleo {
    font-size: 0.63rem;
  }
}
</style>
