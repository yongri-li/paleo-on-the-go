<template>
  <div
    v-if="cart.items.length"
    :class="[typeClass]"
    class="product-list"
  >
    <div class="product-list__items">
      <div class="product-list__title" @click="toggleHiddens('items')">
        {{ cartBoxLength }} ITEM BOX
        <div
          :class="{ show: productsHidden.items}"
          class="product-list__title--drop-down"
        >
          <svg width="14" height="8" viewBox="0 0 14 8" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M1.15976 1.14645C0.946747 1.34171 0.946747 1.65829 1.15976 1.85355L6.61431 6.85355C6.82732 7.04881 7.17268 7.04881 7.38569 6.85355L12.8402 1.85355C13.0533 1.65829 13.0533 1.34171 12.8402 1.14645C12.6272 0.951185 12.2819 0.951185 12.0689 1.14645L7 5.79289L1.93115 1.14645C1.71814 0.951185 1.37277 0.951184 1.15976 1.14645Z" fill="#231F20" stroke="#231F20" stroke-width="0.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
      </div>
      <div
        :class="{ hidden: productsHidden.items}"
        class="product-list__products"
      >
        <product-item-cart
          v-for="item in cart.items"
          :key="item.id"
          :product="item"
          :type-class="typeClass"
          where="items"
        />
      </div>
    </div>
    <div class="product-list__addons">
      <div class="product-list__title" @click="toggleHiddens('addons')">
        ONE TIME ADD-ONS
        <div class="product-list__title--qt">
          {{cartAddOnsLength}} ITEM
          <div
            :class="{ show: productsHidden.addons}"
            class="product-list__title--drop-down"
          >
            <svg width="14" height="8" viewBox="0 0 14 8" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M1.15976 1.14645C0.946747 1.34171 0.946747 1.65829 1.15976 1.85355L6.61431 6.85355C6.82732 7.04881 7.17268 7.04881 7.38569 6.85355L12.8402 1.85355C13.0533 1.65829 13.0533 1.34171 12.8402 1.14645C12.6272 0.951185 12.2819 0.951185 12.0689 1.14645L7 5.79289L1.93115 1.14645C1.71814 0.951185 1.37277 0.951184 1.15976 1.14645Z" fill="#231F20" stroke="#231F20" stroke-width="0.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
        </div>
      </div>
      <div
        :class="{ hidden: productsHidden.addons}"
        class="product-list__products"
      >
        <product-item-cart
          v-for="item in cart.addons"
          :key="item.id"
          :product="item"
          where="addons"
        />
      </div>
    </div>
  </div>
</template>

<script>
import ProductItemCart from '../Products/ProductItemCart.vue'

import { mapState } from 'vuex'

export default {
  components: {
    ProductItemCart
  },
  props: {
    typeClass: {
      type: String,
      default: 'subscription'
    },
  },
  created() {
    if(this.typeClass === 'addons') {
      this.setHiddensAddOns()
    }
  },
  data() {
    return {
      productsHidden: {
        items: false,
        addons: false
      }
    }
  },
  computed: {
    ...mapState('babcart', [
      'cart'
    ]),
    cartAddOnsLength() {
      let length = 0
      this.cart.addons.forEach(addon => {
        length += addon.quantity
      })
      return length
    },
    cartBoxLength() {
      let length = 0
      this.cart.items.forEach(item => {
        length += item.quantity
      })
      return length
    }
  },
  methods: {
    setHiddensAddOns() {
      this.productsHidden.items = true
      this.productsHidden.addons = false
    },
    toggleHiddens(typeCart) {
      Object.keys(this.productsHidden).forEach(key => {
        if(key === typeCart) {
          this.productsHidden[key] = !this.productsHidden[key]
        }
        else {
          this.productsHidden[key] = true
        }
      })
    }
  },
  watch: {
    typeClass(newVal, oldVal) {
      // console.log('newVal',newVal)
      if(newVal === 'addons') {
        this.setHiddensAddOns()
      }
    }
  }
}
</script>

<style lang="scss" scoped>

.product-list {

  &__title, &__addons {
    display: none;
  }

  &__products {
    height: calc(96vh - 430px);
    overflow-y: scroll;
    transition: all .7s ease-out;

    @include media-tablet-up {
      height: 43vh;
      max-height: 410px;
    }
  }
}

.addons {
  .product-list {

  &__title {
    @include flex($align: flex-end, $justify: space-between);
    font-family: $font-heading;
    font-size: 1.4rem;
    background-color: #EFEDE6;
    padding: 0.5rem 0.8rem;
    cursor: pointer;

    &--qt {
      @include flex();
      font-family: $font-body;
      font-size: 1rem;
    }

    &--drop-down {
      margin-left: 8px;
      transition: all .3s ease;
    }
    &--drop-down.show {
      transform: rotate(180deg);
    }

  }

  &__addons {
    display: block;
    margin-top: .3rem;
  }

  &__products.hidden {
    height: 0;
  }

  &__products {
    height: 55vh;

    @include media-tablet-up {
      height: 40vh;
    }
  }
}
}

</style>