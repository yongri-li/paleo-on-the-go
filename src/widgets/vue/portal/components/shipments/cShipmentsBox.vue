<template>
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
</template>

<!-- /////// -->
<template>
  <div :class="_buildModifiers('c-shipmentsBox', modifiers)" ref="shipmentBox">
    <section :class="">
      <header class="c-shipmentsBox__header">
        <div class="c-shipmentsBox__headings">
          <div v-if="isUpcoming">
            <br />
            <h3 class="c-shipmentsBox__heading c-h3">Delivery on {{}}</h3>
            <p class="c-shipmentsBox__copy">Select your Meals by {{}} (6pm EST)</p>
          </div>
          <div v-else>
            <h3 class="c-shipmentsBox__heading c-h3">
              <!-- //ios dat -->
            </h3>
            <p class="c-shipmentsBox__copy c-shipmentsBox__copy--skip u-colorBroccoli">
              This order has been skipped
            </p>
            <p class="c-shipmentsBox__copy">Unskip before {{}} (6pm EST)</p>
          </div>
        </div>

        <!--         <ul
          v-if="isUpcoming"
          :class="[
            'c-shipmentsBox__actions',
            {
              'c-shipmentsBox__actions--dropdownOpen': dateSelectOpen
            }
          ]"
        >
          <li
            v-if="!skipd"
            :class="[
              'c-shipmentsBox__dropdown',
              {
                recharge__loading: rechargeLoading,
                recharge__loading: delvDateProcessing
              }
            ]"
          >
            <div
              :class="[
                'c-dropdown',
                {
                  'c-dropdown--open': dateSelectOpen
                }
              ]"
            >
              <section class="c-dropdown__inner">
                <div
                  class="c-dropdown__toggle u-relative u-pointer"
                  @click.stop="dateSelectOpen = !dateSelectOpen"
                >
                  {{ dropdownText }}
                  <div class="c-dropdown__icons">
                    <span class="c-dropdown__arrow">
                      <c-icon icon="chevron" />
                    </span>
                  </div>
                </div>
                <div
                  v-for="(day, i) in 7"
                  :class="[
                    'c-dropdown__item',
                    {
                      hideDate: !availableForDelivery.days.includes(i) || dateNotAvailable(i),
                      currentDate: formatDayDateIOS(setDropdownDate(i)).includes(deliveryDay)
                    }
                  ]"
                  :key="i"
                  :daynumber="i"
                  :date="setDropdownDate(i)"
                  @click="dropdownDateClk"
                >
                  <template v-if="setDropdownDate(i).toString().includes('Mon')">
                    {{ formatDayDateMMIOS(setDropdownDate(i)) }} (Office hours)
                  </template>
                  <template v-else-if="setDropdownDate(i).toString().includes('Sun')">
                    {{ formatDayDateMMIOS(setDropdownDate(i)) }} (PM hours)
                  </template>
                  <template v-else>
                    {{ formatDayDateMMIOS(setDropdownDate(i)) }}
                  </template>
                </div>
              </section>
            </div>
          </li>
          <li v-if="!skipd">
            <button class="c-cta" @click="() => handleToggleBundleDrawer()">Change Meals</button>
          </li>
          <li v-if="!skipd">
            <c-button
              class="c-cta c-cta--inverse c-loading--isSecondary"
              :disabled="submitting || skipsProcessing || delvDateProcessing"
              :loading="loading.skiporder"
              @click="skipOrderFn"
              text="Skip Order"
              :modifiers="['isDefault', 'isSecondary', 'hideTextLoading']"
            />
          </li>
          <li v-else>
            <c-button
              class="c-cta c-loading--isSecondary"
              :disabled="submitting || skipsProcessing || delvDateProcessing"
              :loading="loading.skiporder"
              @click="unSkipOrderFn"
              text="Unskip"
              :modifiers="['isDefault', 'isSecondary', 'hideTextLoading']"
            />
          </li>
        </ul> -->
      </header>

      <div v-if="isUpcoming" class="c-shipmentsBox__lineItems">
        <div class="c-shipmentsBox__grid">
          <c-orders-item v-for="item in subscriptionItems" :item="item" :content="itemContent" />
          <!-- :item="item" :key="item.id" -->
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
    </section>
  </div>
</template>
<!-- ///////////// -->

<script>
// import { mapGetters, mapState, mapActions, mapMutations } from 'vuex'

import cH from '@shared/components/core/cH.vue'
import cIcon from '@shared/components/core/cIcon.vue'
import cButton from '@shared/components/core/cButton.vue'
import cLoading from '@shared/components/core/cLoading.vue'
import cOrdersItem from '../orders/cOrdersItem.vue'
// import cShipmentsDiscount from './cShipmentsDiscount.vue'
// import cShipmentsAddOnsPromo from './cShipmentsAddOnsPromo.vue'
import cShipmentsSummary from './cShipmentsSummary.vue'
import Datepicker from 'vuejs-datepicker'
import { _filterItemsByAddOns, _filterItemsBySubscription, _filterTest } from '../../utils'

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
    cButton,
    cIcon,
    cOrdersItem,
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
    subscriptionItems() {
      return this.allItems.filter(item => !item.properties.find(property => property.name === '_addOn'))
    }
  },
  methods: {
    // getSubscriptionItems(items) {
    //   return _filterItemsBySubscription(items)
    // }
  }
}
</script>

<style lang="scss">
.c-shipmentsBox {
  @include shadow-card;
  padding: 15px 20px 20px;
  background-color: $color-white;
  border-radius: 3px;
  &:not(:last-child) {
    margin-bottom: 40px;
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
}

.c-shipmentsBox__flexSmall {
  width: 100%;
  @include media-tablet-up {
    max-width: 210px;
  }
  @include media-desktop-up {
    max-width: 250px;
  }
}
.c-shipmentsBox__flexLarge {
  @include media-tablet-up {
    max-width: calc(100% - 225px);
  }
  @include media-desktop-up {
    max-width: calc(100% - 280px);
  }
}
.c-shipmentBox__shipping {
  width: 100%;
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
</style>
