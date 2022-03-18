<template>
  <div
    v-if="cart.items.length"
    :class="[typeClass]"
    class="product-list"
  >
    <div class="product-list__items">
      <div class="product-list__title" @click="toggleHiddens('items')">
        {{ cart.items.length }} ITEM BOX
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
        />
      </div>
    </div>
    <div class="product-list__addons">
      <div class="product-list__title" @click="toggleHiddens('addons')">
        ONE TIME ADD-ONS
      </div>
      <div
        :class="{ hidden: productsHidden.addons}"
        class="product-list__products"
      >
        <product-item-cart
          v-for="item in cart.addons"
          :key="item.id"
          :product="item"
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
    ...mapState([
      'cart'
    ])
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
      console.log('newVal',newVal)
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
    height: 43vh;
    overflow-y: scroll;
    transition: all .7s ease-out;
  }
}

.addons {
  .product-list {

  &__title {
    @include flex($align: flex-end, $justify: space-between);
    font-family: $font-heading;
    font-size: 2rem;
    background-color: #EFEDE6;
    padding: 0.5rem 0.8rem;
    cursor: pointer;
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