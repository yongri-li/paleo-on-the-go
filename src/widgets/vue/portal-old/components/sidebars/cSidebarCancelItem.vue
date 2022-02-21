<template>
  <div :class="_buildModifiers('c-sidebarCancelItem', modifiers)"
    v-if="item"
  >
    <c-img class="c-sidebarCancelItem__image"
      :src="image.src"
      :alt="image.alt"
    />
    <div class="c-sidebarCancelItem__details">
      <c-p class="c-sidebarCancelItem__date u-block"
        v-if="item.scheduledAt"
        tag="time"
        level="3"
        :text="_formatDate(item.scheduledAt, 'MMM DD')"
      />
      <c-h class="c-sidebarCancelItem__title"
        v-if="item.productTitle"
        tag="h4"
        level="4"
        :text="item.productTitle"
      />
      <c-p class="c-sidebarCancelItem__variant u-block"
        v-if="_stringEmpty(item.variantTitle)"
        tag="span"
        level="3"
        :text="item.variantTitle"
      />
      <c-p class="c-sidebarActivateItem__price u-block"
        tag="span"
        level="4"
        :text="quantityPrice"
      />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import cImg from '@shared/components/core/cImg.vue'
import cP from '@shared/components/core/cP.vue'
import cH from '@shared/components/core/cH.vue'

export default {
  props: {
    item: {
      type: Object,
      required: true
    },
    modifiers: {
      type: Array,
      default: () => ([])
    }
  },
  components: {
    cImg, cP, cH
  },
  computed: {
    ...mapGetters('customize', ['customizeShop']),
    product() {
      return false
    },
    image() {
      const { item, product, customizeShop } = this
      return {
        src: product ? product.image : false,
        alt: `${customizeShop.shop_name} ${item.productTitle}`
      }
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
  .c-sidebarCancelItem {
    @include flex($align: flex-start, $wrap: nowrap);
    padding: 30px 0 40px;
  }
  .c-sidebarCancelItem__image {
    width: 70px;
    background-color: $color-secondary;
    color: lighten($color-black, 10%);
    border-radius: 3px;
  }
  .c-sidebarCancelItem__details {
    padding-left: 15px;
    @include media-tablet-up {
      padding-left: 20px;
    }
  }
  .c-sidebarCancelItem__date,
  .c-sidebarCancelItem__title,
  .c-sidebarCancelItem__variant,
  .c-sidebarCancelItem__quantity,
  .c-sidebarCancelItem__price {
    margin-bottom: 0;
    line-height: 1.5;
  }
  .c-sidebarCancelItem__date {
    text-transform: uppercase;
  }
</style>