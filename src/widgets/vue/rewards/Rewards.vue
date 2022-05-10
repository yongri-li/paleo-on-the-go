<template>
  <div class="page o-containerMedium">
    <loyalty-hero class="section" :has-loggin="hasLoggin" />
    <loyalty-points class="section"/>
    <loyalty-rewards class="section"/>
    <loyalty-tiers class="section"/>
  </div>
</template>

<script>
import LoyaltyHero from './components/LoyaltyHero.vue'
import LoyaltyPoints from './components/LoyaltyPoints.vue'
import LoyaltyRewards from './components/LoyaltyRewards.vue'
import LoyaltyTiers from './components/LoyaltyTiers.vue'

export default {
  components: {
    LoyaltyHero,
    LoyaltyPoints,
    LoyaltyRewards,
    LoyaltyTiers
  },
  data() {
    return {
      customer: window.customer
    }
  },
  computed: {
    hasLoggin() {
      return !!this.customer.shopify_id.length
    }
  }
}
</script>

<style lang="scss" scoped>
.page {

  .section {
    border-bottom: 2px solid $color-ecru;
    padding: 2rem 0;
  }
  .section:last-child {
    border-bottom: none;
  }
}

.o-containerMedium {
  @include media-tablet-up {
    max-width: 1600px;
    width: 90vw;
    padding: 0;
  }
}
</style>