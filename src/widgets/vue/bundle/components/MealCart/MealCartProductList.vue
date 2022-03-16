<template>
  <div class="product-list"
    v-if="cart.items.length"
  >
    <product-item-cart
      v-for="item in cart.items"
      :key="item.id"
      :product="item"
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
    ...mapState([
      'cart'
    ])
  }
}
</script>

<style lang="scss" scoped>

.product-list {
  height: 43vh;
  overflow-y: scroll;
}

</style>