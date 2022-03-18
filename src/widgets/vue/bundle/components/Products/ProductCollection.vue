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
import { mapState } from 'vuex'

export default {
  name: 'ProductCollection',
  components: {
    ProductCard
  },
  computed: {
    ...mapState([
      'collections',
      'cart'
    ]),
    products() {
      const param = this.$route.params.box
      const collectionFound = this.collections.find(collection => collection.url === param)
      return !!collectionFound ? collectionFound.products : this.collections[0].products
    }
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
    width: 73%;
    display: flex;
    flex-wrap: wrap;

    .item:nth-child(3n+2) {
      margin-left: 1%;
      margin-right: 1%;
    }
  }

}


</style>