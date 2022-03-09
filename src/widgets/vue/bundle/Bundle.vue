<template>
  <div id="meal-builder">
    <product-collection />
    <footer-banner v-if="page === 'One Time'"
      :items="footerBanner.oneTime.item"
      :title="footerBanner.oneTime.content.title"
    />
    <footer-banner v-else
      :items="footerBanner.subscription.item"
    />
  </div>
</template>

<script>
import ProductCollection from './components/Products/ProductCollection.vue'
import FooterBanner from './components/FooterBanner.vue'

export default {
  name: 'MealBuilder',
  components: {
    ProductCollection,
    FooterBanner
  },
  data() {
    return {
      footerBanner: window.Scoutside.bundle.footerBanner,
      page: 'Subscription'
    }
  }
}
</script>

<style lang="scss" scoped>

#meal-builder {
  position: relative;
  background-color: #F3F0E9;
  padding: .8rem;
}

</style>