<template>
  <div :class="_buildModifiers('c-shipments', modifiers)">
    <c-shipmentsLoading class="c-shipments__loading" v-if="!ready" />

    <article class="box__byAddressId">
      <div class="c-shipments__content" v-if="ready">
        <section class="c-shipments__flex">
          <h2 class="c-h2">{{ !!nextCharge ? 'Upcoming Orders' : 'Order History' }}</h2>
          <c-shipmentsBox
            class="c-shipments__box"
            :charge="nextCharge"
            :addons="null"
            :content="content"
            :shipDate="formatDayDateIOS(nextCharge.scheduledAt)"
          />
        </section>
      </div>
    </article>
  </div>
</template>

<script>
import { mapGetters, mapState, mapActions, mapMutations } from 'vuex'
import cShipmentsLoading from '../shipments/cShipmentsLoading.vue'
import cShipmentsEmpty from '../shipments/cShipmentsEmpty.vue'
import cShipmentsBox from '../shipments/cShipmentsBox.vue'
import { format } from 'date-fns'
import { convertToYYYYMMDDlocalT } from '@shared/utils'

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
      'customerSubscriptionById',
      'customerSubscriptionsByAddress',
      'customerSubscriptionsByIds',
      ['customerShopify']
    ]),
    content() {
      return this.$store.getters['customize/customizeContentByKey']('shipments')
    },
    // subscriptions() {
    //   // return this.$store.getters['customize/customizeContentByKey']('shipments')
    //   //return this.$store.getters['customer/customerSubscriptionsByAddress'](this.nextCharge.addressId)
    //   return this.$store.state.customer.resources.subscriptions
    // },
    nextCharge() {
      return this.customerUpcomingCharge[0]
      // return this.customerUpcomingCharges?.filter(
      //   (chrg) => chrg.status !== ('REFUNDED' || 'CANCELLED')
      // )
    }
  },
  methods: {
    formatDayDateIOS(date) {
      const dateCvt = new Date(date)
      const dateStr = convertToYYYYMMDDlocalT(dateCvt)
      return dateStr != null ? format(new Date(dateStr), 'MMM D') : null
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

.c-shipments__flex {
  max-width: 1240px;
  padding: 2rem 0 4rem;
  margin: 0 auto;
}
</style>
