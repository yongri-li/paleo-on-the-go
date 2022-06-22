<template>
  <div :class="[`c-product--cta`, { 'c-product--selected': selected }]">
    <!--  c-product--${modifier} -->
    <div class="c-product__inner">
      <a :href="productLink" class="">
        <div class="c-product__image-side">
          <span v-if="flag" :class="`c-product__flag c-product__flag--${flagHandle}`">
            {{ flag }}
          </span>
          <div class="c-product__image-wrapper">
            <img class="c-product__image" :src="product.images[0]" :alt="product.title" />
          </div>
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
      </a>
    </div>
  </div>
</template>

<script>
import { formatPrice, handleize, getOutOfStock } from '../../utils'

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
    },
    relatedMeal: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    selected() {
      return this.quantity > 0
    },
    // modifier() {
    //   return this.isAddOn ? 'addOn' : this.productTypeHandle
    // },
    // isNew() {
    //   return this.downcaseTags.includes('new')
    // },
    // isBestSeller() {
    //   return this.downcaseTags.includes('best seller')
    // },
    // tagText() {
    //   return this.tag ? this.tag : this.product.type
    // },
    outOfStock() {
      const inventoryData = this.product.inventory[0]
      const tags = this.product.tags

      return getOutOfStock({ tags, inventoryData })
    },
    flag() {
      return this.outOfStock ? 'Out Of Stock' : this.product.flag
    },
    flagHandle() {
      return this.flag ? handleize(this.flag) : null
    },
    price() {
      return formatPrice(this.product.price)
    },
    productLink() {
      return `/products/${this.product.handle}`
    }
  }
}
</script>
<style lang="scss">
.c-product {
  &__flag {
    position: absolute;
    background-color: $color-black;
    color: $color-primary;
    font-size: 18px;
    font-weight: 500;
    padding: 0.5rem 2.25rem;
    z-index: 9;
  }

  &__flag--seasonal-item {
    background-color: $color-primary;
    color: $color-black;
  }

  &__flag--most-popular {
    background-color: $color-secondary;
    color: $color-black;
  }

  &__flag--out-of-stock {
    background-color: #c63636;
    color: $color-white;
    text-transform: uppercase;
    display: block !important;
  }
}
</style>
