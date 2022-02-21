<template>
  <div class="c-shipmentsBoxFuture">
    <header :class="{ 'skipped-cls': skipped }">
      <div class="c-shipmentsBox__headings">
        <div v-if="!skipped || !hasSkip">
          <h3 class="c-shipmentsBox__heading c-h3">Delivery on {{ formatDayDate(boxDeliveryDate) }}</h3>
          <p class="c-shipmentsBox__copy">
            Select your Meals by {{ formatDayDate(chargeCutoffDate) }} (6pm EST)
          </p>
          <p class="c-shipmentsBox__total">
            Order Total:
            <span class="u-colorBroccoli">${{ onlyTwoDecimals(chargeSubtotal) }} + Shipping</span>
          </p>
        </div>
        <div v-else>
          <h3 class="c-shipmentsBox__heading c-h3">
            {{ formatDayDate(boxDeliveryDate) }}
          </h3>
          <p class="c-shipmentsBox__copy c-shipmentsBox__copy--skip u-colorBroccoli">
            This order has been skipped
          </p>
          <p class="c-shipmentsBox__copy">Unskip before {{ formatDayDate(chargeCutoffDate) }} (6pm EST)</p>
        </div>
      </div>
    </header>
    <section>
      <c-button
        v-if="!skipped"
        class="c-cta c-cta--inverse c-loading--isSecondary"
        text="Skip Order"
        @click="futureSkipFn"
        :disabled="skipsProcessing"
        :loading="skippingOrder"
        :modifiers="['isDefault', 'isSecondary', 'hideTextLoading']"
      />
      <c-button
        v-else
        class="c-cta c-loading--isSecondary"
        text="Unskip"
        @click="futureUnSkipFn"
        :disabled="skipsProcessing"
        :loading="skippingOrder"
        :modifiers="['isDefault', 'isSecondary', 'hideTextLoading']"
      />
    </section>
  </div>
</template>

<script>
import { mapGetters, mapState, mapActions, mapMutations } from 'vuex'
import cH from '@shared/components/core/cH.vue'
import cIcon from '@shared/components/core/cIcon.vue'
import cButton from '@shared/components/core/cButton.vue'
import cShipments from '../pages/cShipments.vue'
import { format } from 'date-fns'
import {
  addDaysToDate,
  convertDayToNum,
  isPastCutoffDayTime,
  convertToYYYYMMDDlocalT,
  getWeekStart
} from '@shared/utils'
import { apiService } from '@shared/services'

export default {
  name: 'ShipmentsBoxFuture',
  props: {
    nextChargeInfo: {
      type: Object
    },
    weeksOut: {
      type: Number
    },
    hasCharge: {
      type: Boolean
    },
    numOfCharges: {
      type: Number
    }
  },
  data() {
    return {
      delvDate: convertToYYYYMMDDlocalT(this.nextChargeInfo.note_attributes[1].value),
      skipped: false,
      skippingOrder: false
    }
  },
  computed: {
    ...mapState(['customer']),
    ...mapState('customer', ['deliveryday', 'deliverydate', 'futureSkips']),
    ...mapState('ui', ['skipsProcessing']),
    ...mapGetters('customer', [
      'customerUpcomingCharges',
      'customerUpcomingCharge',
      'customerAddressesWithStatus',
      ['customerShopify']
    ]),
    deliveryDayy() {
      return this.deliveryday && this.deliveryday.length > 0
        ? this.deliveryday
        : localStorage.getItem('selectedDelvDay')
    },
    boxDelvDateFormat() {
      return format(new Date(this.boxDeliveryDate), 'MM-DD-YYYY')
    },
    boxDeliveryDate() {
      let num
      this.delvDayNum < 3 ? (num = 7) : (num = 0)
      return new Date(addDaysToDate(this.startOfChargeWeek, this.delvDayNum + num))
    },
    newNoteAtrDate() {
      return format(new Date(addDaysToDate(this.boxDeliveryDate, 7)), 'MM-DD-YYYY')
    },
    nextUpcomingCharges() {
      return this.customerUpcomingCharges.filter(chrg => chrg.status !== ('REFUNDED' || 'CANCELLED'))
    },
    boxChargeDate() {
      const chargeDate = new Date(this.nextUpcomingCharges[0].scheduledAt)
      return new Date(addDaysToDate(chargeDate, (this.weeksOut + 1) * 7))
    },
    skipDate() {
      return `${format(this.boxChargeDate, 'YYYY-MM-DD')}T00:00:00`
    },
    boxCharge() {
      return this.nextUpcomingCharges.find(charge => this.skipDate === charge.scheduled_at)
    },
    chargeSubtotal() {
      return this.hasCharge ? this.nextChargeInfo.subtotal : this.nextUpcomingCharges[0].subtotal
    },
    chargeCutoffDate() {
      return new Date(addDaysToDate(this.boxChargeDate, -1))
    },
    hasSkip() {
      return this.futureSkips.map(skip => (skip.date === this.skipDate ? true : false)).includes(true)
        ? true
        : false
    },
    delvDayNum() {
      let num = convertDayToNum(this.deliveryDayy.toLowerCase())
      return num === 7 ? 0 : num
    },
    startOfChargeWeek() {
      return getWeekStart(new Date(this.skipDate))
    },
    delvDateBasedOnChrgDate() {
      return new Date(addDaysToDate(this.startOfChargeWeek, this.delvDayNum))
    }
  },
  methods: {
    ...mapActions('customer', [
      'customerUpdateAddress',
      'customerChargesUnskip',
      'customerFutureSkip',
      'customerFutureUnSkip'
    ]),
    ...mapMutations('customer', ['CUSTOMER_SET_DELIVERYDATE']),
    ...mapMutations('ui', ['UI_TOGGLE_SKIP_PROCESSING']),
    formatDayDate(date) {
      return date != null ? format(new Date(date), 'dddd, MMMM D') : null
    },
    formatDayDateIOS(date) {
      const dateStr = convertToYYYYMMDDlocalT(date)
      return dateStr != null ? format(new Date(dateStr), 'dddd, MMMM D') : null
    },
    onlyTwoDecimals(num) {
      return parseFloat(num).toFixed(2)
    },
    updateSkip() {
      this.skipped = this.hasSkip
    },
    async futureSkipFn() {
      this.skippingOrder = true
      this.UI_TOGGLE_SKIP_PROCESSING(true)
      const futureSkipped = await this.customerFutureSkip({
        address_id: this.nextChargeInfo.addressId,
        date: this.skipDate
      })

      // Sets new note_attribute delivery date a week out from this
      if (this.boxDelvDateFormat === this.deliverydate) {
        this.CUSTOMER_SET_DELIVERYDATE(this.newNoteAtrDate)
      }

      if (this.boxCharge) this.boxCharge.status = 'SKIPPED'
      this.skippingOrder = false
      this.skipped = true
      this.UI_TOGGLE_SKIP_PROCESSING(false)
    },
    async futureUnSkipFn() {
      this.skippingOrder = true
      this.UI_TOGGLE_SKIP_PROCESSING(true)

      // Reverts back to older delivery date
      if (this.deliverydate >= this.newNoteAtrDate) {
        this.CUSTOMER_SET_DELIVERYDATE(this.boxDelvDateFormat)
      }

      const futureUnSkips = await this.customerFutureUnSkip({
        address_id: this.nextChargeInfo.addressId,
        date: this.skipDate
      })

      this.skippingOrder = false
      this.skipped = false
      this.UI_TOGGLE_SKIP_PROCESSING(false)
    }
  },
  mounted() {
    document.addEventListener(
      'deliveryChangeConfirmed',
      e => {
        const { isCutoffChange } = e.detail
        if (isCutoffChange) {
          if (this.skipped) this.futureUnSkipFn()
        }
      },
      { once: true }
    )

    this.updateSkip()
  },
  watch: {
    hasSkip() {
      this.skipped = this.hasSkip
    }
  },
  components: {
    cH,
    cButton,
    cIcon,
    cShipments
  }
}
</script>

<style lang="scss">
.c-shipmentsBox {
  background-color: $color-ecru;
  border-radius: 12px;
  border: 1px solid $color-paleo;
  padding: 23px 26px;
}

.c-shipmentsBoxFuture {
  display: flex;
  align-items: center;
  justify-content: space-between;

  @include media-mobile-down {
    flex-direction: column;
    align-items: flex-start;

    .c-shipmentsBox__heading {
      max-width: 90%;
    }

    section {
      width: 100%;

      .c-cta {
        margin: 0 auto;
      }
    }
  }

  button {
    width: 180px;
  }

  .skipped-cls h3 {
    opacity: 0.4;
  }
}
.c-shipmentsBox__headings {
  margin-bottom: 16px;
  @include media-desktop-up {
    margin: 0;
  }
}
.c-shipmentsBox__heading {
  font-size: 17px;
  margin-bottom: 13px;
  @include media-desktop-up {
    font-size: 24px;
    letter-spacing: -0.5px;
  }
}
.c-shipmentsBox__total {
  font-size: 14px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: $color-off-black;
  margin-top: 12px;
}
.c-shipmentsBox__copy {
  font-size: 16px;
  @include media-tablet-up {
    font-size: 17px;
  }
}
.c-shipmentsBox__copy--skip {
  margin-bottom: 10px;
}
.c-shipmentsBox__cta {
  width: 154px;
  margin: 0 auto;
  @include media-tablet-up {
    margin: 0;
  }
}
.c-shipmentsGroups__bottom {
  border-top: 1px solid #dbd9d4;
  margin-top: 20px;
  padding-top: 18px;
  @include media-desktop-up {
    display: flex;
    justify-content: space-between;
    margin-top: 25px;
    padding-top: 20px;
  }
}
.c-sidebar__line {
  .vdp-datepicker input[type='text'] {
    color: #fbfaf4;
  }
}
.c-cta--inverse {
  .c-loading__wheel {
    border-top-color: $color-broccoli;
  }
}
</style>
