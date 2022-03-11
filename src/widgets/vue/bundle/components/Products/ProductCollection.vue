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
  created() {
    // watch the params of the route to fetch the data again
    this.$watch(
      () => this.$route.params,
      () => {
        this.setProducts()
      },
      // fetch the data when the view is created and the data is
      // already being observed
      { immediate: true }
    )
  },
  data() {
    return {
      products: []
    }
  },
  computed: {
    ...mapState([
      'collections',
      'cart'
    ])
  },
  methods: {
    setProducts() {
      const param = this.$route.params.box
      const collectionFound = this.collections.find(collection => collection.url === param)
      if(!!collectionFound){
        this.products = collectionFound.products
      }
      else {
        this.products = this.collections[0].products
      }
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