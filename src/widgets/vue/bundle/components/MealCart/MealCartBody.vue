<template>
  <div :class="[typeClass]" class="meal-cart__body">
    <meal-cart-box-sizes
      :size-selected="sizeSelected"
      @change="changeSizeSelected"
      radio-name="cart"
      :class="[haveProductsClass]"
      class="meal-cart__body--boxsize"
    />
    <div :class="[haveProductsClass]" class="meal-cart__body--changeboxsize" @click="openModal">
      Change box size
    </div>
    <meal-cart-pre-built class="meal-cart__body--prebuilt" :sizeSelect="sizeSelect" />
    <meal-cart-product-list :type-class="typeClass" :from-portal="fromPortal" />
  </div>
</template>

<script>
import MealCartBoxSizes from './MealCartBoxSizes.vue'
import MealCartPreBuilt from './MealCartPreBuilt.vue'
import MealCartProductList from './MealCartProductList.vue'

import { mapActions } from 'vuex'

import { MODAL_SETUP } from '../../store/modules/modals/_mutations-type'

export default {
  components: {
    MealCartBoxSizes,
    MealCartPreBuilt,
    MealCartProductList
  },
  props: {
    typeClass: {
      type: String,
      default: 'subscription'
    },
    haveProductsClass: {
      type: String,
      default: 'without-products'
    },
    sizeSelected: {
      type: Object,
      required: true
    },
    fromPortal: {
      type: Boolean
    }
  },
  data() {
    return {
      sizeSelect: null
    }
  },
  methods: {
    ...mapActions('mealcart', ['validateChangeSizeSelected']),
    changeSizeSelected(newVal) {
      this.validateChangeSizeSelected(newVal)
      this.sizeSelect = newVal
    },
    openModal() {
      this.$store.commit(`modals/${MODAL_SETUP}`, {
        component: 'ModalBoxSize'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.meal-cart__body {
  padding: 0.8rem;
  @include media-tablet-up {
    padding: 0 0.8rem 0.8rem;
  }

  &--boxsize.with-products {
    @include media-tablet-up {
      display: none;
    }
  }

  &--changeboxsize {
    display: none;
  }

  &--changeboxsize.with-products {
    @include media-tablet-up {
      display: block;
      font-size: 1rem;
      font-weight: 600;
      text-transform: capitalize;
      text-decoration: underline;
      cursor: pointer;
    }
  }
}

.addons {
  .meal-cart__body {
    &--changeboxsize.with-products {
      @include media-tablet-up {
        display: none;
      }
    }

    &--prebuilt,
    &--boxsize {
      display: none;
    }
  }
}
</style>
