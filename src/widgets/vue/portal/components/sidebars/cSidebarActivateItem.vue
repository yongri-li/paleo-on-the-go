<template>
  <div
    v-if="item && content"
    :class="_buildModifiers('c-sidebarActivateItem', modifiers)"
  >
    <div class="c-sidebarActiveItem__flex">
      <c-img class="c-sidebarActivateItem__image"
        :src="image.src"
        :alt="image.alt"
      />
      <div class="c-sidebarActivateItem__details">
        <c-p class="c-sidebarActivateItem__interval u-block"
          v-if="item.variant_title"
          tag="p"
          level="1"
          :text="item.variant_title"
        />
        <c-h class="c-sidebarActivateItem__title"
          v-if="item.productTitle"
          tag="h4"
          level="4"
          :text="item.product_title"
        />
      </div>
    </div>
    <div>
      <p class="c-sidebarActiveItem__quantity">
        {{ item.quantity }}
      </p>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import cRadio from '@shared/components/core/cRadio.vue'
import cImg from '@shared/components/core/cImg.vue'
import cP from '@shared/components/core/cP.vue'
import cH from '@shared/components/core/cH.vue'

export default {
  props: {
    item: {
      type: Object,
      required: true
    },
    activeIds: {
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
    }
  },
  components: {
    cRadio, cImg, cP, cH
  },
  computed: {
    ...mapGetters('customize', ['customizeShop']),
    charges() {
      return this.$store.getters['customer/customerCharges']
    },
    chargesLineItems() {
      return this.charges.map((element) => {
        return element.line_items
      }).flat()
    },
    isActive() {
      return this.activeIds.includes(this.item.id)
    },
    product() {
      return false
    },
    image() {
      const { item, chargesLineItems } = this
      const productLineItem = chargesLineItems
        .find((element) =>
          parseInt(element.shopify_product_id, 10) === parseInt(item.shopify_product_id, 10)
        )

      return {
        src: productLineItem.images.medium,
        alt: `${item.productTitle}`
      }
    },
    interval() {
      const { item, content, customizeShop } = this
      const { frequency, unit } = item
      const activeInterval = customizeShop.intervals.find(interval => {
        if(!frequency || !unit) return interval.frequency == 0
        else return interval.frequency == frequency
      })
      let text = activeInterval.text
      if(frequency && unit && content.ships) text = `${content.ships} ${text}`
      return text
    },
    quantityPrice() {
      const { item, customizeShop, _formatMoney } = this
      const currencySymbol = customizeShop.currency_symbol
      const price = `${currencySymbol}${_formatMoney({ amount: item.price })}`
      return `${item.quantity} x ${price}`
    }
  }
}
</script>

<style lang="scss">
  .c-sidebarActivateItem {
    background-color: $color-ecru;
    border: 1px solid $color-paleo;
    border-radius: 5px;
    width: 100%;
    position: relative;
    margin: 10px 0;
    padding: 10px 34px 10px 14px;
    @include flex($justify: space-between, $align: center, $wrap: nowrap);

    &:last-child {
      margin-bottom: 0;
    }
  }
  .c-sidebarActiveItem__flex {
    @include flex($align: center, $wrap: nowrap);
  }
  .c-sidebarActiveItem__quantity {
    width: 35px;
    height: 35px;
    line-height: 38px;
    border-radius: 50%;
    font-size: 16px;
    font-weight: 700;
    font-family: $font-body;
    text-align: center;
    color: $color-smooth-white;
    background-color: $color-broccoli;
    margin-bottom: 0;
  }
  .c-sidebarActivateItem__radio {
    width: auto;
    position: relative;
    top: 35px;
    transform: translateY(-50%);
    margin-right: 20px;
  }
  .c-sidebarActivateItem__image {
    width: 85px;
    border-radius: 50%;
    box-shadow: 8px 8px 10px rgba(16, 31, 45, 0.3);
  }
  .c-sidebarActivateItem__details {
    padding-left: 15px;
    @include media-tablet-up {
      padding-left: 20px;
    }
  }
  .c-sidebarActivateItem__title {
    color: $color-off-black;
    font-weight: 700;
    font-size: 16px;
    margin-bottom: 0;
    font-family: $font-heading;
    line-height: 1.4;
  }
  .c-sidebarActivateItem__title,
  .c-sidebarActivateItem__variant {
    text-align: left;
  }
  .c-sidebarActivateItem__interval,
  .c-sidebarActivateItem__title,
  .c-sidebarActivateItem__variant,
  .c-sidebarActivateItem__quantity,
  .c-sidebarActivateItem__price {
    margin-bottom: 0;
    line-height: 1.5;
  }
  .c-sidebarActivateItem__interval {
    margin-bottom: 0;
    color: $color-broccoli;
    text-transform: uppercase;
    font-weight: 800;
    font-size: 10px;
    letter-spacing: 0.05em;
    font-family: $font-body;
  }
</style>