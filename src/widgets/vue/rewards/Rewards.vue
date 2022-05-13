<template>
  <div class="page o-containerMedium">
    <loyalty-hero class="section" :has-loggin="hasLoggin" @dogotosection="goToSection"/>
    <loyalty-points class="section" ref="earn-points"/>
    <loyalty-rewards class="section" ref="rewards"/>
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
  },
  methods: {
    goToSection(refName) {
      const element = this.$refs[refName].$el
      const top = element.offsetTop
      window.scroll({
        top: top - 100,
        behavior: "smooth"
      });
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