<template>
  <div :class="_buildModifiers('c-shipments', modifiers)">
    <c-shipmentsLoading class="c-shipments__loading" v-if="!ready" />

    <div class="c-shipments__hero" :style="{ backgroundImage: `url('${content.bg_image_lg}')` }">
      <section class="c-shipments__hero--wrap">
        <h1 class="c-h1">
          Your Next Box is<br />
          Set for {{}}
        </h1>
        <h5 class="c-h5">Rewards Balance: {{ '1,200 Points' }}</h5>
        <div class="c-shipments__hero--btns">
          <button class="c-button c-button--isDefault c-button--isPrimary">Earn Points</button>
          <button class="c-button c-button--isDefault c-button--isPrimary">Redeem Rewards</button>
        </div>
      </section>
    </div>

    <div class="c-shipments__content" v-if="ready">
      <section class="c-shipments__flex">
        <h2 class="c-h2">{{ nextCharge.length ? 'Upcoming Orders' : 'Order History' }}</h2>
        <c-shipmentsBox
          class="c-shipments__box"
          :charge="nextCharge"
          :content="{
            test: 'hey'
          }"
        />
      </section>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState, mapActions, mapMutations } from 'vuex'
import cShipmentsLoading from '../shipments/cShipmentsLoading.vue'
import cShipmentsEmpty from '../shipments/cShipmentsEmpty.vue'
import cShipmentsBox from '../shipments/cShipmentsBox.vue'

export default {
  props: {
    modifiers: {
      type: Array,
      default: () => []
    }
  },
  components: {
    cShipmentsLoading,
    cShipmentsEmpty,
    cShipmentsBox
  },
  computed: {
    ...mapGetters('customer', [
      'customerUpcomingCharge',
      // 'customerRecharge',
      // 'customerUpcomingCharges',
      // 'customerChargeToAddress',
      // 'customerAddressesWithStatus',
      ['customerShopify']
    ]),
    content() {
      return this.$store.getters['customize/customizeContentByKey']('shipments')
    },
    nextCharge() {
      return this.customerUpcomingCharge[0]
      // return this.customerUpcomingCharges?.filter(
      //   (chrg) => chrg.status !== ('REFUNDED' || 'CANCELLED')
      // )
    }
  },
  async created() {
    if (this.customerRecharge) {
      const { success, error } = await this.customerSetResources({
        resources: ['addresses', 'charges', 'onetimes', 'subscriptions']
      })
      if (error) this.error = error
      this.ready = true
    } else this.ready = true
  }
}
</script>

<style lang="scss">
/*.c-shipments__flex {
  max-width: 1240px;
  margin: 0 auto;
  padding: 30px 0 60px;
  @include flex($direction: column, $wrap: nowrap);
  @include media-desktop-up {
    padding-top: 40px;
    @include flex($justify: space-between, $align: flex-start, $wrap: nowrap);
  }
}*/

.c-shipments {
  background-color: $color-ecru;
}

.c-shipments__hero {
  background-size: cover;
  min-height: 260px;
  padding: 3rem 0;

  .c-shipments__hero--wrap {
    max-width: 1240px;
    margin: 0 auto;

    .c-shipments__hero--btns {
      display: flex;
      grid-gap: 1.5rem;
    }
  }
}

.c-shipments__flex {
  max-width: 1240px;
  padding: 2rem 0 4rem;
  margin: 0 auto;
}
</style>
