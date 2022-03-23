<template>
  <div :class="_buildModifiers('c-shipments', modifiers)">
    <c-shipmentsLoading class="c-shipments__loading" v-if="!ready" />

    <article class="box__byAddressId">
      <div class="c-shipments__content" v-if="ready">
        <section v-for="(charge, i) in charges" class="c-shipments__flex">
          <h2 class="c-h2">{{ !!charge && i < 1 ? 'Upcoming Orders' : null }}</h2>
          <c-shipmentsBox
            v-if="content"
            class="c-shipments__box"
            :charge="charge"
            :addons="null"
            :content="content"
            :boxNumber="i"
            :addressId="addressIds[i]"
            :shipDate="formatDayDateIOS(charge.scheduledAt)"
          />
        </section>
      </div>
    </article>

    <c-faqAccordion v-if="content" :content="content.portal_faq" />
  </div>
</template>

<script>
import { mapGetters, mapState, mapActions, mapMutations } from 'vuex'
import cShipmentsLoading from '../shipments/cShipmentsLoading.vue'
import cShipmentsEmpty from '../shipments/cShipmentsEmpty.vue'
import cShipmentsBox from '../shipments/cShipmentsBox.vue'
import cFaqAccordion from '@shared/components/core/cFaqAccordion.vue'
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
    cShipmentsBox,
    cFaqAccordion
  },
  computed: {
    ...mapState('customer', ['addressIds']),
    ...mapGetters('customer', ['customerUpcomingCharge', 'customerUpcomingCharges', ['customerShopify']]),
    content() {
      return this.$store.getters['customize/customizeContentByKey']('shipments')
    },
    charges() {
      return this.customerUpcomingCharges
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
}

.c-shipments__flex {
  max-width: 1240px;
  padding: 2rem 0;
  margin: 0 auto;
}
</style>
