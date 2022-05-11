<template>
  <c-accordion :class="_buildModifiers('c-ordersAccordion', modifiers)" v-if="content">
    <c-accordionItem
      class="c-ordersAccordion__item"
      v-for="(order, index) in orders"
      :key="`${order.number}-${index}`"
      :open="open === index"
    >
      <div class="c-ordersAccordion__trigger" slot="trigger">
        <div class="c-ordersAccordion__triggerTop">
          <div class="c-ordersAccordion__triggerDetails">
            <c-h
              class="c-ordersAccordion__detailsDate"
              v-if="order.processedAt"
              tag="time"
              level="3"
              :text="_formatDate(order.processedAt, 'MMM D, YYYY')"
            />
            <c-p
              class="c-ordersAccordion__detailsInfo u-colorGrey"
              tag="span"
              level="3"
              :text="buildInfo(order)"
            />
          </div>
          <div :class="_buildModifiers('c-ordersAccordion__triggerInfo', infoModifiers(order))">
            <c-h
              class="c-ordersAccordion__infoStatus"
              tag="h5"
              level="5"
              :text="content[order.shippingStatus]"
            >
              <c-svg
                class="c-ordersAccordion__infoIcon"
                v-if="infoIcon(order)"
                slot="before"
                :name="infoIcon(order)"
              />
            </c-h>
            <c-a
              class="c-ordersAccordion__infoTrack"
              v-if="order.shippingStatus === 'transit' && order.trackingUrl"
              :attributes="{ target: '_blank' }"
              :url="order.trackingUrl"
              :text="content.track"
              :modifiers="['isUnderline']"
            />
          </div>
        </div>
        <div class="c-ordersAccordion__triggerBottom">
          <c-p
            class="c-ordersAccordion__triggerAddress"
            tag="address"
            level="1"
            v-html="
              _buildAddress({
                address: order.shippingAddress,
                options: {
                  hiddenFields: ['name', 'country'],
                  provinceName: 'short'
                }
              })
            "
          />
          <span class="icon-bg__color"></span>
          <c-svg class="c-ordersAccordion__triggerIcon" name="circleChevron" />
        </div>
      </div>
      <div class="c-ordersAccordion__content" slot="content">
        <!-- Subscriptions -->
        <h6 class="c-h6">
          {{ totalSubItems }} Meals &nbsp;<span class="c-basicTxt--md">
            Delivers Every {{ frequency }} Week</span
          >
        </h6>
        <div class="c-ordersAccordion__grid">
          <c-ordersItem
            class="c-ordersAccordion__gridItem"
            v-for="(item, index) in order.lineItems"
            :key="`item-${index}`"
            :item="item"
            :content="{ ships: content.ships }"
            :test="order"
          />
        </div>

        <!-- Add-Ons -->
        <h6 class="c-h6">
          {{ totalAddOns }} Add-Ons &nbsp;<span class="c-basicTxt--md"> One-Time Purchase</span>
        </h6>
        <div class="c-ordersAccordion__grid item__addOn">
          <c-ordersItem
            class="c-ordersAccordion__gridItem"
            v-for="(item, index) in addons"
            :key="`item-${index}`"
            :item="item"
            :content="{ ships: content.ships }"
          />
        </div>
        <div class="c-ordersAccordion__contentBottom">
          <div class="c-ordersAccordion__billing">
            <div class="c-ordersAccordion__billingInfo">
              <c-p
                class="c-ordersAccordion__billingHeading"
                v-if="content.billing"
                tag="p"
                :text="content.billing"
              />

              <c-p
                class="c-ordersAccordion__billingAddress u-colorGrey"
                tag="address"
                level="3"
                v-html="
                  _buildAddress({
                    address: order.shippingAddress,
                    options: {
                      hiddenFields: ['name', 'country'],
                      provinceName: 'short'
                    }
                  })
                "
              />
            </div>
            <div>
              <c-p
                class="c-ordersAccordion__billingStatus"
                v-if="content.billing"
                tag="p"
                text="Payment Status"
              />
              <c-p
                class="c-ordersAccordion__billingStatus u-colorGrey"
                tag="p"
                level="3"
                :text="billingStatus(order)"
              />
            </div>
          </div>
          <div class="c-ordersAccordion__summary">
            <div
              class="c-ordersAccordion__summaryLine"
              v-for="line in summaryLines(order)"
              :key="line.key"
              :class="line.key === 'total' ? 'c-ordersAccordion__summaryLine--isTotal' : ''"
            >
              <span class="c-ordersAccordion__summaryLabel" v-html="content[line.key]" />
              <span
                class="c-ordersAccordion__summaryValue"
                v-html="
                  line.key === 'discount'
                    ? `- ${currencySymbol}${line.value}`
                    : `${currencySymbol}${line.value}`
                "
              />
            </div>
          </div>
        </div>
      </div>
    </c-accordionItem>
  </c-accordion>
</template>

<script>
import { mapGetters } from 'vuex'
import cAccordion from '@shared/components/core/cAccordion.vue'
import cAccordionItem from '@shared/components/core/cAccordionItem.vue'
import cH from '@shared/components/core/cH.vue'
import cP from '@shared/components/core/cP.vue'
import cSvg from '@shared/components/core/cSvg.vue'
import cOrdersItem from './cOrdersItem.vue'
import { _filterItemsByAddOns, _filterItemsBySubscription, filterAddOns } from '../../utils'

export default {
  props: {
    orders: {
      type: Array,
      required: true
    },
    content: {
      type: Object,
      required: true
    },
    modifiers: {
      type: Array,
      default: () => []
    },
    open: {
      type: [Number, Boolean],
      default: false
    },
    addressId: {
      type: String
    }
  },
  components: {
    cAccordion,
    cAccordionItem,
    cH,
    cP,
    cSvg,
    cOrdersItem
  },
  computed: {
    currencySymbol() {
      return this.$store.getters['customize/customizeShopByKey']('currency_symbol')
    },
    subscriptions() {
      return this.$store.getters['customer/customerSubscriptionsByAddressId'](this.addressId)
    },
    // subscriptionItems() {
    //   return this.allItems.filter(item => !this.addOnItemsIds.includes(item.productId))
    // },
    addons() {
      return this.$store.getters['customer/customerOnetimesByAddressId'](this.addressId)
    },
    frequency() {
      const freqObj = this.subscriptions?.find(sub => sub.frequency)
      return freqObj?.frequency
    },
    totalSubItems() {
      return this.subscriptions?.reduce((sum, sub) => sum + sub.quantity, 0)
    },
    totalAddOns() {
      return this.addons?.reduce((sum, sub) => sum + sub.quantity, 0)
    },
    testonetimez() {
      const subs = this.subscriptions.length
      return this.subscriptions.slice(subs)
    }
  },
  methods: {
    buildInfo(order) {
      // const { currencySymbol, content, _formatMoney } = this
      // const total = _formatMoney({ amount: order.total })
      // let info = `${currencySymbol}${total} | ${content.name} #${order.number}`
      const { content } = this
      let info = `${content.name} #${order.number}`
      return info
    },
    delivered(order) {
      return this.shippingStatus !== 'delivered'
    },
    infoModifiers(order) {
      let modifiers = []
      const { shippingStatus } = order
      if (shippingStatus === 'processing') modifiers.push('isProcessing')
      if (shippingStatus === 'transit') modifiers.push('isTransit')
      if (shippingStatus === 'delivered') modifiers.push('isDelivered')
      return modifiers
    },
    infoIcon(order) {
      const { shippingStatus } = order
      if (shippingStatus === 'delivered') return 'check'
    },
    billingStatus(order) {
      // let text = `${this.content.payment}`
      const status = order.billingStatus
      const statusCap = status.charAt(0).toUpperCase() + status.slice(1)
      return statusCap
    },
    summaryLines(order) {
      return this._buildSummary({ item: order })
    },
    testFilt(items) {
      //console.log(filterAddOns(items))
      const allitems = items.length - 1
      // items.slice(allitems)
      console.log(items, items.slice(allitems))
    }

    // getSubscriptionItems(items) {
    //   return _filterItemsBySubscription(items)
    // }
    // getAddOns(items) {
    //   return _filterItemsByAddOns(items)
    // }
  },
  created() {
    this.testFilt(this.orders[0].lineItems)
  }
}
</script>

<style lang="scss">
.c-ordersAccordion {
  .c-ordersAccordion__content {
    min-height: 700px;
  }
}

.c-accordionItem__content {
  /*  will-change: max-height, margin-top;*/

  .c-ordersItem__details .c-h4 {
    font-size: 1rem;
  }
}

.c-ordersAccordion__item {
  background-color: $color-white;
  border-radius: 3px;
  &:not(:last-child) {
    margin-bottom: 40px;
  }
}
.c-ordersAccordion__trigger {
  padding: 2rem 2.5rem;
  @include media-tablet-up {
    @include flex($justify: flex-start, $wrap: nowrap);
  }

  @include media-mobile-down {
    padding: 2rem 1.5rem;
  }
}
.c-ordersAccordion__triggerTop,
.c-ordersAccordion__triggerBottom {
  position: relative;
  @include flex($justify: space-between, $align: flex-start, $wrap: nowrap);
  width: 100%;
  @include media-tablet-up {
    width: auto;
    align-items: center;
  }

  .icon-bg__color {
    position: absolute;
    right: 5px;
    height: 30px;
    width: 30px;
    background: $color-black;
    border-radius: 100%;
    z-index: 0;

    @include media-mobile-down {
      top: 3px;
    }
  }
}
.c-ordersAccordion__triggerBottom {
  flex-grow: 1;
}
.c-ordersAccordion__detailsDate {
  margin-bottom: 5px;
}
.c-ordersAccordion__detailsInfo {
  display: block;
  margin-bottom: 30px;
  white-space: nowrap;
  @include media-tablet-up {
    margin-bottom: 0;
  }
}
.c-ordersAccordion__triggerInfo {
  margin-left: 20px;
  @include media-tablet-up {
    margin-left: 50px;
  }
  @include media-desktop-up {
    margin-left: 70px;
  }
}
.c-ordersAccordion__infoStatus {
  margin-bottom: 0 !important;
  font-weight: 700;
  text-transform: uppercase;
  white-space: nowrap;
  .c-ordersAccordion__triggerInfo--isDelivered & {
    color: $color-secondary;
  }
}
.c-ordersAccordion__infoIcon {
  width: 16px;
  margin-right: 5px;
}
.c-ordersAccordion__infoTrack {
  display: block;
  margin-top: 6px;
  font-size: 14px;
  font-weight: 500;
  text-transform: capitalize;
}
.c-ordersAccordion__triggerAddress {
  width: 220px;
  max-width: calc(100% - 100px);
  margin-bottom: 0 !important;
  @include media-tablet-up {
    width: auto;
    max-width: none;
    margin-left: 50px;
  }
  @include media-up(900px) {
    margin-left: 70px;
  }
  @include media-mobile-down {
    max-width: 100;
  }
}
.c-ordersAccordion__triggerIcon {
  color: $color-ecru;
  height: 2.5rem;
  width: 2.5rem;
  transition: transform 0.35s ease-in-out;
  transform-origin: 50%;
  margin-left: 20px;
  z-index: 1;
  .c-accordionItem__trigger--isOpen & {
    transform: rotate(180deg);
  }
}
.c-ordersAccordion__content {
  border-top: 3px solid $color-ecru;
  padding: 2rem 0;
  margin: 0 2.5rem;

  @include media-mobile-down {
    margin: 0 1.5rem;
  }
}
.c-ordersAccordion__grid {
  margin-top: 2rem;
  @include grid($columns: 1fr, $auto-flow: row, $gap: 2.5rem);
  margin-bottom: 20px;
  @include media-tablet-up {
    grid-template-columns: repeat(3, 1fr);
  }
  @include media-desktop-up {
    grid-template-columns: repeat(6, 1fr);
  }
  @include media-mobile-down {
    grid-template-columns: repeat(2, 1fr);
  }
}
.c-ordersAccordion__gridItem {
  width: 100%;
}
.c-ordersAccordion__grid.item__addOn {
  @include media-desktop-up {
    grid-template-columns: repeat(4, 1fr);
  }

  @include media-mobile-down {
    grid-template-columns: 1fr;
  }
}
.item__addOn .c-ordersItem {
  flex-direction: row;
  background-color: $color-ecru;

  .c-ordersItem__details {
    padding: 1rem;
  }

  .c-ordersItem__image {
    width: 35%;
  }

  .c-lineItem__qty {
    top: unset;
    right: unset;
    bottom: 0;
    left: calc(35% - 1.85rem);
    width: 1.85rem;
    height: 1.85rem;
    font-size: 12px;
    line-height: 1.85rem;
    border-radius: 0;
  }
}
.c-ordersAccordion__contentBottom {
  padding: 20px;
  @include flex($direction: column, $align: flex-start);
  @include border-card;
  @include shadow-card($opacity: 0.05);
  @include media-tablet-up {
    @include flex($justify: space-between, $wrap: nowrap);
  }
}
.c-ordersAccordion__billing {
  @include flex($direction: row);
  align-items: baseline;
  grid-gap: 2rem;
  margin-bottom: 50px;
  @include media-tablet-up {
    align-items: baseline;
    flex-wrap: nowrap;
    margin-bottom: 0;
  }
}
.c-ordersAccordion__billingHeading,
.c-ordersAccordion__billingStatus {
  margin-bottom: 6px;
}
.c-ordersAccordion__billingAddress {
  line-height: 1.5;
  margin-bottom: 0;
}
.c-ordersAccordion__summary {
  width: 100%;
  @include flex($justify: space-between);
  @include media-tablet-up {
    width: 200px;
  }
}
.c-ordersAccordion__summaryLine {
  width: 100%;
  @include flex($justify: space-between);
  margin-bottom: 5px;
  font-size: 14px;
  font-weight: 600;
}
.c-ordersAccordion__summaryLabel,
.c-ordersAccordion__summaryValue {
  .c-ordersAccordion__summaryLine--isTotal & {
    margin-top: 10px;
    font-size: 16px;
    font-weight: 900;
    text-transform: uppercase;
  }
}
</style>
