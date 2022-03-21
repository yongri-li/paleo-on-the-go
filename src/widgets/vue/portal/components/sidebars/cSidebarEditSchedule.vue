<template>
  <div class="c-sidebarEditSchedule">
    <!--  <button @click="handleUnskip">unskip</button> -->
    <h5 class="c-h5">Need a Break?</h5>
    <button @click="testInterval1">Test Freq Interval 1</button>
    <button @click="testInterval">Test Freq Interval 2</button>
    <button class="c-button c-button--isDefault c-button--isPrimary" @click="handleSkip">
      Delay {{ freqVal }} {{ freqVal > 1 ? 'Weeks' : 'Week' }}
    </button>
    <hr />

    <h5 class="c-h5">Edit Frequency</h5>
    <section class="c-sidebar__pills" ref="freqPills">
      <div v-for="(pill, i) in 4" :data-freq="i + 1" @click="freqSelect(pill, $event)">
        {{ i + 1 }} {{ i > 0 ? 'Weeks' : 'Week' }}
      </div>
    </section>
    <hr />

    <h5 class="c-h5">Edit Charge Date</h5>
    <!-- <span>{{ chargeDate ? formatDayDateMMIOS(chargeDate) : selectDateText }}</span> -->
    <div class="placeholder-wrap" data-placeholder="Delivery Date: ">
      <datepicker
        v-model="newChargeDate"
        :required="true"
        :open-date="thisWeek"
        :disabled-dates="disabledDates"
        :inline="true"
        :highlighted="availableForDelivery"
        format="D, MMMM dsu"
        :placeholder="selectDateText"
      >
      </datepicker>
    </div>

    <c-button
      class="c-button c-button--isDefault c-button--isPrimary"
      @click="changeNextChargeDate"
      text="Save Changes"
      :success="status === 'success'"
      :loading="loading"
      :attributes="{ disabled: unchanged }"
      :modifiers="['isDefault', 'isPrimary', 'hideTextLoading', 'isSubmit']"
    />

    <!--       :loading="loading"
      :success=""
      :attributes=""
      text="Save Changes"
      :modifiers="['isDefault', 'isPrimary', 'hideTextLoading', 'isSubmit']"  -->
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { format } from 'date-fns'
import Datepicker from 'vuejs-datepicker'
import cButton from '@shared/components/core/cButton.vue'
import { convertToYYYYMMDDlocalT } from '@shared/utils'
import { _buildUpdates } from '@vue/portal/utils'

export default {
  data() {
    return {
      freqVal: 1,
      availableForDelivery: {
        days: []
      },
      disabledDates: {
        to: new Date(),
        from: new Date(2022, 4, 29)
      },
      selectDateText: 'Click to Select',
      newChargeDate: '',
      thisWeek: null,
      loading: false,
      status: false,
      unchanged: true
    }
  },
  props: {
    content: {
      type: Object
    },
    modifiers: {
      type: Array,
      default: () => []
    }
  },
  components: { Datepicker, cButton },
  computed: {
    ...mapState('customer', ['addressIds', 'thisChargeId', 'nextChargeDate']),
    addressId() {
      return this.addressIds[1]
    },
    chargeId() {
      return this.thisChargeId
    },
    subscriptions() {
      return this.$store.state.customer.resources.subscriptions
    },
    subscriptionIds() {
      return this.subscriptions?.map(itm => itm.id)
    }
  },
  methods: {
    ...mapActions('customer', [
      'customerChargesSkip',
      'customerChargesUnskip',
      'customerUpdateChargesDate',
      'customerUpdateSubscriptions'
    ]),
    formatDayDateMMIOS(date) {
      const dateStr = convertToYYYYMMDDlocalT(date)
      return dateStr != null ? format(new Date(dateStr), 'ddd, MMM D') : null
    },
    freqSelect(freq, e) {
      const freqPills = [...this.$refs.freqPills.children]
      freqPills.forEach(pill => pill.classList.remove('selected'))
      e.target.classList.add('selected')
      this.freqVal = freq
    },
    async handleSkip() {
      const res = await this.customerChargesSkip({
        addressId: this.addressId,
        updates: [
          {
            id: this.chargeId,
            subscription_ids: this.subscriptionIds
          }
        ]
      })
      console.log('ressss', res)
      if (res.error) {
        console.log('ERROR', res.error)
      }
    },
    async handleUnskip() {
      const { charges, onetimes, subscriptions, error } = await this.customerChargesUnskip({
        addressId: this.addressId,
        updates: [
          {
            id: '547791373',
            subscription_ids: this.subscriptionIds
          }
        ]
      })
    },
    async changeNextChargeDate() {
      this.loading = true
      // const { charges, onetimes, subscriptions, error, success } = await this.customerUpdateChargesDate({
      const { success } = await this.customerUpdateChargesDate({
        addressId: this.addressId,
        updates: [
          {
            id: this.chargeId,
            next_charge_date: format(this.newChargeDate, 'YYYY-MM-DD')
          }
        ]
      })
      if (success) {
        this.loading = false
        this.status = 'success'
        this.unchanged = true
      }
    },

    //////
    async testInterval1() {
      await this.customerUpdateSubscriptions({
        addressId: this.addressId,
        updates: [
          {
            id: 221444582,
            charge_interval_frequency: 2,
            order_interval_frequency: 2,
            order_interval_unit: 'week'
          }
        ]
      })
    },
    async testInterval() {
      await this.customerUpdateSubscriptions({
        addressId: this.addressId,
        updates: _buildUpdates({
          items: this.subscriptions,
          values: { interval: { unit: 'week', frequency: 3 } }
        })
      })
    },

    async handleTestSave() {
      this.loading.save = true
      await this.customerUpdateSubscriptions({
        addressId: this.addressId,
        updates: _buildUpdates({
          items: this.subscriptions,
          values: { interval: { unit: this.item.unit, frequency: this.frequencyModel } }
        })
      })
      await this.customerUpdateChargesDate({
        addressId: this.settings.address.id,
        updates: this.chargeUpdates(this.dateModel).map(charge => {
          return { id: charge.id, next_charge_date: this.dateModel }
        })
      })
      this.loading.save = false
      this.status = 'success'
    }
    //////
  },
  watch: {
    nextChargeDate: {
      immediate: true,
      handler(val) {
        this.newChargeDate = val
      }
    },
    newChargeDate: {
      handler(val) {
        const nxtChrg = new Date(this.nextChargeDate).getTime()
        const newChrg = new Date(val).getTime()
        nxtChrg !== newChrg ? (this.unchanged = false) : (this.unchanged = true)
        if (this.status === 'success') this.status = false
      }
    }
  }
}
</script>

<style lang="scss">
.c-sidebarEditSchedule {
  background-color: $color-white;
  padding: 2rem 1.5rem;

  .c-h5 {
    font-size: 1.125rem;
    font-weight: 600;
    letter-spacing: 1px;
    margin-bottom: 1rem;
    text-transform: uppercase;
  }

  hr {
    margin: 2rem 0;
  }

  .c-button {
    width: 100%;
    margin-bottom: 2.5rem;
  }

  .c-sidebar__pills {
    display: flex;
    justify-content: space-between;

    div {
      background-color: $color-ecru;
      font-size: 1rem;
      padding: 0.75rem 1.65rem;
      border-radius: 25px;
      cursor: pointer;
      transition: background-color 175ms;
    }

    div.selected {
      background-color: $color-secondary;
    }
  }

  .vdp-datepicker__calendar {
    width: 100%;
    height: 450px;
    padding: 1.5rem;

    header {
      height: 40px;
      margin-bottom: 1rem;
    }

    .day-header {
      font-family: $font-body;
      font-size: 1.125rem;
      font-weight: 600;
      letter-spacing: 1px;
      text-transform: uppercase;
    }

    span:not(.day-header, .next, .prev, .up) {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      height: 61px;
      font-size: 12px;
      line-height: 1;
      padding: 0;
      background: #f7f7f7;
      border: 1px solid #fff;
    }

    span.cell.selected {
      background-color: $color-black;
      color: $color-primary;
    }

    span.day__month_btn {
      font-family: 'Knockout';
      font-size: 1.875rem;
      text-transform: uppercase;
      pointer-events: none;
    }
  }
}
</style>
