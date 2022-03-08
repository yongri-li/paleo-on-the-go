<template>
  <div id="meal-builder">
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
import FooterBanner from './components/FooterBanner.vue'

export default {
  name: 'Meal Builder',
  components: {
    FooterBanner
  },
  data() {
    return {
      ...window.Scoutside.bundle,
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