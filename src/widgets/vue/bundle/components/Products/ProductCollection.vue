<template>
  <div class="product-collection">
    <div v-for="product in productsAvailable" :key="product.id" class="item">
      <product-card :product="product" />
    </div>
  </div>
</template>

<script>
import ProductCard from "./ProductCard.vue";

export default {
  name: "ProductCollection",
  components: {
    ProductCard,
  },
  props: {
    products: {
      type: Array,
      required: true,
    },
  },
  computed: {
    productsAvailable() {
      return this.products.filter((product) => product.available);
    },
  },
};
</script>

<style lang="scss" scoped>
.product-collection {
  .item {
    margin-bottom: 1rem;

    @include media-tablet-up {
      width: 50%;
    }
    @include media-desktop-up {
      width: 33.3333333%;
    }
  }

  @include media-tablet-up {
    @include flex($align: flex-start);

    margin: 0 -6px;
    .item {
      padding-left: 6px;
      padding-right: 6px;
    }
  }
}
</style>
