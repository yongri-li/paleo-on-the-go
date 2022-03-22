<template>
  <div
    :class="[typeClass]"
    class="meal-cart__body"
  >
    <meal-cart-box-sizes
      :size-selected="sizeSelected"
      @change="changeSizeSelected"
      radio-name="cart"
      :class="[haveProductsClass]"
      class="meal-cart__body--boxsize"
    />
    <div
      :class="[haveProductsClass]"
      class="meal-cart__body--changeboxsize"
      @click="openModal"
    >
      Change box size
    </div>
    <meal-cart-pre-built class="meal-cart__body--prebuilt"/>
    <meal-cart-product-list :type-class="typeClass" />
  </div>
</template>


<script>
import MealCartBoxSizes from './MealCartBoxSizes.vue'
import MealCartPreBuilt from './MealCartPreBuilt.vue'
import MealCartProductList from './MealCartProductList.vue'

import { MODAL_SETUP } from '../../store/_mutations-type'

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
    }
  },
  methods: {
    changeSizeSelected(newVal) {
      this.$store.dispatch('changeSizeSelected', newVal)
    },
    openModal() {
      this.$store.commit(MODAL_SETUP, { component: 'ModalBoxSize' })
    }
  }
}
</script>

<style lang="scss" scoped>

.meal-cart__body {
  padding: .8rem;
  @include media-tablet-up {
    padding: 0 .8rem .8rem;
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
      font-size: 1.2rem;
      font-weight: 500;
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

    &--prebuilt, &--boxsize {
      display: none;
    }

  }

}

</style>