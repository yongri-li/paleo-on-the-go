<template>
  <div class="c-shipments__hero" v-if="content" :style="{ backgroundImage: `url('${content.bg_image_lg}')` }">
    <section class="c-shipments__hero--wrap">
      <h1 class="c-h1">
        Your Next Box is<br />
        Set for <span> {{ formatDayDateIOS(nextCharge.scheduledAt) }}</span>
      </h1>
      <h5 class="c-h5">Rewards Balance: {{ '1,200 Points' }}</h5>
      <div class="c-shipments__hero--btns">
        <button class="c-button c-button--isDefault c-button--isPrimary">Earn Points</button>
        <button class="c-button c-button--isDefault c-button--isPrimary">Redeem Rewards</button>
      </div>
    </section>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { format } from 'date-fns'
import { convertToYYYYMMDDlocalT } from '@shared/utils'

export default {
  name: 'cPortalHero',
  props: {
    modifiers: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    ...mapGetters('customer', ['customerUpcomingCharge']),
    content() {
      return this.$store.getters['customize/customizeContentByKey']('shipments')
    },
    nextCharge() {
      return this.customerUpcomingCharge[0]
    }
  },
  methods: {
    formatDayDateIOS(date) {
      const dateCvt = new Date(date)
      const dateStr = convertToYYYYMMDDlocalT(dateCvt)
      return dateStr != null ? format(new Date(dateStr), 'MMM D') : null
    }
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
  }
}
</style>
