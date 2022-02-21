<template>
  <c-accordion :class="_buildModifiers('c-ordersAccordion', modifiers)"
    v-if="content"
  >
    <c-accordionItem class="c-ordersAccordion__item"
      v-for="(order, index) in orders"
      :key="`${order.number}-${index}`"
      :open="open === index"
    >
      <div class="c-ordersAccordion__trigger" slot="trigger">
        <div class="c-ordersAccordion__triggerTop">
          <div class="c-ordersAccordion__triggerDetails">
            <c-h class="c-ordersAccordion__detailsDate"
              v-if="order.processedAt"
              tag="time"
              level="3"
              :text="_formatDate(order.processedAt, 'MMM D, YYYY')"
            />
            <c-p class="c-ordersAccordion__detailsInfo"
              tag="span"
              level="3"
              :text="buildInfo(order)"
            />
          </div>
          <div :class="_buildModifiers('c-ordersAccordion__triggerInfo', 
            infoModifiers(order))"
          >
            <c-h class="c-ordersAccordion__infoStatus"
              tag="h5"
              level="5"
              :text="content[order.shippingStatus]"
            >
              <c-svg class="c-ordersAccordion__infoIcon"
                v-if="infoIcon(order)"
                slot="before"
                :name="infoIcon(order)"
              />
            </c-h>
            <c-a class="c-ordersAccordion__infoTrack"
              v-if="order.shippingStatus === 'transit' && order.trackingUrl"
              :attributes="{ target: '_blank', href: order.trackingUrl }"
              :text="content.track"
              :modifiers="['isUnderline']"
            />
          </div>
        </div>
        <div class="c-ordersAccordion__triggerBottom">  
          <c-h class="c-ordersAccordion__triggerAddress"
            tag="address"
            level="4"
            v-html="_buildAddress({
              address: order.shippingAddress,
              options: {
                hiddenFields: ['name', 'country', 'company'],
                provinceName: 'short',
                flatten: true 
              }
            })"
          />
          <c-icon class="c-ordersAccordion__triggerIcon"
            icon="chevronLarge"
          />
        </div>
      </div>
      <div class="c-ordersAccordion__content" slot="content">
        <div class="c-ordersAccordion__gridWrapper">
          <h4 class="c-ordersAccordion__heading c-h4">
            Your Meals
          </h4>
          <div class="c-ordersAccordion__grid">
            <c-ordersItem class="c-ordersAccordion__gridItem"
              v-for="(item, index) in getSubscriptionItems(order.lineItems)"
              :key="`item-${index}`"
              :item="item"
              :content="{ ships: content.ships }"
            />
          </div>
          <div v-if="getAddOns(order.lineItems).length">
            <h4 class="c-ordersAccordion__heading c-h4">
              Fresh+ Add-Ons
            </h4>
            <div class="c-ordersAccordion__grid">
              <c-ordersItem class="c-ordersAccordion__gridItem"
                v-for="(item, index) in getAddOns(order.lineItems)"
                :key="`addOn-${index}`"
                :item="item"
                :content="{ ships: content.ships }"
                isAddOn
              />
            </div>
          </div>
        </div>
        <div class="c-ordersAccordion__contentBottom">
          <div class="c-ordersAccordion__billing">
            <div class="c-ordersAccordion__billingInfo">
              <c-h class="c-ordersAccordion__billingHeading"
                v-if="content.billing"
                tag="h5"
                level="5"
                :text="content.billing"
              />
              <!-- :text="billingStatus(order)" -->
              <c-p class="c-ordersAccordion__billingStatus"
                tag="p"
                level="3"                
                v-html="billingStatusTxt"
              />
            </div>
            <c-p class="c-ordersAccordion__billingAddress"
              tag="address"
              level="3"
              v-html="_buildAddress({
                address: order.shippingAddress,
                options: {
                  hiddenFields: ['name', 'country'],
                  provinceName: 'short'
                }
              })"
            />
          </div>
          <div class="c-ordersAccordion__summary">
            <div class="c-ordersAccordion__summaryLine"
              v-for="line in summaryLines(order)"
              :key="line.key"
              :class="line.key === 'total' 
                ? 'c-ordersAccordion__summaryLine--isTotal' : ''
              "
            >
              <span class="c-ordersAccordion__summaryLabel"
                v-html="content[line.key]"
              />
              <span class="c-ordersAccordion__summaryValue"
                v-html="line.key === 'discount'
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
import cA from '@shared/components/core/cA.vue'
import cSvg from '@shared/components/core/cSvg.vue'
import cIcon from '@shared/components/core/cIcon.vue'
import cOrdersItem from './cOrdersItem.vue'
import { _filterItemsByAddOns, _filterItemsBySubscription } from '../../utils';

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
      default: () => ([])
    },
    open: {
      type: [Number, Boolean],
      default: false
    }
  },
  components: { 
    cAccordion, cAccordionItem, cH, cP, cA, cSvg,
    cIcon, cOrdersItem
  },
  computed: {
    currencySymbol() {
      return this.$store.getters['customize/customizeShopByKey']('currency_symbol')
    },
    payStatus(){
      return this.orders[0].billingStatus;
    },
    payStatusCls(){
      return this.payStatus === 'paid' ? 'paid' : 'other';
    },    
    billingStatusTxt() {
      return `${this.content.payment}:  <span class="${this.payStatusCls}">${this.payStatus}</span>`
    }  
  },
  methods: {
    buildInfo(order) {
      const { currencySymbol, content, _formatMoney } = this
      const total = _formatMoney({ amount: order.total })
      let info = `${currencySymbol}${total} | ${content.name} #${order.number}`
      return info
    },
    delivered(order) {
      return this.shippingStatus !== 'delivered'
    },
    infoModifiers(order) {
      let modifiers = []
      const { shippingStatus } = order
      if(shippingStatus === 'processing') modifiers.push('isProcessing')
      if(shippingStatus === 'transit') modifiers.push('isTransit')
      if(shippingStatus === 'delivered') modifiers.push('isDelivered')
      return modifiers
    },
    infoIcon(order) {
      const { shippingStatus } = order
      if(shippingStatus === 'delivered') return 'check'
    },
    billingStatus(order) {
      let text = `${this.content.payment}: `
      const status = this.content[order.billingStatus]
      text += status ? status : ''
      return text
    },
    summaryLines(order) {
      return this._buildSummary({ item: order })
    },
    getSubscriptionItems(items) {
      return _filterItemsBySubscription(items);
    },
    getAddOns(items) {
      return _filterItemsByAddOns(items);
    }
  }
}
</script>

<style lang="scss">
  .c-ordersAccordion__item {
    border: 1px solid $color-paleo;
    background-color: $color-ecru;
    border-radius: 12px;
    &:not(:last-child) {
      margin-bottom: 40px;
    }
  }
  .c-ordersAccordion__trigger {
    border-bottom: 1px solid $color-paleo;
    padding: 25px;
    @include media-tablet-up {
      @include flex($justify: flex-start, $wrap: nowrap);
    }
  }
  .c-ordersAccordion__triggerTop,
  .c-ordersAccordion__triggerBottom {
    @include flex($justify: space-between, $align: flex-start, $wrap: nowrap);
    width: 100%;
    @include media-tablet-up {
      width: auto;
      align-items: center;
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
    color: $color-grey;
    @include media-tablet-up {
      margin-bottom: 0;
    }
  }
  .c-ordersAccordion__triggerInfo {
    margin: 0;
    @include media-tablet-up {
      margin: 0 2.125rem 0 0;
    }
  }
  .c-ordersAccordion__infoStatus {
    font-family: $font-body;
    font-size: 18px;
    margin-bottom: 0 !important;
    font-weight: 600;
    white-space: nowrap;
    .c-ordersAccordion__triggerInfo--isDelivered & {
      color: $color-broccoli;
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
    font-weight: 600;
    text-transform: capitalize;
    color: $color-broccoli;
    text-decoration: underline;
  }
  .c-ordersAccordion__triggerDetails {
    width: 160px;

    @include media-tablet-up {
      margin-right: 30px;
    }

    @include media-desktop-up {
      margin-right: 3rem;
    }    
  }
  .c-ordersAccordion__triggerInfo {
    @include media-tablet-up {
      width: 100px;
    }
  }
  .c-ordersAccordion__triggerAddress {
    line-height: 1.2;
    font-size: 18px;
    font-family: $font-body;
    font-weight: 600;
    width: 220px;
    max-width: calc(100% - 100px);
    margin-bottom: 0 !important;
    @include media-tablet-up {
      font-size: 22px;
      width: auto;
      max-width: none;
    }
  }
  .c-ordersAccordion__triggerIcon {
    color: $color-primary;
    transition: transform .35s ease-in-out;
    transform-origin: 50%;
    margin-left: 20px;
    transform: rotate(180deg);
    line-height: 0;
    @include media-mobile-down {
      width: 32px;
      height: 32px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border: 2px solid;
      border-radius: 100%;
    }
    svg {
      @include media-mobile-down {
        width: 12px;
      }
    }
    path {
      fill: $color-base-black;
    }
    .c-accordionItem__trigger--isOpen & {
      transform: rotate(0);
      path {
        fill: $color-broccoli;
        @include media-mobile-down {
          fill: $color-base-black;
        }
      }
    }
  }
  .c-ordersAccordion__content {
    padding: 0 20px;
  }
  .c-ordersAccordion__gridWrapper {
    padding-bottom: 40px;
    border-bottom: 1px solid $color-paleo;
  }
  .c-ordersAccordion__grid {
    @include grid($columns: 1fr, $auto-flow: row, $gap: 20px 10px, $align-i: stretch);
    @include media-tablet-up {
      grid-template-columns: 1fr 1fr;
    }
    @include media-desktop-up {
      grid-template-columns: 1fr 1fr 1fr;
    }
  }
  .c-ordersAccordion__gridItem {
    width: 100%;
  }
  .c-ordersAccordion__contentBottom {
    color: $color-pebble;
    font-weight: 600;
    padding: 30px 0;
    @include flex($direction: column, $align: flex-start);
    @include media-tablet-up {
      @include flex($justify: space-between, $align: flex-start, $wrap: nowrap);
    }
  }
  .c-ordersAccordion__billing {
    @include flex($direction: column, $align: flex-start);
    margin-bottom: 50px;
    @include media-tablet-up {
      @include flex($wrap: nowrap, $align: flex-start);
      margin-bottom: 0;
    }
  }
  .c-ordersAccordion__billingInfo {
    color: $color-off-black; 
  }
  .c-ordersAccordion__billingHeading {
    font-family: $font-body;
    margin-bottom: 6px;
  }
  .c-ordersAccordion__billingStatus {
    margin-bottom: 30px;
    font-weight: 600;
    line-height: 1;
    text-transform: uppercase;
    @include media-tablet-up {
      margin-bottom: 0;
    }
    .paid {
      color: $color-broccoli;
    }
  }
  .c-ordersAccordion__billingAddress {
    font-weight: 600;
    line-height: 1.5;
    margin-bottom: 0;
    @include media-tablet-up {
      margin-left: 40px;
    }
    @include media-up(900px) {
      margin-left: 80px;
    }
  }
  .c-ordersAccordion__summary {
    width: 100%;
    line-height: 1.5;
    @include flex($justify: space-between);
    @include media-tablet-up {
      width: 200px;
    }
  }
  .c-ordersAccordion__summaryLine {
    width: 100%;
    @include flex($justify: space-between);
    font-size: 16px;
  }
  .c-ordersAccordion__summaryLabel,
  .c-ordersAccordion__summaryValue {
    .c-ordersAccordion__summaryLine--isTotal & {
      margin-top: 10px;
      font-size: 16px;
      color: $color-broccoli;
      text-transform: uppercase;
    }
  }
  .c-ordersAccordion__heading {
    display: flex;
    align-items: center;
    font-size: 18px;
    padding: 20px 0 16px;
    margin: 0;
    @include media-mobile-down {
      justify-content: space-between;
    }
  }
</style>