<template>
  <div class="page">
    <product-collection />
    <footer-banner
      :items="footerBanner.item"
      :title="footerBanner.content.title"
    />
  </div>
</template>

<script>
import ProductCollection from '../components/Products/ProductCollection.vue'
import FooterBanner from '../components/FooterBanner.vue'

export default {
  components: {
    ProductCollection,
    FooterBanner
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