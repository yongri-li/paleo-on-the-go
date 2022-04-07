<template>
  <div :class="[`c-product--cta`, { 'c-product--selected': selected }]">
    <!-- c-product--${modifier} -->
    <div class="c-product__inner">
      <div class="c-product__image-side">
        <a :href="product.url" class="c-product__image-frame">
          <span v-if="flag" :class="`c-product__flag c-product__flag--${flagHandle}`">
            {{ flag }}
          </span>
          <div class="c-product__image-wrapper">
            <img class="c-product__image" :src="product.images[0]" />
          </div>
        </a>
      </div>
      <div class="c-product__info">
        <div class="c-product__title-wrapper">
          <a :href="product.url">
            <h4 class="c-product__title c-h4">
              {{ product.title }}
            </h4>
          </a>
          <span class="c-product__subtitle">
            {{ product.subtitle }}
          </span>
          <strong class="c-product__price">Starts at {{ price }}</strong>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { formatPrice, handleize } from '../../utils'

export default {
  props: {
    product: {
      type: Object
    },
    quantity: {
      type: Number
    },
    isAddOn: {
      type: Boolean
    },
    tag: {
      type: String
    }
  },
  computed: {
    selected() {
      return this.quantity > 0
    },
    // title() {
    //   return this.product.title
    // },
    // modifier() {
    //   return this.isAddOn ? 'addOn' : this.productTypeHandle
    // },
    // productTypeHandle() {
    //   return handleize(this.product.type)
    // },
    // subTitle() {
    //   return this.product.subtitle
    // },
    // downcaseTags() {
    //   return this.product.tags.map(tag => tag.toLowerCase())
    // },
    // isNew() {
    //   return this.downcaseTags.includes('new')
    // },
    // isBestSeller() {
    //   return this.downcaseTags.includes('best seller')
    // },
    // nutritionalInfo() {
    //   return this.product.nutritional_info
    // },
    // tagText() {
    //   return this.tag ? this.tag : this.product.type
    // },
    flag() {
      return this.product.flag
    },
    flagHandle() {
      return handleize(this.flag)
    },
    price() {
      return formatPrice(this.product.price)
    }
  }
}
</script>
<style lang="scss" scoped>
.c-product {
  &__flag {
    position: absolute;
    background-color: $color-black;
    color: $color-primary;
    font-size: 18px;
    font-weight: 500;
    padding: 0.5rem 2.25rem;
  }

  &__flag--seasonal-item {
    background-color: $color-primary;
    color: $color-black;
  }
}
</style>
