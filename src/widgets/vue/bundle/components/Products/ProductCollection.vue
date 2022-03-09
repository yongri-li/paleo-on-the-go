<template>
  <div class="product-collection">
    <product-card
      v-for="product in collections[0].products"
      :key="product.id"
      :product="product"
      class="item"
    />
  </div>
</template>

<script>
import ProductCard from './ProductCard.vue'
import { mapState } from 'vuex'

export default {
  name: 'ProductCollection',
  components: {
    ProductCard
  },
  computed: {
    ...mapState(['collections'])
  },
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

    .item:nth-child(3n+2) {
      margin-left: 1%;
      margin-right: 1%;
    }
  }

}


</style>