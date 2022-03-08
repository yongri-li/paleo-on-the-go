<template>
  <div class="product-collection">
    <product-card class="item active" :addToCartOpen="true"/>
    <product-card class="item"/>
    <product-card class="item"/>
    <product-card class="item"/>
  </div>
</template>

<script>
import ProductCard from './ProductCard.vue'

export default {
  name: 'Product Collection',
  components: {
    ProductCard
  }
}
</script>

<style lang="scss" scoped>

.product-collection {

  .item {
    margin-bottom: 1rem;

    @media screen and (min-width: 769px) {
      width: 32%;
    }
  }

  @media screen and (min-width: 769px) {
    max-width: 950px;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
  }

}


</style>