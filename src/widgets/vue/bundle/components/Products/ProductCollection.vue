<template>
  <div class="product-collection">
    <product-card
      v-for="product in products"
      :key="product.id"
      :product="product"
      class="item"
    />
  </div>
</template>

<script>
import ProductCard from './ProductCard.vue'

export default {
  name: 'ProductCollection',
  components: {
    ProductCard
  },
  props: {
    products: {
      type: Array,
      required: true
    }
  }
}
</script>

<style lang="scss" scoped>

.product-collection {

  .item {
    margin-bottom: 1rem;

    @include media-tablet-up {
      width: 32.6%;
    }
  }

  @include media-tablet-up {
    @include flex($align: flex-start);

    .item:nth-child(3n+2) {
      margin-left: 1%;
      margin-right: 1%;
    }
  }

}


</style>