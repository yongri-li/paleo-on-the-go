<template>
  <div class="yc-body">
    <product-item-cart
      v-for="item in cartItems.general"
      :key="item.id"
      :product="item"
      class="yc-body__item"
    />
  </div>
</template>

<script>
import ProductItemCart from '../Products/ProductItemCart.vue'
import { mapState } from 'vuex'

export default {
  components: {
    ProductItemCart
  },
  computed: {
    ...mapState('cartdrawer', [
      'cartItems'
    ])
  }
}
</script>

<style lang="scss" scoped>
.yc-body {
  &__item {
    margin-bottom: .5rem;
  }
}
</style>

