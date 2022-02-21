<template>
  <div :class="_buildModifiers('c-ordersItem', modifiers)"
    v-if="item && content"
  >
    <c-img class="c-ordersItem__image"
      :src="item.image"
      :alt="alt"
    />
    <div class="c-ordersItem__details">
      <c-h class="c-ordersItem__title"
        v-if="item.productTitle"
        tag="h4"
        level="4"
        :text="item.productTitle"
      />
      <c-p class="c-ordersItem__interval"
        v-if="interval"
        tag="p"
        level="4"
        :text="interval"
      />
      <c-p class="c-ordersItem__variant"
        v-if="item.variantTitle"
        tag="p"
        level="4"
        :text="item.variantTitle.replace(/\//g, '•')"
      />
      <c-p class="c-ordersItem__price"
        v-if="quantityPrice"
        tag="p"
        level="4"
        :text="quantityPrice"
      />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import cImg from '@shared/components/core/cImg.vue'
import cH from '@shared/components/core/cH.vue'
import cP from '@shared/components/core/cP.vue'

export default {
  props: {
    item: {
      type: Object,
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
  components: { cImg, cH, cP },
  computed: {
    ...mapGetters('customize', ['customizeShop']),
    alt() {
      return `${this.customizeShop.shop_name}  ${this.item.productTitle}`
    },
    interval() {
      const { item, customizeShop } = this
      const frequency = item.properties.find(prop => prop.name === 'shipping_interval_frequency')
      const unit = item.properties.find(prop => prop.name === 'shipping_interval_unit')
      const activeInterval = customizeShop.intervals.find(interval => {
        if(!frequency || !unit) return interval.frequency == 0
        else return interval.frequency == frequency
      })
      let text = activeInterval.text
      if(frequency && unit && content.ships) text = `${content.ships} ${text}`
      return text
    },
    price() {
      const currencySymbol = this.customizeShop.currency_symbol
      const price = this._formatMoney({ amount: this.item.price })
      return `${currencySymbol}${price}`
    },
    quantityPrice() {
      return `${this.item.quantity} x ${this.price}`
    }
  }
}
</script>

<style lang="scss">
  .c-ordersItem {
    padding: 15px;
    @include flex($align: flex-start, $wrap: nowrap);
    @include border-card;
    @include shadow-card($opacity: .05);
  }
  .c-ordersItem__image {
    width: 86px;
    background-color: $color-secondary;
    color: lighten($color-black, 10%);
    border-radius: 3px;
  }
  .c-ordersItem__details {
    margin-left: 30px;
  }
  .c-ordersItem__title,
  .c-ordersItem__interval,
  .c-ordersItem__variant,
  .c-ordersItem__price {
    margin-bottom: 0;
  }

</style>