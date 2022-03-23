<template>
  <button
    :class="_buildModifiers('c-sidebarActivateItem', modifiers)"
    v-if="item && content"
    @click="handleUpdate"
  >
    <c-radio
      class="c-sidebarActivateItem__radio"
      ref="radio"
      :uncheck="true"
      :active="isActive ? item.id : ''"
      :modifiers="['isBlack', 'hideText']"
      :attributes="{
        name: item.id,
        value: item.id
      }"
    />
    <c-img class="c-sidebarActivateItem__image" :src="image.src" :alt="image.alt" />
    <div class="c-sidebarActivateItem__details">
      <c-p
        class="c-sidebarActivateItem__interval u-block"
        v-if="interval"
        tag="time"
        level="3"
        :text="interval"
      />
      <c-h
        class="c-sidebarActivateItem__title"
        v-if="item.productTitle"
        tag="h4"
        level="4"
        :text="item.productTitle"
      />
      <c-p
        class="c-sidebarActivateItem__variant u-block"
        v-if="_stringEmpty(item.variantTitle)"
        tag="span"
        level="3"
        :text="item.variantTitle"
      />
      <c-p class="c-sidebarActivateItem__price u-block" tag="span" level="4" :text="quantityPrice" />
    </div>
  </button>
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
      default: () => []
    }
  },
  components: {
    cRadio,
    cImg,
    cP,
    cH
  },
  computed: {
    ...mapGetters('customize', ['customizeShop']),
    isActive() {
      return this.activeIds.includes(this.item.id)
    },
    product() {
      return false
    },

    ////
    charges() {
      return this.$store.getters['customer/customerCharges']
    },
    chargesLineItems() {
      return this.charges.flatMap(el => el.line_items)
    },
    image() {
      const { item, chargesLineItems } = this
      const productLineItem = chargesLineItems.find(
        el => parseInt(el.shopify_product_id, 10) === parseInt(item.shopify_product_id, 10)
      )

      return {
        src: productLineItem.images.medium,
        alt: `${item.productTitle}`
      }
    },

    // image() {
    //   const { item, product, customizeShop } = this
    //   return {
    //     src: product ? product.image : false,
    //     alt: `${customizeShop.shop_name} ${item.productTitle}`
    //   }
    // },
    interval() {
      const { item, content, customizeShop } = this
      const { frequency, unit } = item
      // const activeInterval = customizeShop.intervals?.find(interval => {
      //   if (!frequency || !unit) return interval.frequency == 0
      //   else return interval.frequency == frequency
      // })
      // let text = activeInterval.text
      // if (frequency && unit && content.ships) text = `${content.ships} ${text}`
      let text = unit
      return text
    },
    quantityPrice() {
      const { item, customizeShop, _formatMoney } = this
      const currencySymbol = customizeShop.currency_symbol
      const price = `${currencySymbol}${_formatMoney({ amount: item.price })}`
      return `${item.quantity} x ${price}`
    }
  },
  methods: {
    handleUpdate(val) {
      if (this.isActive) this.$emit('update', { id: this.item.id, action: 'remove' })
      else this.$emit('update', { id: this.item.id, action: 'add' })
    }
  }
}
</script>

<style lang="scss">
.c-sidebarActivateItem {
  @include button-unset;
  width: 100%;
  padding: 30px 0 40px;
  @include flex($align: flex-start, $wrap: nowrap);
  @include hover-fade($opacity: 0.75);
}
.c-sidebarActivateItem__radio {
  width: auto;
  position: relative;
  top: 35px;
  transform: translateY(-50%);
  margin-right: 20px;
}
.c-sidebarActivateItem__image {
  width: 70px;
  background-color: $color-secondary;
  color: lighten($color-black, 10%);
  border-radius: 3px;
}
.c-sidebarActivateItem__details {
  padding-left: 15px;
  @include media-tablet-up {
    padding-left: 20px;
  }
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
  text-transform: uppercase;
}
</style>
