<template>
  <div class="page o-containerLarge">
    <stepper />
    <div class="content-products-cart">
      <div class="content-products">
        <filter-and-sorting :length-products="lengthProductsAvailable" />
        <h4 class="under-filter__text">{{ underFilterText }}</h4>
        <product-collection :products="products" />
      </div>
      <meal-cart />
    </div>
    <footer-banner :items="footerBanner.item" :title="footerBanner.content.title" />
    <modal v-if="modal.settings.open" />
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
    this.setUnderFilterText(this.$route.params.box)
  },
  data() {
    return {
      footerBanner: {
        item: [],
        content: {
          title: null
        }
      },
      ...window.Scoutside.bundle.sectionText,
      underFilterText: null
    }
  },
  computed: {
    ...mapState('modals', ['modal']),
    ...mapState('babcart', ['cart']),
    ...mapGetters('products', ['getProductsFromRoute']),
    products() {
      return this.getProductsFromRoute(this.$route)
    },
    lengthProductsAvailable() {
      return this.products.filter(product => product.available).length
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
      } else {
        this.footerBanner = {
          content: {
            title: null
          },
          ...footerBundle.subscription
        }
      }
    },
    setUnderFilterText(param) {
      const text = {
        subscription: this.content.meals_title,
        addons: this.content.addons_title,
        onetime: this.content.onetime_title
      }
      this.underFilterText = text[param] ?? null
    }
  },
  watch: {
    $route() {
      this.setUnderFilterText(this.$route.params.box)
    }
  }
}
</script>

<style lang="scss" scoped>
.content-products-cart {
  @include media-tablet-up {
    @include flex($justify: space-between, $align: flex-start, $wrap: nowrap);
  }

  .content-products {
    @include media-tablet-up {
      width: 100%;
      padding-right: 1.56rem;
    }
  }

  .under-filter__text {
    padding-top: 0.5rem;
    margin-bottom: 1rem;
  }
}
</style>
