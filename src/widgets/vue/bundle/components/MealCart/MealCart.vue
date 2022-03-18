<template>
  <div class="meal-cart">
    <div class="meal-cart__info">
      <meal-cart-header
        :type-class="typeClass"
        :have-products-class="haveProductsClass"
        :size-selected="getSizeSelected"
        :cart-length="cartLength"
      />
      <meal-cart-body
        :type-class="typeClass"
        :have-products-class="haveProductsClass"
        :size-selected="getSizeSelected"
      />
    </div>
    <meal-cart-footer
      :subtotal="cartSubTotal"
      :size-selected="getSizeSelected"
      :cart-length="cartLength"
      :cart-add-ons="cartAddOns"
      :type-class="typeClass"
    />
  </div>
</template>

<script>
import MealCartHeader from './MealCartHeader.vue'
import MealCartBody from './MealCartBody.vue'
import MealCartFooter from './MealCartFooter.vue'

import { mapState, mapGetters } from 'vuex'

import { changeRouter } from '../../utils'

export default {
  components: {
    MealCartHeader,
    MealCartBody,
    MealCartFooter
  },
  computed: {
    ...mapState([
      'cart'
    ]),
    ...mapGetters([
      'getSizeSelected'
    ]),
    haveProductsClass() {
      return this.cart.items.length ? 'with-products' : 'without-products'
    },
    typeClass() {
      const orderType = this.$route.params.box || this.getSizeSelected.order_type
      return orderType
    },
    cartLength() {
      let length = 0
      this.cart.items.forEach(item => {
        length += item.quantity
      })
      return length
    },
    cartSubTotal() {
      let subtotal = 0
      this.cart.items.forEach(item => {
        subtotal += item.price * item.quantity
      })
      return subtotal
    },
    cartAddOns() {
      let total = 0
      this.cart.addons.forEach(addon => {
        total += addon.price * addon.quantity
      })
      return total
    }
  },
  mounted() {
    const orderType = this.getSizeSelected.order_type
    changeRouter(orderType)
  }
}
</script>

<style lang="scss" scoped>

.meal-cart {
  position: fixed;
  left: 0;
  bottom: 0;
  z-index: 100;
  width: 100%;
  height: 90vh;
  background-color: $color-white;
  color: $color-black;
  filter: drop-shadow(0px -4px 34px rgba(0, 0, 0, 0.1));
  border-radius: 20px 20px 0px 0px;
  @include flex($justify: space-between, $direction: column, $align: initial, $wrap: nowrap);

  @include media-tablet-up {
    position: relative;
    width: 27%;
    z-index: 0;
    border-radius: 0;
    max-height: 750px;
  }

}

</style>