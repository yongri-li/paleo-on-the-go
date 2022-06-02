<template>
  <div class="c-sidebarEditSchedule">
    <h5 class="c-h5">{{ edit_break }}</h5>
    <button class="c-button c-button--isDefault c-button--isPrimary" @click="showDelayModal">
      Delay 1 Month
    </button>
    <hr />

    <h5 class="c-h5">{{ edit_frequency }}</h5>
    <section v-if="chrgFreq" class="c-sidebar__pills">
      <div
        v-for="(pill, i) in 3"
        :class="freqCalc(i + 1) == chrgFreq ? 'selected' : null"
        :data-freq="freqCalc(i + 1)"
        @click="freqSelect(pill)"
      >
        {{ freqCalc(i + 1) }} Weeks
      </div>
    </section>
    <hr />

    <h5 class="c-h5">{{ edit_charge_date }}</h5>
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
      class="c-button"
      @click="handleSave"
      text="Save Changes"
      :success="status === 'success'"
      :loading="loading"
      :attributes="{ disabled: unchanged }"
      :modifiers="['isDefault', 'isBlack', 'hideTextLoading', 'isSubmit']"
    />
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import { format } from 'date-fns'
import Datepicker from 'vuejs-datepicker'
import cButton from '@shared/components/core/cButton.vue'
import { convertToYYYYMMDDlocalT, delay } from '@shared/utils'
import { _buildUpdates } from '@vue/portal/utils'

export default {
  data() {
    return {
      ...window.Scoutside.portal.sidebars,
      ...window.Scoutside.portal.modals,
      chrgFreq: null,
      availableForDelivery: {
        days: []
      },
      disabledDates: {
        to: new Date(),
        from: new Date()
      },
      selectDateText: 'Click to Select',
      newChargeDate: '',
      thisWeek: null,
      loading: false,
      status: false,
      freqChanged: false,
      dateChanged: false
    }
  },
  props: {
    content: {
      type: Object
    },
    addressId: {
      type: [Number, String]
    },
    modifiers: {
      type: Array,
      default: () => []
    }
  },
  components: { Datepicker, cButton },
  computed: {
    ...mapState('customer', ['addressIds', 'thisChargeId', 'nextChargeDate']),
    chargeId() {
      return this.thisChargeId
    },
    subscriptions() {
      // return this.$store.state.customer.resources.subscriptions
      return this.$store.getters['customer/customerSubscriptionsByAddressId'](this.addressId)
    },
    subscriptionIds() {
      return this.subscriptions?.map(itm => itm.id)
    },
    unchanged() {
      return this.freqChanged === true || this.dateChanged === true ? false : true
    }
  },
  methods: {
    ...mapActions('customer', [
      'customerChargesSkip',
      'customerUpdateChargesDate',
      'customerUpdateSubscriptions'
    ]),
    ...mapMutations('ui', ['UI_CLOSE_SIDEBAR', 'UI_SET_MODAL', 'UI_CLOSE_MODAL']),
    freqCalc(index) {
      return index < 3 ? index * 2 : (index + 1) * 2
    },
    formatDayDateMMIOS(date) {
      const dateStr = convertToYYYYMMDDlocalT(date)
      return dateStr != null ? format(new Date(dateStr), 'ddd, MMM D') : null
    },
    freqSelect(freq) {
      this.chrgFreq = this.freqCalc(freq)
      const subFreq = +this.subscriptions[0].charge_interval_frequency
      this.freqCalc(freq) !== subFreq ? (this.freqChanged = true) : (this.freqChanged = false)
    },
    setMonthChrgDelay(currentChrg, num) {
      const date = new Date(currentChrg)
      date.setMonth(date.getMonth() + num)
      this.newChargeDate = date
    },
    setDisabledFrom(date, days) {
      const result = new Date(date)
      result.setDate(result.getDate() + days)
      return result
    },
    showDelayModal() {
      this.UI_SET_MODAL({
        component: 'cModalDelay',
        content: {
          heading: this.delay_heading,
          text: this.delay_text,
          button: this.delay_button_confirm,
          cancel: this.delay_button_cancel
        }
      })
    },
    async handleSave() {
      this.loading = true
      let data

      if (this.freqChanged) {
        data = await this.customerUpdateSubscriptions({
          addressId: this.addressId,
          dontCommit: true,
          updates: _buildUpdates({
            items: this.subscriptions,
            values: { interval: { unit: 'week', frequency: this.chrgFreq } }
          })
        })
      } else {
        data = true
      }

      if (data) {
        const charges = !!data ? data.charges : false
        const chargeId = charges ? charges[charges.length - 1].id : this.chargeId
        await this.customerUpdateChargesDate({
          addressId: this.addressId,
          updates: [
            {
              id: chargeId,
              next_charge_date: format(this.newChargeDate, 'YYYY-MM-DD')
            }
          ]
        })
      } else {
        alert('Error saving - please refresh and try again')
      }

      this.loading = false
      this.status = 'success'
      setTimeout(() => {
        this.UI_CLOSE_MODAL()
        this.UI_CLOSE_SIDEBAR()
      }, 500)
    }
  },
  async mounted() {
    const calEnd = this.setDisabledFrom(new Date(), 90)
    this.disabledDates.from = calEnd

    document.addEventListener(
      'delayConfirmed',
      e => {
        const { delayed } = e.detail
        if (delayed) {
          this.setMonthChrgDelay(this.nextChargeDate, 1)
          setTimeout(() => this.handleSave(), 100)
        }
      },
      { once: true }
    )
  },
  watch: {
    nextChargeDate: {
      immediate: true,
      handler(val) {
        this.newChargeDate = val
        this.chrgFreq = +this.subscriptions[0]?.charge_interval_frequency
      }
    },
    newChargeDate: {
      handler(val) {
        const nxtChrg = new Date(this.nextChargeDate).getTime()
        const newChrg = new Date(val).getTime()
        nxtChrg !== newChrg ? (this.dateChanged = true) : (this.dateChanged = false)
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

  @include media-desktop-up {
    .c-h5 {
      letter-spacing: 1px;
      text-transform: uppercase;
    }
  }

  @include media-mobile-down {
    padding: 2rem 1rem;
  }

  .c-h5 {
    font-size: 1.125rem;
    font-weight: 600;
    margin-bottom: 1rem;
  }

  hr {
    margin: 2rem 0;
  }

  .c-button {
    width: 100%;
    margin-bottom: 2.125rem;
  }

  .c-sidebar__pills {
    display: flex;
    justify-content: space-between;

    div {
      background-color: $color-ecru;
      font-size: 1rem;
      padding: 0.75rem 2.5rem;
      border-radius: 25px;
      cursor: pointer;
      transition: background-color 175ms;
    }

    div.selected {
      background-color: $color-secondary;
    }

    @include media-mobile-down {
      /*      display: grid;
      grid-template-columns: 1fr 1fr;
      grid-gap: 1rem;*/

      div {
        font-size: 15px;
        padding: 0.85rem 1.5rem;
        text-align: center;
      }
    }
  }

  .vdp-datepicker__calendar {
    width: 100%;
    height: 450px;
    padding: 1.5rem;

    @include media-mobile-down {
      border: none;
      padding: 0;
    }

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

      @include media-mobile-down {
        font-size: 1rem;
      }
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

      @include media-mobile-down {
        height: 48px;
      }
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

    span.cell:nth-child(36) {
      display: none;
    }

    @include media-mobile-down {
      height: 368px;
    }
  }
}
</style>
