<template>
  <div :class="_buildModifiers('c-shipments', modifiers)">
    <c-shipmentsLoading class="c-shipments__loading" v-if="!ready" />

    <article class="box__byAddressId">
      <div class="c-shipments__content" v-if="ready">
        <c-shipmentsChargeFailed v-if="isFailedCharge" :content="content" class="c-shipments__callout" />
        <!-- :newCardPending="" -->
        <section
          v-for="(charge, i) in charges"
          class="c-shipments__flex"
          :class="isFailedCharge && 'grey-out'"
        >
          <h2 v-if="!!charge && i < 1" class="c-h2">Upcoming Orders</h2>
          <c-shipmentsBox
            v-if="content"
            class="c-shipments__box"
            :charge="charge"
            :addons="null"
            :content="content"
            :boxNumber="i"
            :addressId="charge.addressId"
            :allProducts="allProducts"
            :shipDate="formatDayDateIOS(charge.scheduledAt)"
          />
        </section>
        <c-shipmentsEmpty v-if="charges.length < 1" :content="content" :isRecharge="isRecharge" />
      </div>
    </article>

    <c-faqAccordion
      v-if="content && charges && charges.length"
      :faqs="content.portal_faq"
      :title="faqTitle"
    />
  </div>
</template>

<script>
import { mapGetters, mapState, mapActions, mapMutations } from 'vuex'
import cShipmentsLoading from '../shipments/cShipmentsLoading.vue'
import cShipmentsEmpty from '../shipments/cShipmentsEmpty.vue'
import cShipmentsBox from '../shipments/cShipmentsBox.vue'
import cShipmentsChargeFailed from '../shipments/cShipmentsChargeFailed.vue'
import cFaqAccordion from '@shared/components/core/cFaqAccordion.vue'
import { format } from 'date-fns'
import { convertToYYYYMMDDlocalT } from '@shared/utils'

export default {
  props: {
    modifiers: {
      type: Array,
      default: () => []
    },
    allProducts: {
      type: Array,
      required: true
    },
    isRecharge: {
      type: Boolean
    }
  },
  components: {
    cShipmentsLoading,
    cShipmentsEmpty,
    cShipmentsBox,
    cShipmentsChargeFailed,
    cFaqAccordion
  },
  computed: {
    ...mapState('customer', ['addressIds']),
    ...mapGetters('customer', [
      'customerUpcomingCharge',
      'customerUpcomingCharges',
      'customerChargeError',
      ['customerShopify']
    ]),
    content() {
      return this.$store.getters['customize/customizeContentByKey']('shipments')
    },
    charges() {
      return this.customerUpcomingCharges?.filter(chrg => chrg.status !== ('REFUNDED' || 'CANCELLED'))
    },
    isFailedCharge() {
      return this.charges?.some(chrg => chrg.status === 'ERROR') || !!this.customerChargeError
    },
    faqTitle() {
      const titleArr = this.content.faqs_title.split(' ')
      const firstWord = titleArr.shift()
      const rest = titleArr.join(' ')
      return [firstWord, rest]
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
.c-shipments {
  background-color: $color-ecru;

  .grey-out {
    opacity: 0.5;
    pointer-events: none;
  }
}

.c-shipments__flex {
  max-width: 1240px;
  padding: 2rem 0;
  margin: 0 auto;
}
</style>
