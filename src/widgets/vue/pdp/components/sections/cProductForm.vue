<template>
  <div class="productForm__container" :class="{ 'productForm--addOn': isFreshAddOn }">
    <div class="productForm__productType" :class="`c-product--${modifier}`">
      {{ productTypeCovtFresh }}
    </div>

    <!-- 'productType--evergreen' : isFreshPlus -->
    <h1 class="c-h1 c-heading productForm__header">{{ title }}</h1>
    <p v-if="subtitle" class="c-p1 productForm__subHeader">{{ subtitle }}</p>
    <p v-if="productPrice" class="c-p1 productForm__subHeader">{{ productPrice }}</p>
    <p class="c-p1 productForm__description u-hideMobileDown">
      {{ product.description }}
    </p>

    <div class="productForm__row">
      <c-button
        class="c-cta productForm__atcButton"
        v-if="isFullPage || isCustomer"
        @click="handleAdd"
        :loading="loading"
        :text="added ? addedTxt : labels.atc"
        :modifiers="['isCta', 'isTall', 'hideTextLoading']"
        :attributes="{ disabled: loading }"
        :class="added ? 'item--added' : ''"
      />
      <c-button
        class="c-cta productForm__atcButton"
        v-else
        @click="handleGetStarted"
        :loading="loading"
        :text="labels.getStarted"
        :modifiers="['isCta', 'isTall', 'hideTextLoading']"
        :attributes="{ disabled: loading }"
      />
      <c-product-blurb class="u-hideMobileDown" :content="blurbContent" />
    </div>

    <c-nutrition-counter class="u-hideMobileDown" :content="productNutrition" />
  </div>
</template>
<script>
import { formatPrice, handleize } from '../../utils'
import cButton from '@shared/components/core/cButton.vue'
import cProductBlurb from './cProductBlurb.vue'
import cNutritionCounter from './cNutritionCounter.vue'

export default {
  props: {
    labels: {
      type: Object,
      required: false
    },
    blurbContent: {
      type: Object,
      required: false
    },
    product: {
      type: Object,
      required: true
    },
    isAddOn: {
      type: Boolean
    },
    productDetails: {
      type: Object,
      required: false
    },
    productNutrition: {
      type: Object
    },
    isFullPage: {
      type: Boolean,
      default: false
    },
    url_getStarted: {
      type: String
    }
  },
  data: () => ({
    loading: false,
    added: false,
    addedTxt: 'Added'
  }),
  computed: {
    title() {
      return this.product.title
    },
    productSecondaryTitle() {
      return this.productDetails.hasOwnProperty('subtitle') ? this.productDetails.subtitle : false
    },
    subtitle() {
      return this.productSecondaryTitle
      // return this.isFreshPlus
      // return this.isFreshAddOn
      //   ? `${formatPrice(this.product.price)}`
      //   : this.productSecondaryTitle;
    },
    productPrice() {
      if (this.isFreshAddOn) return `${formatPrice(this.product.price)}`
    },
    variant() {
      return this.product.variants.find(el => el.title == 'Regular')
    },
    modifier() {
      return this.isAddOn ? 'addOn' : this.productTypeHandle
    },
    productTypeHandle() {
      return handleize(this.product.type)
    },
    productTypeCovtFresh() {
      return this.product.type === 'Fresh Plus' ? this.product.type.replace(' Plus', '+') : this.product.type
    },
    isCustomer() {
      return customer.email && customer.shopify_id ? true : false
    },
    isFreshAddOn() {
      return this.product.type === 'Fresh Plus' ? true : false
    }
  },
  components: {
    cButton,
    cProductBlurb,
    cNutritionCounter
  },
  methods: {
    handleAdd() {
      this.loading = true

      sessionStorage.setItem('from_pdp', 'true')

      const item = this.product
      const mealJson = sessionStorage.getItem('bundle_content')
      const addonJson = sessionStorage.getItem('addon_content')
      const meals = JSON.parse(mealJson)
      const addons = JSON.parse(addonJson)
      let qty

      if (this.isFreshAddOn) {
        for (const itmQty in addons) {
          if (addons[itmQty].id === item.id) {
            qty = addons[itmQty].quantity
          }
        }
      } else {
        for (const itmQty in meals) {
          if (meals[itmQty].id === item.id) {
            qty = meals[itmQty].quantity
          }
        }
      }

      item.quantity = qty + 1
      sessionStorage.setItem('addcart_item', JSON.stringify(item))
      if (this.isFreshAddOn) {
        sessionStorage.setItem('is_addOn', true)
      } else {
        sessionStorage.setItem('is_addOn', false)
      }
      // sessionStorage.setItem('from_pdp', 'true');
      setTimeout(() => {
        this.loading = false
        this.added = true
      }, 1000)
    },
    handleGetStarted() {
      this.loading = true
      this.isCustomer
        ? (window.location.href = '/account/#/details')
        : (window.location = this.url_getStarted)
    }
  }
}
</script>
<style lang="scss">
.productForm__container {
  padding-left: 20px;

  @include media-desktop-up {
    padding-left: 100px;
  }
}
.productForm__productType {
  padding: 10px 10px 7px 11px;
  /*width: min-content;*/
  width: auto;
  border-radius: 6px;
  color: $color-white;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-size: 11.5px;
  font-weight: bold;

  &.productType--evergreen {
    background: $color-secondary;
    border: 1px solid $color-secondary;
  }
}
.productForm__container {
  display: flex;
  flex-flow: column;
  align-items: center;

  @include media-tablet-up {
    align-items: flex-start;
  }
}
.productForm__header {
  padding-top: 14px;
  margin-bottom: 0px;
  text-align: center;

  @include media-tablet-up {
    padding-top: 20px;
    text-align: left;
  }
}
.productForm__subHeader {
  color: $color-grey;
  padding-top: 10px;
  letter-spacing: -0.02em;
  font-size: 17px;
  text-align: center;

  @include media-tablet-up {
    font-size: 22px;
    text-align: left;
  }

  .productForm--addOn & {
    color: $color-black;
  }
}

.productForm__subHeader + .productForm__subHeader {
  margin-top: -1.5rem;
}

.productForm__description {
  color: $color-black;
  font-size: 17px;
  line-height: 150%;
}
.productForm__row {
  display: flex;
  flex-flow: row;
  justify-content: center;
  width: 100%;
  position: fixed;
  bottom: 20px;
  left: 0;
  right: 0;
  z-index: 11;

  @include media-tablet-up {
    position: relative;
    justify-content: flex-start;
    padding: 30px 0px 32px;
    border-bottom: 1px solid $color-white;
  }

  @include media-tablet-down {
    top: unset;
    bottom: -1px;
    background-color: #fbfaf4;
    border-radius: 20px 20px 0 0;
    padding: 1rem;
    text-align: center;
    z-index: 1002;
  }
}
.productForm__atcButton {
  width: 100%;
  letter-spacing: 0.02em;
  color: #fbfaf4;
  border-radius: 40px;
  height: 54px;
  font-weight: 600;
  font-size: 16px;

  @include media-tablet-up {
    max-width: 215px;
    margin-right: 30px;
  }
}

.c-cta.item--added {
  pointer-events: none;
}
</style>
