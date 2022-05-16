<template>
  <div :class="_buildModifiers('c-shipmentsBox', modifiers)" ref="shipmentBox">
    <c-accordion>
      <c-accordionItem
        class="c-shipmentsBox__wrap"
        v-if="sidebarHeadings"
        :open="true"
        :setBoxHeight="setBoxHeight"
      >
        <div class="c-shipmentsSummary__trigger" slot="trigger">
          <div class="c-shipmentsSummary__triggerLabel">
            Shipping To
            <span
              class="u-colorWhite js--ignoreAccOpen"
              @click="
                UI_SET_SIDEBAR({
                  component: 'cSidebarShipping',
                  addressNum: boxNumber,
                  charge: charge,
                  content: sidebarContent
                })
              "
              >{{ charge.shipping_address.address1 }}</span
            >
          </div>
          <div class="c-shipmentsSummary__triggerCircle">
            <c-svg class="c-shipmentsSummary__triggerIcon" name="chevron" />
          </div>
        </div>
        <div class="c-shipmentsBox__content" slot="content">
          <br />
          <header class="c-shipmentsBox__header">
            <div v-if="isUpcoming" class="c-shipmentsBox__headings">
              <h2 class="c-shipmentsBox__heading c-h2">
                Order Ships <span class="u-colorPrimary">{{ shipDate }}</span>
              </h2>

              <!--  <div> -->
              <button class="c-button c-button--isDefault c-button--isPrimary" @click="handleChangeMeals">
                Change Meals
              </button>
              <button class="c-button c-button--isHollow c-button--isBlack" @click="handleEditSchedule">
                Edit Schedule
              </button>
            </div>
            <!--  </div> -->
            <h6 class="c-h6">
              {{ totalSubItems }} Meals &nbsp;<span class="c-basicTxt--md">
                Delivers Every {{ frequency }} Week</span
              >
            </h6>
          </header>
          <div v-if="isUpcoming" class="c-shipmentsBox__lineItems">
            <div class="c-shipmentsBox__grid">
              <c-orders-item
                v-for="(item, subIndex) in subItemsNoRoute"
                :key="subIndex"
                :item="item"
                :content="content"
              />
            </div>

            <header class="c-shipmentsBox__header">
              <div class="c-shipmentsBox__header--inner">
                <h6 class="c-h6">{{ totalAddOns }} Add-Ons &nbsp;</h6>
                <span class="c-basicTxt--md"> One-Time Purchase</span>
                <span class="c-shipmentsBox__header--addons" @click="editAddOns">Edit Add-Ons</span>
              </div>
            </header>

            <div v-if="!isMobile && totalAddOns < 1" class="c-shipmentsBox__emptyAddon">
              <img :src="content.addons_promo_image" alt="addon promo" />
              <section>
                <h6 class="c-h6">{{ content.addons_promo_text }}</h6>
                <span @click="editAddOns">{{ content.addons_promo_trigger_text }}</span>
              </section>
            </div>

            <div class="c-shipmentsBox__grid item__addOn">
              <c-orders-item
                v-for="(item, addOnIndex) in addOnItems"
                :key="addOnIndex"
                :item="item"
                :content="content"
              />
            </div>
            <c-shipmentsRoute :routePrice="routePrice" :hasRoute="hasRoute" @toggleRoute="toggleRoutePrd" />
          </div>
          <div class="c-shipmentsGroups__bottom">
            <c-shipmentsDiscount
              class="c-shipmentsGroups__discount c-shipmentsGroups__bottom--block"
              :address="address"
              :shipment="charge"
              :content="{
                placeholder: content.discount_placeholder,
                button_text: content.discount_button_text,
                button_success: content.discount_button_success
              }"
            />
            <c-shipmentsSummary
              class="c-shipmentsGroups__summary c-shipmentsGroups__bottom--block"
              :shipment="charge"
              :modifiers="[]"
              :content="{
                label_order: content.summary_label_order,
                label_subtotal: content.summary_label_subtotal,
                label_discount: content.summary_label_discount,
                label_tax: content.summary_label_tax,
                label_shipping: content.summary_label_shipping,
                label_total: content.summary_label_total
              }"
              @summaryAccOpen="setBoxMaxHeight"
            />
          </div>
        </div>
      </c-accordionItem>
    </c-accordion>
  </div>
</template>

<script>
import { mapMutations, mapActions } from 'vuex'
import cH from '@shared/components/core/cH.vue'
import cSvg from '@shared/components/core/cSvg.vue'
import cIcon from '@shared/components/core/cIcon.vue'
import cButton from '@shared/components/core/cButton.vue'
import cLoading from '@shared/components/core/cLoading.vue'
import cOrdersItem from '../orders/cOrdersItem.vue'
import cAccordion from '@shared/components/core/cAccordion.vue'
import cAccordionItem from '@shared/components/core/cAccordionItem.vue'
import cShipmentsDiscount from './cShipmentsDiscount.vue'
import cShipmentsSummary from './cShipmentsSummary.vue'
import cShipmentsRoute from './cShipmentsRoute.vue'
import Datepicker from 'vuejs-datepicker'
import { routeapp, formatPriceToNumber } from '@shared/utils'
import { _buildUpdates } from '@vue/portal/utils'

export default {
  props: {
    content: {
      type: Object,
      required: true
    },
    charge: {
      type: Object,
      required: true
    },
    shipDate: {
      type: String,
      required: true
    },
    boxNumber: {
      type: [Number, String]
    },
    modifiers: {
      type: Array,
      default: () => []
    },
    allProducts: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      isUpcoming: true,
      setBoxHeight: false,
      initial_price: '',
      routePrice: '--',
      routeVariant: null
    }
  },
  components: {
    cH,
    cSvg,
    cButton,
    cIcon,
    cOrdersItem,
    cAccordion,
    cAccordionItem,
    cShipmentsDiscount,
    cShipmentsSummary,
    cShipmentsRoute,
    Datepicker
  },
  computed: {
    isMobile() {
      return window.innerWidth < 768 ? true : false
    },
    addressId() {
      return this.charge.addressId
    },
    address() {
      return this.$store.getters['customer/customerAddressById'](this.addressId)
    },
    allItems() {
      return this.charge.lineItems
    },
    allSubs() {
      return this.allItems.filter(itm => !itm.properties.find(prop => prop.name === '_addOn'))
    },
    subObjects() {
      return this.$store.getters['customer/customerSubscriptionsByAddressId'](this.addressId)
    },
    subIds() {
      return this.subObjects.map(sub => sub.productId * 1)
    },
    subItems() {
      return this.allSubs.filter(item => this.subIds.includes(+item.productId))
    },
    subItemsNoRoute() {
      return this.subItems.filter(itm => !itm.productTitle.includes('route'))
    },
    subProductIds() {
      return this.subItemsNoRoute.map(prd => prd.productId * 1)
    },
    subProductQtys() {
      return this.subItemsNoRoute.map(prd => prd.quantity)
    },
    hasRoute() {
      return this.allSubs.some(itm => itm.productTitle.includes('route'))
    },
    currentRoutePrd() {
      return this.subItems.find(itm => itm.productTitle.includes('route'))
    },
    routeProduct() {
      return this.allProducts.find(itm => itm.title.includes('Route Package'))
    },
    routeProductId() {
      const routeSub = this.subObjects.filter(sub => {
        return sub.productTitle.includes('route')
      })
      return +routeSub[0]?.id
    },
    routeRcProduct() {
      return [this.routeProduct].map(prod => {
        return {
          address_id: this.addressId,
          charge_interval_frequency: this.frequency,
          next_charge_scheduled_at: this.charge.scheduledAt,
          order_interval_frequency: this.frequency,
          order_interval_unit: 'week',
          price: this.routePrice / 100,
          hash: prod.price_hashes,
          tags: prod.tags,
          shopify_variant_id: this.routeVariant,
          quantity: 1
        }
      })
    },
    priceMinusRoute() {
      return this.currentRoutePrd ? this.charge.subtotal - this.currentRoutePrd.price : this.charge.subtotal
    },

    addOnItems() {
      return this.$store.getters['customer/customerOnetimesByAddressId'](this.addressId)
    },
    addOnItemsIds() {
      return this.addOnItems.map(addon => addon.productId)
    },
    addOnItemsQtys() {
      return this.addOnItems.map(addon => addon.quantity)
    },
    frequency() {
      const freqObj = this.subItems?.find(sub => sub.frequency)
      const freqBackup = this.$store.getters['customer/customerSubscriptionsByAddressId'](
        this.addressId
      )?.find(sub => sub.frequency)
      return !!freqObj ? freqObj.frequency : freqBackup.frequency
    },
    totalSubItems() {
      return this.subItemsNoRoute?.reduce((sum, sub) => sum + sub.quantity, 0)
    },
    totalAddOns() {
      return this.addOnItems?.reduce((sum, sub) => sum + sub.quantity, 0)
    },
    sidebarHeadings() {
      const shipping = this.$store.getters['customize/customizeSidebarByPrefix']('shipping_')
      return { shipping }
    },
    sidebarContent() {
      const billing = this.$store.getters['customize/customizeSidebarByPrefix']('billing_')
      const shipping = this.$store.getters['customize/customizeSidebarByPrefix']('shipping_')
      return { ...billing, ...shipping }
    },
    sidebarEditSchedule() {
      const content = this.$store.getters['customize/customizeSidebarByPrefix']('edit_schedule')
      return { content }
    },
    portalProducts() {
      return {
        items: this.subProductIds //this.subIds
          .map((id, i) => {
            let productFound = this.allProducts.find(prod => prod.id === id)
            let item = productFound
              ? {
                  ...productFound,
                  quantity: this.subProductQtys[i]
                }
              : null
            return item
          })
          .filter(product => product),
        addons: this.addOnItemsIds.map((id, i) => {
          let addonFound = this.allProducts.find(prod => prod.id === +id)
          let addon = addonFound
            ? {
                ...addonFound,
                quantity: this.addOnItemsQtys[i]
              }
            : null
          return addon
        })
      }
    }
  },
  methods: {
    ...mapMutations('ui', ['UI_SET_SIDEBAR', 'UI_SET_MODAL']),
    ...mapMutations('customer', ['CUSTOMER_SET_THIS_CHARGEID', 'CUSTOMER_SET_NEXT_CHARGEDATE']),
    ...mapMutations('babcart', ['SET_ROUTE_PRODUCT', 'SET_ROUTE_VARIANT']),
    ...mapActions('customer', ['customerCreateSubscriptions', 'customerDeleteSubscriptions']),
    ...mapActions('babcart', ['addToCartFromPortal']),
    setBoxMaxHeight() {
      this.setBoxHeight = !this.setBoxHeight
    },
    async getQuote() {
      const route_key = window.Scoutside.api.route_api_key
      routeapp.get_quote(route_key, this.priceMinusRoute, 'USD', async ({ insurance_price }) => {
        this.initial_price = insurance_price
      })
    },
    async setRoutePrice() {
      const variant = this.routeProduct.variants.find(itm => {
        return formatPriceToNumber(itm?.price) >= this.initial_price
      })
      this.routeVariant = variant.id
      this.routePrice = variant.price
    },
    async toggleRoutePrd(action) {
      if (action === 'add') {
        await this.customerCreateSubscriptions({
          addressId: this.addressId,
          creates: [...this.routeRcProduct]
        })
      } else {
        await this.customerDeleteSubscriptions({
          addressId: this.addressId,
          ids: [this.routeProductId]
        })
      }
    },
    setMealBox() {
      sessionStorage.setItem('boxSize', this.totalSubItems)
      sessionStorage.setItem('addressId', this.addressId)
      sessionStorage.setItem('nextChargeDate', this.charge.scheduledAt)
      sessionStorage.setItem('frequency', this.frequency)
      sessionStorage.setItem('fromPortal', true)
      this.addToCartFromPortal({
        items: {
          productsArr: this.portalProducts.items,
          where: 'items'
        },
        addons: {
          productsArr: this.portalProducts.addons,
          where: 'addons'
        }
      })
    },
    handleChangeMeals() {
      if (!!this.routeProduct) {
        this.SET_ROUTE_PRODUCT(this.routeProduct)
        this.SET_ROUTE_VARIANT(this.routeRcProduct)
      }
      this.setMealBox()
      location.href = '/pages/bundle/#/subscription'
    },
    handleEditSchedule() {
      this.CUSTOMER_SET_THIS_CHARGEID(this.charge.id)
      this.CUSTOMER_SET_NEXT_CHARGEDATE(this.charge.scheduledAt)
      this.UI_SET_SIDEBAR({
        component: 'cSidebarEditSchedule',
        addressId: this.addressId,
        content: this.sidebarEditSchedule.content
      })
    },
    editAddOns() {
      this.handleChangeMeals()
      window.location.href = '/pages/bundle/#/addons'
    }
  },
  watch: {
    initial_price() {
      this.setRoutePrice()
    }
  },
  mounted() {
    this.getQuote()
  }
}
</script>

<style lang="scss">
.c-shipmentsBox {
  @include shadow-card;
  background-color: $color-white;
  border-radius: 3px;
  &:not(:last-child) {
    margin-bottom: 40px;
  }

  &__emptyAddon {
    display: flex;
    width: clamp(300px, 33%, 600px);

    section {
      background-color: $color-black;
      padding: 1rem 1.25rem;
    }

    .c-h6 {
      color: $color-white;
    }

    span {
      color: $color-primary;
      cursor: pointer;
      text-decoration: underline;
    }
  }

  .c-shipmentsSummary__trigger {
    @include media-mobile-down {
      padding: 0;
    }
  }

  &__wrap > .c-accordionItem__trigger {
    background-color: $color-secondary;
    color: $color-black;
    padding: 2.25rem 1rem;

    @include media-mobile-down {
      padding: 1rem;
    }

    .c-shipmentsSummary__triggerLabel {
      color: $color-black;
      font-size: 1.5rem;
      font-weight: 500;

      @include media-mobile-down {
        font-size: 1.25rem;
      }

      span {
        text-decoration: underline;
      }
    }
  }

  .c-shipmentsSummary__triggerCircle {
    border-color: $color-white;
    background-color: $color-white;
    height: 2.5rem;
    width: 2.5rem;

    @include media-mobile-down {
      height: 2rem;
      width: 2rem;
    }

    svg path {
      fill: $color-black;
    }
  }

  .c-accordionItem__content {
    padding: 0;

    .c-shipmentsBox__content {
      padding: 1.25rem 2.5rem;
    }

    @include media-tablet-up {
      .c-shipmentsBox__content {
        min-height: 1012px;
      }
    }

    @include media-mobile-down {
      .c-shipmentsBox__content {
        padding: 1.25rem;
      }
    }
  }
}

.c-shipmentsGroups__bottom {
  display: flex;
  justify-content: space-between;
  grid-gap: 10vw;
  margin-top: 2.25rem;

  &--block {
    flex: 1;
  }

  @include media-mobile-down {
    flex-direction: column;
    grid-gap: 1rem;
  }
}

.c-shipmentsBox__header {
  margin-bottom: 2rem;

  &--inner {
    position: relative;
  }

  @include media-mobile-down {
    &--inner {
      display: grid;

      .c-h6 {
        grid-row: 1/2;
      }
    }

    &--addons {
      grid-row: 1/2;
      line-height: 2;
    }
  }

  &--addons {
    cursor: pointer;
    position: absolute;
    top: 0;
    right: 0;
    font-family: 'Roboto', sans-serif;
    font-size: 1.125rem;
    text-decoration: underline;
    text-transform: capitalize;
  }
}

.c-shipmentsBox__headings {
  display: flex;
  grid-gap: 1.75rem;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.75rem;

  @include media-mobile-down {
    flex-direction: column;
    align-items: flex-start;
    grid-gap: 1rem;

    button {
      width: 100%;
      max-width: 100%;
      flex: 1;
    }
  }

  .c-h2 {
    margin: 0;
    flex: 1;
  }
}

.c-shipmentsBox__flex {
  @include flex($direction: column);
  @include media-tablet-up {
    @include flex($justify: space-between, $align: center, $wrap: nowrap);
  }
}

.c-shipmentsBox__grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 2.25rem;

  + .c-shipmentsBox__header {
    margin-top: 1rem;
  }

  &.item__addOn {
    grid-template-columns: 1fr;
  }

  @include media-tablet-up {
    grid-template-columns: repeat(4, 1fr);
    grid-gap: 2rem;

    &.item__addOn {
      grid-template-columns: repeat(3, 1fr);
    }
  }

  @include media-desktop-up {
    grid-template-columns: repeat(6, 1fr);

    &.item__addOn {
      grid-template-columns: repeat(4, 1fr);
    }
  }
}

.c-shipmentsBox__shippingCharges {
  @include text-heading;
  font-size: 14px;
  letter-spacing: 2px;
  text-transform: uppercase;
}
.c-shipmentsBox__shippingDate {
  margin-bottom: 15px;
  color: $color-secondary;
  font-size: 50px;
  line-height: 1;
  text-transform: uppercase;
}
.c-shipments__shippingButton {
  margin-bottom: 15px;
}
.c-shipments__shippingTo,
.c-shipments__shippingAddress {
  @include text-heading;
  font-size: 18px;
}
.c-shipments__shippingAddress {
  color: $color-secondary;
}

.c-shipmentsSummary__triggerIcon {
  transform: rotate(270deg);
}

.c-accordionItem__trigger--isOpen .c-shipmentsSummary__triggerIcon {
  transform: rotate(90deg);
}
</style>
