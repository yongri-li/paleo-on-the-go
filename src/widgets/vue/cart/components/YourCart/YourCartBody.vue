<template>
  <div class="yc-body">
    <product-item-cart
      v-for="item in filteredItems"
      :key="item.id"
      :product="item"
      class="yc-body__item"
    />
  </div>
</template>

<script>
import ProductItemCart from "../Products/ProductItemCart.vue";
import { mapState } from "vuex";

export default {
  components: {
    ProductItemCart,
  },
  computed: {
    ...mapState("cartdrawer", ["cartItems"]),
    filteredItems() {
      return this.cartItems.general.filter((item) => item.hide !== true);
    },
  },
};
</script>

<style lang="scss" scoped>
.yc-body {
  &__item {
    margin-bottom: 1rem;
    &:last-child {
      margin-bottom: 0;
    }
  }
}
</style>
