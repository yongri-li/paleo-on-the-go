<template>
  <div
    class="c-shipments__hero"
    v-if="content && !isMobile"
    :style="{ backgroundImage: `url('${content.bg_image_lg}')` }"
  >
    <section class="c-shipments__hero--wrap" v-if="nextCharge">
      <h1 class="c-h1">
        {{ content.main_heading }}<span> {{ formatDayDateIOS(nextCharge.scheduledAt) }}</span>
      </h1>
      <h5 class="c-h5">Rewards Balance: {{ rewardPoints }} </h5>
      <div class="c-shipments__hero--btns">
        <button class="c-button c-button--isDefault c-button--isPrimary" @click="goToPoints('earn')">Earn Points</button>
        <button class="c-button c-button--isDefault c-button--isPrimary" @click="goToPoints('redeem')">Redeem Rewards</button>
      </div>
    </section>
    <section class="c-shipments__hero--wrap" v-else>
      <h1 class="c-h1">{{ content.no_subs_hero_heading }}, {{ firstName }}</span></h1>
    </section>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { format } from 'date-fns'
import { convertToYYYYMMDDlocalT } from '@shared/utils'

export default {
  name: 'cPortalHero',
  data() {
    return {
      isMobile: false
    }
  },
  props: {
    modifiers: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    ...mapGetters('customer', ['customerUpcomingCharges']),
    content() {
      return this.$store.getters['customize/customizeContentByKey']('shipments')
    },
    nextCharge() {
      return this.customerUpcomingCharges?.length ? this.customerUpcomingCharges[0] : null
    },
    firstName() {
      return customer.first_name
    },
    rewardPoints() {
      return document.querySelector('.lion-loyalty-widget__points')?.textContent
    }
  },
  methods: {
    formatDayDateIOS(date) {
      const dateCvt = new Date(date)
      const dateStr = convertToYYYYMMDDlocalT(dateCvt)
      return dateStr != null ? format(new Date(dateStr), 'MMM D') : null
    },
    onResize() {
      this.isMobile = window.innerWidth < 768 ? true : false
    },
    goToPoints(action){
      const href = action === 'earn' ? '/pages/rewards#earn-points' : '/pages/rewards#rewards'
      window.location.href = href
    }
  },
  created() {
    if (window.innerWidth < 768) this.isMobile = true
    window.addEventListener('resize', this.onResize)
  }
}
</script>

<style lang="scss">
.c-shipments__hero {
  background-size: cover;
  min-height: 260px;
  padding: 3rem 0;

  .c-shipments__hero--wrap {
    width: 92vw;
    max-width: 1600px;
    margin: 0 auto;

    h1 span {
      color: $color-white;
      -webkit-text-stroke: 1px $color-black;
    }

    .c-shipments__hero--btns {
      display: flex;
      grid-gap: 1.5rem;
    }

    @include media-desktop-up {
      h1 {
        max-width: 37vw;
      }
    }
  }
}
</style>
