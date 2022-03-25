<template>
  <div class="page o-containerLarge">
    <div class="content-products-cart">
      <product-collection />
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
import ProductCollection from '../components/Products/ProductCollection.vue'
import MealCart from '../components/MealCart/MealCart.vue'
import FooterBanner from '../components/FooterBanner.vue'
import Modal from '../components/Modals/Modal.vue'

import { mapState } from 'vuex'

export default {
  components: {
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
    ])
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

  @media screen and (min-width: 769px) {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
  }
}

</style>