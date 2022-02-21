<template>
  <div :class="_buildModifiers('c-sidebarEditSchedule', modifiers)" v-if="content && address">
    <h2 v-html="content.edit_subheading"></h2>
    <!--  @delay="handleDelay" -->
    <c-editDelivRadios
      class="c-sidebarCancel__radios"
      v-model="cancelModel"
      :loading="loading"
      :addressId="settings.addressId"
      :nextscheduledat="nextscheduledat"
      :shipment="shipment"
      :content="{
        day_monday: content.edit_day_monday,
        day_tuesday: content.edit_day_tuesday,
        day_wednesday: content.edit_day_wednesday,
        day_thursday: content.edit_day_thursday,
        day_friday: content.edit_day_friday,
        day_saturday: content.edit_day_saturday,
        day_sunday: content.edit_day_sunday,
        submit_button: content.edit_submit_button
      }"
    />
    <!--      <c-button class="c-sidebar_saveBtn c-cta"
      v-if="content.edit_submit_button"
      @click="saveNewDelivDate"
      :loading="loading.cancel"
      :text="content.edit_submit_button"
      :modifiers="['isHollow', 'hideTextLoading']"
      :attributes="{ disabled: !cancelModel || loading.cancel || loading.delay }"
    /> -->
  </div>
</template>

<script>
import { mapMutations, mapActions } from 'vuex'
import { _sortItemsByCharge, _buildUpdates } from '@vue/portal/utils'
import cP from '@shared/components/core/cP.vue'
import cButton from '@shared/components/core/cButton.vue'
import cSidebarCancelItem from './cSidebarCancelItem.vue'
import cEditDelivRadios from '../parts/cEditDelivRadios.vue'

export default {
  props: {
    content: {
      type: Object,
      required: true
    },
    settings: {
      type: Object,
      required: true
    },
    modifiers: {
      type: Array,
      default: () => []
    },
    nextscheduledat: {
      type: [String, Number],
      required: true
    },
    shipment: {
      type: Object
    }
  },
  components: {
    cP,
    cButton,
    cSidebarCancelItem,
    cEditDelivRadios
  },
  data: () => ({
    cancelModel: false,
    loading: { delay: false, editing: false }
  }),
  computed: {
    // subscriptions() {
    //   return this.$store.getters['customer/customerSubscriptionsByAddress'](this.settings.addressId)
    // },
    // subscriptionIds() {
    //   return this.subscriptions.map(subscription => subscription.id)
    // },
    // onetimes() {
    //   return this.$store.getters['customer/customerOnetimesByAddress'](this.settings.addressId)
    // },
    // onetimeIds() {
    //   return this.onetimes.map(onetime => onetime.id)
    // },
    items() {
      return _sortItemsByCharge({
        items: [...this.subscriptions, ...this.onetimes],
        order: 'ascending'
      })
    },
    address() {
      return this.$store.getters['customer/customerAddressById'](this.settings.addressId)
    }
  },
  methods: {
    ...mapMutations('ui', ['UI_CLOSE_SIDEBAR']),
    ...mapActions('customer', ['customerUpdateAddressItems']),
    async handleDelay() {
      this.loading.delay = true
      // await this.customerUpdateAddressItems({
      //   addressId: this.settings.addressId,
      //   updatesOnetimes: _buildUpdates({
      //     items: this.onetimes, action: 'delay', values: { frequency: 1, unit: 'month'}
      //   }),
      //    updatesSubscriptions: _buildUpdates({
      //     items: this.subscriptions, action: 'delay', values: { frequency: 1, unit: 'month'}
      //   })
      // })
      this.loading.delay = false
      this.UI_CLOSE_SIDEBAR()
    },
    async saveNewDelivDate() {
      this.loading.editing = true
      // await this.customerUpdateAddressItems({
      //   addressId: this.settings.addressId,
      //   updatesOnetimes: _buildUpdates({
      //     items: this.onetimes, action: 'cancel', values: { reason: this.cancelModel }
      //   }),
      //    updatesSubscriptions: _buildUpdates({
      //     items: this.subscriptions, action: 'cancel', values: { reason: this.cancelModel }
      //   })
      // })
      this.loading.editing = false
      this.UI_CLOSE_SIDEBAR()
    }
  }
}
</script>

<style lang="scss">
.c-sidebarEditSchedule > h2 {
  line-height: 1.35;
}

.c-sidebarCancel__address {
  font-size: 20px;
  font-weight: 500;
}
.c-sidebarCancel__items {
  margin-bottom: 20px;
}
.c-sidebar_saveBtn {
  margin: 2rem 0;
  max-width: 250px;
}
</style>
