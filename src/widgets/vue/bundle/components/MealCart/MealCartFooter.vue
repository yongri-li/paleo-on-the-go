<template>
  <div class="meal-cart__footer">
    <!--     <c-shipmentsDiscount
      class="c-shipmentsGroups__discount c-shipmentsGroups__bottom--block"
      :address="address"
      :shipment="charge"
      :content="content"
    /> -->

    <!-- New test code for discounts -->
    <!--     <section class="meal-cart__discount">
      <form @submit.prevent="submitDiscountCode($event)">
        <input type="text" id="code" placeholder="Enter Code" /><br />
        <input type="submit" value="Submit" />
      </form>
      <div v-if="discountOff" class="meal-cart__discount--box">
        <span>Discount Code Savings: {{ discountOff }}</span>
      </div>
    </section> -->

    <div class="meal-cart__box-total">
      <div class="meal-cart__box-total--title">BOX TOTAL</div>
      <div class="meal-cart__box-total--amounts">
        <div v-if="typeClass !== 'onetime'" class="meal-cart__box-total--sub">
          {{ subtotalFormat }}
        </div>
        <div class="meal-cart__box-total--final">
          {{ final }}
        </div>
      </div>
    </div>

    <c-button
      class="c-cta meal-cart__btn-next"
      :class="{ disable: notContinue }"
      @click="nextStep"
      :loading="loading"
      :text="ctabtn"
      :modifiers="['isDefault', 'isPrimary', 'hideTextLoading']"
      :attributes="{ disabled: notContinue }"
    />
  </div>
</template>

<script>
import { formatPrice, routeapp, formatPriceToNumber } from '@shared/utils'
import { mapActions, mapState } from 'vuex'
import cButton from '@shared/components/core/cButton.vue'
import cShipmentsDiscount from '@vue/portal/components/shipments/cShipmentsDiscount.vue'
import { apiService } from '@shared/services'
import { stillProcessingWarningPopup, removeReloadWarning } from '@shared/utils'

export default {
  props: {
    cart: {
      type: Object,
      required: true
    },
    subtotal: {
      type: Number,
      required: true
    },
    subtotalWithDiscount: {
      type: Number,
      required: true
    },
    sizeSelected: {
      type: Object,
      required: true
    },
    cartLength: {
      type: Number,
      required: true
    },
    cartAddOns: {
      type: Number,
      required: true
    },
    cartGeneral: {
      type: Number
    },
    addons: {
      type: Array
    },
    subs: {
      type: Array
    },
    fromPortal: {
      type: Boolean
    },
    typeClass: {
      type: String,
      default: 'subscription'
    },
    addressId: {
      type: [String, Number]
    }
  },
  data() {
    return {
      notContinue: false,
      loading: false,
      initialRoutePrice: '',
      routeVariant: null,
      routePrice: null,
      rechargeSubs: [],
      rechargeAddons: [],
      rechargeSubIds: [],
      rechargeAddonIds: [],
      rechargeAddonVarIds: [],
      discountOff: false
    }
  },
  components: {
    cButton,
    cShipmentsDiscount
  },
  computed: {
    ...mapState('cartdrawer', ['cartItems']),
    ...mapState('babcart', ['currentRouteProduct', 'currentRouteVariant']),
    priceAddOns() {
      return this.typeClass === 'addons' ? this.cartAddOns : 0
    },
    final() {
      const total = this.subtotalWithDiscount * 100 + this.priceAddOns + this.cartGeneral
      return total === 0 ? '$0.00' : formatPrice(total)
    },
    finalInt() {
      return (this.subtotalWithDiscount * 100 + this.priceAddOns + this.cartGeneral) / 100
    },
    isCustomer() {
      return customer.email && customer.shopify_id ? true : false
    },
    subtotalFormat() {
      return formatPrice(this.subtotal + this.priceAddOns + this.cartGeneral)
    },
    ctabtn() {
      if (this.cartLength === 0) {
        this.notContinue = true
        return 'Add items to Continue'
      }

      const param = this.$route.params.box
      if (param === 'addons' && this.fromPortal && this.isCustomer) return 'Save Changes'

      const diff = this.cartLength - this.sizeSelected.number_size
      if (diff > 0 && this.typeClass === 'subscription') {
        this.notContinue = true
        return `Remove ${diff} items to Continue`
      }

      if (diff < 0) {
        this.notContinue = true
        return `Add ${diff * -1} items to Continue`
      }

      if (this.cartAddOns === 0 && this.typeClass === 'addons') {
        this.notContinue = false
        const ctaAddonsButton =
          window.Scoutside.bundle.mealcart.content.cta_addons_button || `No Thanks Continue to Checkout`
        return ctaAddonsButton
      }

      if (this.typeClass === 'subscription') {
        this.notContinue = false
        return 'Continue'
      }

      this.notContinue = false
      return 'Checkout'
    },
    finalSubs() {
      const currentSubs = [...this.subs]
      const frequency = sessionStorage.getItem('frequency')
      return currentSubs.map(item => {
        return {
          ...item,
          properties: {
            shipping_interval_frequency: +frequency,
            shipping_interval_unit_type: 'week'
          }
        }
      })
    },
    hasNewAddons() {
      if (this.addons.length !== this.rechargeAddons.length) return true

      const rcVarIdsSrt = this.rechargeAddonVarIds.sort()
      const curVarIdsSrt = this.addons.map(ad => ad.shopify_variant_id).sort()
      const rcQtysSrt = this.rechargeAddons.map(ad => ad.quantity).sort()
      const curQtysSrt = this.addons.map(ad => ad.quantity).sort()

      for (let i = 0; i < curVarIdsSrt?.length; i++) {
        if (curVarIdsSrt[i] !== rcVarIdsSrt[i]) return true
      }
      for (let i = 0; i < curQtysSrt?.length; i++) {
        if (curQtysSrt[i] !== rcQtysSrt[i]) return true
      }
      return false
    },
    newRouteVariant() {
      if (!!this.currentRouteVariant) {
        const route = {
          ...this.currentRouteVariant[0],
          price: this.routePrice / 100,
          hash: this.currentRouteProduct.price_hashes,
          shopify_variant_id: this.routeVariant
        }
        return route
      } else return null
    }
  },
  methods: {
    ...mapActions('cartdrawer', [
      'setDataFromBox',
      'customerCreateSubscriptions',
      'customerDeleteSubscriptions',
      'customerDeleteOnetimes',
      'customerCreateOnetimes',
      'customerUpdatePlan'
    ]),
    submitDiscountCode(e) {
      sessionStorage.setItem('discCode', e.target.querySelector('#code').value)
      this.getDiscount()
    },
    async updateAddonsAndSubs() {
      this.loading = true
      stillProcessingWarningPopup()

      if (this.hasNewAddons) {
        await this.customerDeleteOnetimes({
          addressId: this.addressId,
          addOnsIds: this.rechargeAddonIds
        })

        const subscriptions = await this.customerCreateOnetimes({
          addressId: this.addressId,
          creates: this.addons
        })
      }

      await this.customerUpdatePlan({
        addressId: this.addressId,
        updates: [...this.finalSubs],
        deletes: this.rechargeSubs
      })

      if (!!this.currentRouteVariant) {
        await this.customerCreateSubscriptions({
          addressId: this.addressId,
          creates: [this.newRouteVariant]
        })
      }

      const update = await this.customerDeleteSubscriptions({
        addressId: this.addressId,
        ids: this.rechargeSubIds
      })

      removeReloadWarning()
      if (update) {
        window.location = '/account#/shipments'
        setTimeout(() => (this.loading = false), 1000)
      }
    },
    async nextStep() {
      const param = this.$route.params.box
      if (param === 'subscription') {
        this.$router.push('/addons')
      } else if (this.fromPortal && this.isCustomer) {
        this.updateAddonsAndSubs()
      } else {
        this.loading = true
        await this.setDataFromBox({
          items: this.cart.items,
          addons: this.cart.addons,
          generalitems: this.cart.general,
          sizeSelected: this.sizeSelected
        })
        window.location = '/cart'
      }
    },
    async getQuote() {
      const route_key = window.Scoutside.api.route_api_key
      routeapp.get_quote(route_key, this.finalInt, 'USD', async ({ insurance_price }) => {
        this.initialRoutePrice = insurance_price
      })
    },
    async setRoutePrice() {
      const variant = this.currentRouteProduct?.variants.find(itm => {
        return +formatPriceToNumber(itm?.price) >= this.initialRoutePrice
      })
      this.routeVariant = variant.id
      this.routePrice = variant.price
    },
    async getRCdata() {
      const apiClient = new apiService()
      const { data } = await apiClient.get('/v1/customer/resources?resources=subscriptions,onetimes')
      console.log(data)
      const { subscriptions, onetimes } = data.resources
      const curSubs = subscriptions.filter(
        // sub => sub.addressId === this.addressId && !sub.productTitle.includes('route')
        sub => sub.addressId === this.addressId
      )
      const subIds = curSubs.map(sub => sub.id)
      const curAddons = onetimes.filter(addon => addon.addressId === this.addressId)
      const addonIds = curAddons.map(addon => addon.id)
      const addonVarIds = curAddons.map(addon => addon.shopify_variant_id)
      this.rechargeAddons = curAddons
      this.rechargeSubs = curSubs
      this.rechargeSubIds = subIds
      this.rechargeAddonIds = addonIds
      this.rechargeAddonVarIds = addonVarIds
    },
    getDiscount() {
      const discountCodes = window.Scoutside.discountCodes
      const currentDiscCode = sessionStorage.getItem('discCode')

      if (currentDiscCode) {
        if (discountCodes[`${currentDiscCode}`]) {
          this.discountOff = formatPrice(discountCodes[`${currentDiscCode}`] * this.finalInt)
        } else {
          this.discountOff = 'Invalid Code'
          setTimeout(() => sessionStorage.removeItem('discCode'), 2000)
        }
      }
    }
  },
  watch: {
    initialRoutePrice() {
      const hasRoutePrd = { ...this.currentRouteProduct }
      if (Object.keys(hasRoutePrd).length) this.setRoutePrice()
    },
    finalInt() {
      this.getQuote()
      this.getDiscount()
    }
  },
  mounted() {
    this.getRCdata()
    this.getQuote()
    this.getDiscount()
  }
}
</script>

<style lang="scss" scoped>
.meal-cart {
  &__footer {
    box-shadow: 0px 4px 34px rgba(0, 0, 0, 0.1);
    padding: 0.8rem 1rem;

    @include media-tablet-up {
      padding: 0;
    }
  }

  &__discount--box {
    padding: 0.125rem 0.5rem;
    text-align: right;
    font-size: 0.75rem;
    margin-top: 0.75rem;

    span {
      background-color: #d2ebdd;
      padding: 0.25rem 0.5rem;
      border-radius: 1rem;
    }
  }

  &__box-total {
    @include flex($align: flex-end, $justify: space-between);

    @include media-tablet-up {
      padding: 0.6rem 0.6rem 0;
    }

    &--title {
      font-family: $font-heading;
      text-transform: uppercase;
      font-size: 1.38rem;

      @include media-tablet-up {
        font-size: 1.75rem;
        line-height: 1;
      }
    }

    &--amounts {
      @include flex($align: flex-end);
    }

    &--sub {
      color: #a7a5a6;
      font-size: 1rem;
      margin-right: 0.3rem;
      text-decoration: line-through;

      @include media-tablet-up {
        font-size: 1.25rem;
      }
    }

    &--final {
      font-size: 1rem;
      font-weight: 500;

      @include media-tablet-up {
        font-size: 1.25rem;
      }
    }
  }

  &__btn-next {
    width: 100%;
    max-width: none;
    font-size: 1rem;
    padding: 0 2rem;
    margin-top: 0.5rem;
    height: 54px;

    @include media-tablet-up {
      padding: 0 1rem;
      font-size: 1.13rem;
      font-weight: 500;
      height: 64px;
    }
  }

  .disable {
    pointer-events: none;
    opacity: 0.6;
    color: #4f4c4d;
    background-color: #feedaa;
    border-color: #feedaa;
  }
}
</style>
