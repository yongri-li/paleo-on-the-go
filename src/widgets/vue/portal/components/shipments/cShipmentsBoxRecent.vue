<template>
  <div class="c-shipmentsBoxFuture box--mostRecent">
    <header>
      <div class="c-shipmentsBox__headings">
        <div>
          <h3 class="c-shipmentsBox__heading c-h3">
            {{ notificationText }} on {{ formatDayDate(notificationDate) }}
          </h3>
          <p class="c-shipmentsBox__total">
            Order Total:
            <span class="u-colorBroccoli"
              >${{ onlyTwoDecimals(subtotal) }} + Shipping</span
            >
          </p>
        </div>
      </div>
    </header>
    <section>
      <c-button
        class="c-cta c-cta--inverse c-loading--isSecondary"
        text="Order History"
        @click="goToOrders"
        :disabled="submitting"
        :loading="loading.go"
        :modifiers="['isDefault', 'isSecondary', 'hideTextLoading']"
      />
    </section>
  </div>
</template>

<script>
import { mapGetters, mapState, mapActions, mapMutations } from 'vuex'
import cButton from '@shared/components/core/cButton.vue'
import cShipments from '../pages/cShipments.vue'
import { format } from 'date-fns'
import {
  convertDayToNum,
  isPastCutoffDayTime,
  convertToYYYYMMDDlocalT
} from '@shared/utils'
import { apiService } from '@shared/services'

export default {
  name: 'ShipmentsBoxRecent',
  props: {
    orderInfo: {
      type: [Object, Array]
    }
  },
  data() {
    return {
      submitting: false,
      today: new Date(),
      loading: { go: false }
    }
  },
  computed: {
    ...mapState(['customer']),
    ...mapState('customer', ['futureSkips']),
    ...mapGetters('customer', [
      'customerUpcomingCharges',
      'customerAddressesWithStatus',
      'customerOrders',
      ['customerShopify']
    ]),
    hasNoteAttr() {
      return this.orderInfo[0]?.note_attributes?.length > 0 ? true : false
    },
    notificationVal() {
      return this.hasNoteAttr
        ? convertToYYYYMMDDlocalT(this.orderInfo[0].note_attributes[1].value)
        : convertToYYYYMMDDlocalT(this.orderInfo[0]?.processedAt)
    },
    notificationDate() {
      return new Date(this.notificationVal)
    },
    notificationText() {
      return this.hasNoteAttr ? 'Delivery' : 'Processed'
    },
    subtotal() {
      return this.orderInfo[0].subtotal
    }
  },
  methods: {
    formatDayDate(date) {
      return date != null ? format(new Date(date), 'dddd, MMMM D') : null
    },
    onlyTwoDecimals(num) {
      return parseFloat(num).toFixed(2)
    },
    goToOrders() {
      this.loading.go = true
      this.submitting = true
      window.location.href = '/account/#/orders'
    }
  },
  components: {
    cButton,
    cShipments
  }
}
</script>

<style lang="scss">
/*all needed styles in c-shipmentsBoxFuture*/
</style>
