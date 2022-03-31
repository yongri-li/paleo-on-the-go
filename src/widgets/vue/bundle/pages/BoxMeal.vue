<template>
  <div class="page o-containerLarge">
    <stepper />
    <div class="content-products-cart">
      <div class="content-products">
        <filter-and-sorting :length-products="products.length" />
        <product-collection :products="products" />
      </div>
      <meal-cart />
    </div>
    <footer-banner
      :items="footerBanner.item"
      :title="footerBanner.content.title"
    />
    <modal v-if="modal.settings.open"/>
  </div>
</template>

<script>
import Stepper from '../components/Stepper/Index.vue'
import FilterAndSorting from '../components/FilterAndSorting/FilterAndSorting.vue'
import ProductCollection from '../components/Products/ProductCollection.vue'
import MealCart from '../components/MealCart/MealCart.vue'
import FooterBanner from '../components/FooterBanner.vue'
import Modal from '../components/Modals/Modal.vue'

import { mapState, mapGetters } from 'vuex'

export default {
  components: {
    Stepper,
    FilterAndSorting,
    ProductCollection,
    MealCart,
    FooterBanner,
    Modal
  },
  created() {
    // watch the params of the route to fetch the data again
    this.$watch(
      () => this.$route.params,
      () => {
        this.setFooter()
      },
      // fetch the data when the view is created and the data is
      // already being observed
      { immediate: true }
    )
  },
  data() {
    return {
      footerBanner: {
        item: [],
        content: {
          title: null
        }
      }
    }
  },
  computed: {
    ...mapState([
      'modal'
    ]),
    ...mapGetters([
      'getProductsFromRoute'
    ]),
    products() {
      return this.getProductsFromRoute(this.$route)
    }
  },
  methods: {
    setFooter() {
      const footerBundle = window.Scoutside.bundle.footerBanner
      const param = this.$route.params.box
      if (param === 'onetime') {
        this.footerBanner = {
          ...footerBundle.oneTime
        }
      }
      else {
        this.footerBanner = {
          content: {
            title: null
          },
          ...footerBundle.subscription
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>

.content-products-cart {
  @include media-tablet-up {
    @include flex($justify: space-between, $align: flex-start);
  }

  .content-products {
    @include media-tablet-up {
      width: 72%;
    }
  }
}

</style>