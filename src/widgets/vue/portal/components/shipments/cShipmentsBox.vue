<!-- <template>
  <div :class="_buildModifiers('c-shipmentsBox', modifiers)">
    <div class="c-shipmentsBox__flex">
      <div class="c-shipmentsBox__flexSmall">
        <div class="c-shipmentsBox__shipping">
          <span class="c-shipmentsBox__shippingCharges u-block" v-html="'this box charges'" />
          <c-h class="c-shipmentsBox__shippingDate" tag="time" level="1" :text="'Mar 22'" />
          <c-button
            class="c-shipments__shippingButton"
            :modifiers="['isDefault', 'isPrimary']"
            :text="'ship it asap'"
          />
          <span class="c-shipmentsBox__shippingTo u-block" v-html="'Ships To'" />
          <c-button class="c-shipmentsBox__shippingAddress u-block" :text="'17 Princess Street'" />
        </div>
      </div>
      <div class="c-shipmentsBox__flexLarge"></div>

      
    </div>
  </div>
</template> -->

<!-- /////// -->
<template>
  <div :class="_buildModifiers('c-shipmentsBox', modifiers)" ref="shipmentBox">
    <c-accordion>
      <c-accordionItem :open="true">
        <div class="c-shipmentsSummary__trigger" slot="trigger">
          <div class="c-shipmentsSummary__triggerLabel">
            Shipping To <a href="/" class="u-colorWhite">{{ charge.shipping_address.address1 }}</a>
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
              <c-orders-item v-for="item in subscriptionItems" :item="item" :content="itemContent" />
              <!-- :item="item" :key="item.id" -->
            </div>

            <header class="c-shipmentsBox__header">
              <h6 class="c-h6">{{ totalAddOns }} Add-Ons &nbsp;<span> One-Time Purchase</span></h6>
            </header>
            <div class="c-shipmentsBox__grid">
              <c-orders-item v-for="item in addOnItems" :item="item" :content="itemContent" />
            </div>
          </div>
          <div class="c-shipmentsGroups__bottom">
            <!--         <c-shipmentsDiscount
                class="c-shipmentsGroups__discount"
                :address="address"
                :shipment="shipment"
                :content="{
                  placeholder: content.discount_placeholder,
                  button_text: content.discount_button_text,
                  button_success: content.discount_button_success
                }"
              /> -->
            <c-shipmentsSummary
              class="c-shipmentsGroups__summary"
              :shipment="shipment"
              :modifiers="[]"
              :content="{
                label_order: content.summary_label_order,
                label_subtotal: content.summary_label_subtotal,
                label_discount: content.summary_label_discount,
                label_tax: content.summary_label_tax,
                label_shipping: content.summary_label_shipping,
                label_total: content.summary_label_total
              }"
            />
          </div>
        </div>
      </c-accordionItem>
    </c-accordion>
  </div>
</template>

<script>
// import { mapGetters, mapState, mapActions, mapMutations } from 'vuex'

import cH from '@shared/components/core/cH.vue'
import cSvg from '@shared/components/core/cSvg.vue'
import cIcon from '@shared/components/core/cIcon.vue'
import cButton from '@shared/components/core/cButton.vue'
import cLoading from '@shared/components/core/cLoading.vue'
import cOrdersItem from '../orders/cOrdersItem.vue'
import cAccordion from '@shared/components/core/cAccordion.vue'
import cAccordionItem from '@shared/components/core/cAccordionItem.vue'
// import cShipmentsDiscount from './cShipmentsDiscount.vue'
// import cShipmentsAddOnsPromo from './cShipmentsAddOnsPromo.vue'
import cShipmentsSummary from './cShipmentsSummary.vue'
import Datepicker from 'vuejs-datepicker'
import { _filterItemsByAddOns, _filterItemsBySubscription, _filterTest } from '../../utils'
import { format } from 'date-fns'
import { convertToYYYYMMDDlocalT } from '@shared/utils'

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
    modifiers: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      address: {},
      shipment: {},
      isUpcoming: true,
      item: { item: 'item hii' },
      itemContent: { content: 'content hii' }
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
    // cShipmentsDiscount,
    // cShipmentsAddOnsPromo,
    cShipmentsSummary,
    Datepicker
  },
  computed: {
    // ...mapGetters('customer', [
    //   'customerUpcomingCharge',
    //   ['customerShopify']
    // ])
    allItems() {
      return this.charge.lineItems
    },
    addOnItems() {
      return this.$store.state.customer.resources.onetimes
    },
    addOnItemsIds() {
      return this.addOnItems.map(item => item.productId)
    },
    subscriptions() {
      //return this.$store.getters['customize/customizeContentByKey']('shipments')
      //return this.$store.getters['customer/customerSubscriptionsByAddress'](this.charge.addressId)
      return this.$store.state.customer.resources.subscriptions
    },
    subscriptionItems() {
      // return this.allItems.filter(item => !item.properties.find(property => property.name === '_addOn'))
      return this.allItems.filter(item => !this.addOnItemsIds.includes(item.productId))
    },
    frequency() {
      const freqObj = this.subscriptions.find(sub => sub.frequency)
      return freqObj.frequency
    },
    totalSubItems() {
      return this.subscriptions.reduce((sum, sub) => sum + sub.quantity, 0)
    },
    totalAddOns() {
      return this.addOnItems.reduce((sum, sub) => sum + sub.quantity, 0)
    }
    // thisShipDate() {
    //   return this.charge.scheduledAt
    // }
  },
  methods: {
    // getSubscriptionItems(items) {
    //   return _filterItemsBySubscription(items)
    // }
    // formatDayDateIOS(date) {
    //   const dateCvt = new Date(date)
    //   const dateStr = convertToYYYYMMDDlocalT(dateCvt)
    //   return dateStr != null ? format(new Date(dateStr), 'MMM D') : null
    // }
    handleChangeMeals() {},
    handleEditSchedule() {}
  }
}
</script>

<style lang="scss">
.c-shipmentsBox {
  @include shadow-card;
  /*padding: 15px 20px 20px;*/
  background-color: $color-white;
  border-radius: 3px;
  &:not(:last-child) {
    margin-bottom: 40px;
  }

  .c-shipmentsSummary__trigger {
    height: auto;
  }

  .c-accordionItem__trigger {
    background-color: $color-secondary;
    color: $color-black;
    padding: 2.25rem 1rem;

    .c-shipmentsSummary__triggerLabel {
      color: $color-black;
      font-size: 1.5rem;
      font-weight: 500;

      a {
        text-decoration: underline;
      }
    }
  }

  .c-shipmentsSummary__triggerCircle {
    border-color: $color-white;
    background-color: $color-white;
    height: 2.5rem;
    width: 2.5rem;

    svg path {
      fill: $color-black;
    }
  }

  .c-accordionItem__content {
    padding: 0;

    .c-shipmentsBox__content {
      padding: 1.25rem;
    }
  }
}

.c-shipmentsBox__header {
  margin-bottom: 2rem;
}

.c-shipmentsBox__headings {
  display: flex;
  grid-gap: 1.75rem;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.75rem;

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
  grid-template-columns: repeat(4, 1fr);
  grid-gap: 3rem;

  + .c-shipmentsBox__header {
    margin-top: 1rem;
  }
}

/*.c-shipmentsBox__flexSmall {
  width: 100%;
  @include media-tablet-up {
    max-width: 210px;
  }
  @include media-desktop-up {
    max-width: 250px;
  }
}*/

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

/*///*/
.c-shipmentsSummary__triggerIcon {
  transform: rotate(270deg);
}

.c-accordionItem__trigger--isOpen .c-shipmentsSummary__triggerIcon {
  transform: rotate(90deg);
}
</style>
