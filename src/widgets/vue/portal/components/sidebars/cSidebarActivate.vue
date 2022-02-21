<template>
  <div :class="_buildModifiers('c-sidebarActivate', modifiers)" v-if="content">
    <!-- v-if="content && settings.address" -->
    <c-h
      class="c-sidebar__heading"
      v-if="content.cancel_activate_heading"
      tag="h1"
      level="1"
      :text="content.cancel_activate_heading"
    />
    <c-p
      class="c-sidebarActivate__address"
      tag="address"
      level="1"
      v-html="
        _buildAddress({
          address: settings.address,
          options: {
            hiddenFields: ['name', 'country'],
            provinceName: 'short',
            flatten: true
          }
        })
      "
    />
    <c-h
      class="c-sidebarActivateItem__title"
      tag="h4"
      level="4"
      :text="`Next Delivery On ${formatDayDate(newDelvDateFromCharge)}`"
    />

    <c-p
      v-if="content.cancel_activate_disclaimer"
      v-html="content.cancel_activate_disclaimer"
      level="1"
      :modifiers="['activate']"
    />
    <div class="c-sidebarActivate__items">
      <c-h class="c-sidebarActivateItem__title" tag="h4" level="4" text="Your Default Meal Plan" />

      <c-orders-item
        v-for="(defaultItem, index) in defaultItems"
        :key="`${defaultItem.id}-${index}`"
        :content="defaultItem"
        :item="defaultItem"
        :defaultActivate="true"
        @update="handleUpdate"
      />

      <div class="c-sidebarActivate__total" v-if="content.activate_total && total">
        <span class="c-sidebarActivate__totalLabel" v-html="content.activate_total" />
        <span class="c-sidebarActivate__totalValue" v-html="total" />
      </div>
      <div class="c-sidebarActivate__disclaimers" v-if="content.activate_disclaimer">
        <c-p
          class="c-sidebarActivate__disclaimer"
          v-for="(disclaimer, index) in _buildTextArray(content.activate_disclaimer)"
          :key="`disclaimer-${index}`"
          tag="p"
          level="3"
          :text="disclaimer"
        />
      </div>
    </div>

    <div class="c-sidebarActivate__footer">
      <form class="c-sidebarActivate__form">
        <input
          v-model="discountCode"
          class="c-sidebarActivate__input"
          type="text"
          placeholder="Discount Code"
        />
        <button class="c-sidebarActivate__inline-button" type="button" @click="handleDiscountClick">
          Apply
        </button>
      </form>

      <c-p
        v-if="discountCode !== '' && discountClicked"
        class="c-sidebarActivate__message"
        text="Discount will be applied after reactivation"
        level="1"
        :modifiers="['activate']"
      />
      <c-p
        v-if="discountErrorMessage !== ''"
        :modifiers="['activate']"
        :text="`Your subscription has been reactived but: ${discountErrorMessage}`"
        class="c-sidebarActivate__message"
        level="1"
      />

      <div class="c-sidebarActivate__total">
        <c-p class="c-sidebarActivate__totalText" text="TOTAL: " tag="p" level="3" />
        <c-p class="c-sidebarActivate__totalText" :text="total" level="3" tag="p" />
      </div>
      <c-button
        class="c-sidebarActivate__activate-button"
        @click="handleActivate"
        :attributes="{ disabled: !activateModel.length > 0 || loading }"
        :loading="loading"
        :modifiers="['isDefault', 'isSecondary', 'hideTextLoading']"
        :text="content.cancel_activate_button"
      />
    </div>
  </div>
</template>

<script>
import { mapMutations, mapActions, mapState, mapGetters } from 'vuex'
import { _sortItemsByCharge, _buildUpdates } from '@vue/portal/utils'
import {
  getWeekStart,
  cnvtDayToNum0,
  convertNumberToDay,
  addDaysToDate,
  shipDateBasedOnCharge,
  delay,
  calcDatesDiff
} from '@shared/utils'
import { format } from 'date-fns'
import cP from '@shared/components/core/cP.vue'
import cH from '@shared/components/core/cH.vue'
import cButton from '@shared/components/core/cButton.vue'
import cSidebarActivateItem from './cSidebarActivateItem.vue'
import cOrdersItem from '../orders/cOrdersItem.vue'
import { apiService } from '@shared/services'

export default {
  name: 'SidebarReactive',
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
    }
  },
  components: {
    cP,
    cH,
    cButton,
    cSidebarActivateItem,
    cOrdersItem
  },
  data() {
    return {
      activateModel: [],
      loading: false,
      discountCode: '',
      discountClicked: false,
      discountErrorMessage: '',
      todate: new Date()
    }
  },
  computed: {
    ...mapState('products', ['defaultMenu', 'defaultMenuItems']),
    ...mapGetters('customer', ['customerUpcomingCharges', 'customerAddressesWithStatus']),
    ...mapState('customer', ['deliverydays']),
    ...mapState('ui', ['pastCutoffEST']),
    // shipDays(){
    //   return this.deliverydays.length > 0 ? this.deliverydays : (localStorage.getItem('delvDays')).split(',');
    // },
    subscriptions() {
      return this.$store.getters['customer/customerSubscriptionsByAddress'](this.settings.address.id)
    },
    subscriptionIds() {
      return this.subscriptions.map(subscription => subscription.id)
    },
    defaultItems() {
      return this.defaultMenuItems
    },
    subscriptionIds() {
      return this.defaultItems.map(item => item.id)
    },
    todayNum() {
      return new Date(this.todate).getDay()
    },
    firstDateOfWeek() {
      return getWeekStart(this.todate)
    },
    delvDayNum() {
      return cnvtDayToNum0(this.deliveryDay.toLowerCase())
    },
    deliveryDay() {
      return this.settings.address.note_attributes
        ? this.settings.address.note_attributes[0].value
        : this.settings.nextDeliveryDay
    },
    chargeDayNum() {
      return this.delvDayNum < 3 ? 4 : 1
    },
    chargeDayNumNext() {
      return this.todayNum >= this.chargeDayNum ? this.chargeDayNum + 7 : this.chargeDayNum
    },
    distFromChrg() {
      return calcDatesDiff(this.todate, addDaysToDate(this.firstDateOfWeek, this.chargeDayNumNext))
    },
    chargeDateFormat() {
      const chrgDateThisWeek = addDaysToDate(this.firstDateOfWeek, this.chargeDayNumNext)
      const chrgDateNextWeek = addDaysToDate(this.firstDateOfWeek, this.chargeDayNumNext + 7)
      return this.pastCutoffEST && this.distFromChrg < 5 ? chrgDateNextWeek : chrgDateThisWeek
    },
    chargeDateNext() {
      return format(this.chargeDateFormat, 'YYYY-MM-DD') + 'T00:00:00'
    },
    newDelvDateFromCharge() {
      return shipDateBasedOnCharge(this.chargeDateNext, this.deliveryDay)
    },
    newDeliveryDate() {
      return format(this.newDelvDateFromCharge, 'MM-DD-YYYY')
    },
    items() {
      return _sortItemsByCharge({ items: this.subscriptions, order: 'ascending' })
    },
    currencySymbol() {
      return this.$store.getters['customize/customizeShopByKey']('currency_symbol')
    },
    total() {
      let total = 0
      const checkedSubscriptions = this.subscriptions.filter(subscription => {
        return this.activateModel.includes(subscription.id)
      })
      checkedSubscriptions.forEach(subscription => (total += subscription.total))
      return `${this.currencySymbol}${this._formatMoney({ amount: total })}`
    },
    disclaimers() {
      const { activate_disclaimer } = this.content
      if (activate_disclaimer) return this._buildTextArray(activate_disclaimer)
      else return []
    }
  },
  methods: {
    ...mapMutations('ui', ['UI_CLOSE_SIDEBAR']),
    ...mapActions('customer', [
      'customerSetResources',
      'customerUpdateAddress',
      'customerUpdateAddressItems',
      'customerUpdateAddressDiscount',
      'customerUpdateChargesDate',
      'customerUpdatePlanToDFMenu'
    ]),
    emitSubscriptionsReactivate() {
      const event = new CustomEvent('reactivateSubscriptions', {
        detail: {
          existingSubs: true
        }
      })
      document.dispatchEvent(event)
    },
    formatDayDate(date) {
      return date != null ? format(new Date(date), 'dddd, MMMM D') : null
    },
    handleDiscountClick() {
      this.discountClicked = true
    },
    handleUpdate(val) {
      const { id, action } = val
      this.activateModel = this.activateModel.filter(item => item.id == id)
      if (action === 'add') this.activateModel = [...this.activateModel, id]
    },
    async getChargesData() {
      const apiClient = new apiService()
      const { data } = await apiClient.get('/v1/customer/resources?resources=charges')
      const charges = data.resources.charges
      return charges
    },
    async handleActivate() {
      this.loading = true

      try {
        const reactivateDone = await this.customerUpdateAddressItems({
          addressId: this.settings.address.id,
          updatesSubscriptions: _buildUpdates({
            items: this.subscriptions,
            actions: ['activate'],
            values: {
              reason: this.cancelModel
            }
          })
        })

        // console.log(
        //   'reactivateDone',
        //   reactivateDone,
        //   reactivateDone ? true : false,
        //   reactivateDone.subscriptions.length
        // )

        if (reactivateDone) {
          //if (reactivateDone.subscriptions.length > 0) {
          let queuedCharge

          await delay(101)

          console.log('queuedCharge1', queuedCharge)

          if (!this.customerUpcomingCharges.length) {
            const upcomingCharges = await this.getChargesData()
            queuedCharge = await upcomingCharges.filter(chrg => chrg.status === 'QUEUED')
            //queuedCharge = await upcomingCharges.filter(chrg => chrg.status !== 'REFUNDED')
          } else {
            queuedCharge = await this.customerUpcomingCharges.filter(chrg => chrg.status !== 'REFUNDED')
          }

          await delay(250)

          // const update = await this.customerUpdatePlanToDFMenu({
          //   addressId: this.settings.addressId,
          //   updates: [...this.subsUpdateFromDfMenu],
          //   deletes: [...this.subscriptionIds]
          // })

          if (queuedCharge) {
            await this.customerUpdateChargesDate({
              addressId: this.settings.addressId,
              updates: [
                {
                  id: queuedCharge[0].id,
                  next_charge_date: this.chargeDateNext
                }
              ]
            })

            this.emitSubscriptionsReactivate()

            const { address } = await this.customerUpdateAddress({
              updates: {
                id: this.settings.addressId,
                note_attributes: [
                  {
                    name: 'Delivery Day',
                    value: this.deliveryDay
                  },
                  {
                    name: 'Delivery Date',
                    value: format(this.newDelvDateFromCharge, 'MM-DD-YYYY')
                  }
                ]
              }
            })

            if (this.discountCode !== '') {
              const { error } = await this.customerUpdateAddressDiscount({
                addressId: this.settings.address.id,
                discountCode: this.discountCode
              })

              if (error) {
                this.discountErrorMessage = error.message
                this.loading = false
              } else {
                this.loading = false
              }
            }

            this.loading = false
            this.UI_CLOSE_SIDEBAR()
            await this.$router.push({ path: '/shipments' })
          }
        }
        //location.reload()
      } catch (error) {
        console.log(error)
      }
    }
  },
  async mounted() {
    this.activateModel = this.subscriptionIds
  }
}
</script>

<style lang="scss">
.c-sidebarActivate__address {
  margin-top: -10px;
  font-weight: 700;
}
.c-sidebarActivate__total {
  @include flex($align: center, $justify: space-between, $wrap: nowrap);
}

.c-sidebarActivate__items {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  border-bottom: 1px solid #e1dfd8;
  padding-bottom: 20px;
  margin-bottom: 20px;
  margin-bottom: 20px;

  .c-lineItem {
    padding: 12px;

    @include media-tablet-up {
      width: 84%;
    }
  }
}

.c-sidebarActivate__totalText,
.c-sidebarActivate__message {
  color: #519864;
  font-weight: bold;
}
.c-sidebarActivate__message {
  font-size: 15px;
  margin-top: 10px;
  text-align: center;
}
.c-sidebarActivate__footer {
  max-width: 338px;
}
.c-sidebarActivate__inline-button {
  -webkit-appearance: none;
  background-color: transparent;
  border: none;
  color: #519854;
  font-weight: bold;
  position: absolute;
  right: 20px;
  text-transform: uppercase;
  top: 50%;
  transform: translateY(-50%);
  z-index: 10;
}
.c-sidebarActivate__input {
  border-radius: 40px;
  padding: 14px 70px 19px 15px;
  border: 1px solid #e1dfd8;
  width: 100%;
}
.c-sidebarActivate__form {
  position: relative;
}
.c-sidebarActivate__total {
  width: 100%;
  margin-top: 30px;
  @include flex($justify: space-between);
}
.c-sidebarActivate__totalLabel {
  @include text-heading;
  font-size: 20px;
}
.c-sidebarActivate__totalValue {
  @include text-body;
  font-size: 20px;
}
.c-sidebarActivate__button {
  width: 100%;
  max-width: 320px;
  margin-top: 30px;
}
.c-sidebarActivate__activate-button {
  width: 100%;
}
.c-sidebarActivate__disclaimers {
  max-width: 420px;
  margin-top: 40px;
}
.c-p1--activate {
  font-size: 16px;
  line-height: 1.25;
}
</style>
