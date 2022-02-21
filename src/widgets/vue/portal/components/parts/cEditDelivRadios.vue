<template>
  <div :class="isNextSkipped && 'grey-out'">
    <c-radioGroup
      :class="_buildModifiers('c-editDelivRadios', modifiers)"
      v-if="content"
      v-model="cancelModel"
      :modifiers="modifiers"
    >
      <div class="c-editDelivRadios__item" v-for="(day, index) in editDelivSchedule" :key="`day-${index}`">
        <c-radio
          class="c-editDelivRadios__radio"
          :class="deliverydayz.includes(index) && dateAvailable(index) ? 'showThis' : 'hideThis'"
          :active="cancelModel"
          :selectedday="deliveryday != day ? false : true"
          :daynumber="index"
          :day="day"
          :dataday="day"
          :date="setNewDDate(index)"
          :uncheck="true"
          :attributes="{
            value: day
          }"
        />
        <!--  Old version when same week only
        :date="setNewDate(firstDateOfWeek, (today > 3 && index < 3 ? index + 14 : index + 7))"
        :date="setNewDate(firstDateOfWeek, (index < selectedday && distanceFromToday < 7 ? index + 7 : index))"       -->
      </div>
      <c-button
        class="c-sidebar_saveBtn c-cta"
        @click="
          isNewDateCutoffChange()
          triggerConfirmModal()
        "
        :loading="loading.cancel"
        text="Save Changes"
        :modifiers="['isHollow', 'hideTextLoading']"
        :attributes="{
          disabled: isCurrentSelect || !cancelModel || loading.cancel || loading.delay
        }"
      />
    </c-radioGroup>
  </div>
</template>

<script>
import { mapGetters, mapState, mapActions, mapMutations } from 'vuex'
import { _filterItemsByAddOns, _filterItemsBySubscription } from '../../utils'
import {
  getWeekStart,
  addDaysToDate,
  calcDatesDiff,
  setNextCutoffDate,
  isPastCutoffDayTime,
  convertToYYYYMMDDlocalT,
  warningPop,
  stillProcessingWarningPopup,
  removeReloadWarning
} from '@shared/utils'
import { format } from 'date-fns'
import cRadioGroup from '@shared/components/core/cRadioGroup.vue'
import cRadio from '@shared/components/core/cRadio.vue'
import cH from '@shared/components/core/cH.vue'
import cButton from '@shared/components/core/cButton.vue'
import { apiService } from '@shared/services'

export default {
  props: {
    delay: {
      type: Boolean,
      default: true
    },
    loading: {
      type: Object,
      default: () => ({})
    },
    content: {
      type: Object,
      required: false
    },
    addressId: {
      type: [String, Number],
      required: true
    },
    modifiers: {
      type: Array,
      default: () => []
    },
    nextscheduledat: {
      type: [String, Number]
    }
  },
  components: {
    cRadioGroup,
    cRadio,
    cH,
    cButton
  },
  data() {
    return {
      cancelModel: false,
      todate: new Date(),
      oldDelvDay: '',
      newDelvDay: '',
      newDelvDate: '',
      isCutoffChange: null,
      nxtChargeDate: '',
      dfMenuArr: [],
      isDefaultMenu: false
    }
  },
  computed: {
    ...mapState('customer', ['deliveryday', 'deliverydays', 'deliverydate', 'isNextSkipped']),
    ...mapState('ui', ['timeEST']),
    ...mapState('products', ['defaultMenu']),
    ...mapGetters('customer', ['customerUpcomingCharges']),
    ...mapGetters('products', ['allProducts']),
    firstDateOfWeek() {
      const dateStr = convertToYYYYMMDDlocalT(this.deliveryDatee)
      return getWeekStart(new Date(dateStr))
    },
    deliverydayz() {
      return localStorage.getItem('delvDays')
    },
    deliveryday() {
      return localStorage.getItem('selectedDelvDay')
    },
    deliveryDatee() {
      if (this.deliverydate) return this.deliverydate
      return localStorage.getItem('selectedDelvDate')
    },
    defaultMenuM() {
      return this.defaultMenu.favorites
    },
    editDelivSchedule() {
      return [
        'day_sunday',
        'day_monday',
        'day_tuesday',
        'day_wednesday',
        'day_thursday',
        'day_friday',
        'day_saturday'
      ].map(day => {
        if (!this._stringEmpty(this.content[day])) return this.content[day]
      })
    },
    modalContent() {
      const deliverychange = this.$store.getters['customize/customizeModalByPrefix']('deliverychange_')
      return { deliverychange }
    },
    isCurrentSelect() {
      return this.cancelModel === this.deliveryday ? true : false
    },
    nextUpcomingCharge() {
      return this.customerUpcomingCharges.filter(chrg => chrg.status !== ('REFUNDED' || 'CANCELLED'))
    },
    todayNum() {
      return this.todate.getDay()
    },
    // distanceFromToday(){
    //   return calcDatesDiff(this.todate, this.deliveryDatee);
    // },
    addOnsItems() {
      return this.getAddOns(this.nextUpcomingCharge[0].lineItems)
    },
    addOnsItemsIds() {
      return this.addOnsItems.map(item => item.itemId)
    },
    subscriptionItems() {
      return _filterItemsBySubscription(this.nextUpcomingCharge[0].lineItems)
    },
    subscriptionItemIds() {
      return this.subscriptionItems.map(itm => itm.itemId)
    },
    setToDefault() {
      return this.dfMenuArr.map(child => {
        return {
          shopify_variant_id: child.upsellId || child.variants[0].id,
          quantity: child.quantity,
          price: child.upsellId
            ? (child.variants[1].price / 100).toFixed(2)
            : (child.variants[0].price / 100).toFixed(2),
          hash: child.upsellId ? child.price_hashes[1] : child.price_hashes[0],
          tags: child.tags,
          product_type: child.type,
          charge_interval_frequency: 1,
          order_interval_frequency: 1,
          order_interval_unit: 'week',
          next_charge_scheduled_at: format(this.nxtChargeDate, 'YYYY-MM-DD')
        }
      })
    }
  },
  methods: {
    ...mapActions('customer', ['customerUpdateChargesDate', 'customerUpdateAddress']),
    ...mapMutations('ui', ['UI_CLOSE_SIDEBAR', 'UI_SET_MODAL']),
    ...mapMutations('customer', [
      'CUSTOMER_SET_DELIVERYDAY',
      'CUSTOMER_SET_DELIVERYDATE',
      'CUSTOMER_SET_DDAY'
    ]),
    setNewDate(dat, i) {
      return new Date(addDaysToDate(dat, i))
    },
    setNewDDate(index) {
      const thisDate = addDaysToDate(this.firstDateOfWeek, index)
      const daysFromToday = calcDatesDiff(this.todate, thisDate)

      // let ind = ((this.todayNum > 3 || this.todayNum === 0) && daysFromToday < 4) ? index + 7
      //   : (daysFromToday < 3) ? index + 7
      //   : index;
      let ind = index

      return new Date(addDaysToDate(new Date(this.firstDateOfWeek), ind))
    },
    dateAvailable(i) {
      const thisDate = addDaysToDate(this.firstDateOfWeek, i)
      const today = this.todate.getDay()
      const moTuWe = [1, 2, 3]
      const arrA = [0, 1, 2]
      const arrB = [3, 4, 5, 6]
      let daysFromToday = calcDatesDiff(this.todate, thisDate)

      // const diffFromCutoff = Math.abs(calcDatesDiff(this.userCutoffDate, this.toDay))

      // if (this.timeEST >= 18) {
      //   if (today === 0) {
      //     daysFromToday = daysFromToday - 4
      //   } else if (today === 3) {
      //     daysFromToday = daysFromToday - 3
      //   }
      // }

      // if ((this.todayNum > 3 || this.todayNum === 0) && daysFromToday < 4) return false
      // return daysFromToday < 3 ? false : true

      if (this.timeEST >= 18 || this.timeEST <= 3) {
        if (today === 0) {
          today = 1
        } else if (today === 3) {
          today = 4
        }
      }

      if (daysFromToday < 4) return false
      if (daysFromToday < 8) {
        if (moTuWe.includes(today) && arrB.includes(i)) return false
        if ((today > 3 || today === 0) && arrA.includes(i)) return false
      }
      return true
    },
    getSubscriptionItems(items) {
      return _filterItemsBySubscription(items)
    },
    getAddOns(items) {
      return _filterItemsByAddOns(items)
    },
    async isNewDateCutoffChange() {
      const selectedDayEl = document.querySelector('.c-radio--isActive')
      this.oldDelvDay = sessionStorage.getItem('old_delv_day')
      this.newDelvDay = selectedDayEl.getAttribute('dataday')
      this.newDelvDate = format(selectedDayEl.getAttribute('date'), 'MM-DD-YYYY')

      const dayToNumTable = {
        Sunday: 0,
        Monday: 1,
        Tuesday: 2,
        Wednesday: 3,
        Thursday: 4,
        Friday: 5,
        Saturday: 6
      }

      const dayMap = day => dayToNumTable[day]
      const newDelv_Day = dayMap(this.newDelvDay)
      const oldDelv_Day = dayMap(this.oldDelvDay)

      if ((newDelv_Day < 3 && oldDelv_Day < 3) || (newDelv_Day >= 3 && oldDelv_Day >= 3)) {
        this.isCutoffChange = false
      } else {
        this.isCutoffChange = true
      }
    },
    async triggerConfirmModal() {
      this.UI_SET_MODAL({
        component: 'cModalDeliverychange',
        content: this.modalContent.deliverychange,
        settings: {
          closable: false,
          deliveryChangeDay: this.newDelvDay,
          deliveryChangeDate: this.newDelvDate,
          isCutoffChange: this.isCutoffChange,
          fromSidebarChangeDay: true
        }
      })
    },
    async getNewDelvData() {
      this.CUSTOMER_SET_DELIVERYDAY(this.newDelvDay)
      this.CUSTOMER_SET_DELIVERYDATE(this.newDelvDate)
      localStorage.setItem('selectedDelvDay', this.newDelvDay)

      const cuttoffSet = await setNextCutoffDate(this.newDelvDate)
      this.nxtChargeDate = await addDaysToDate(cuttoffSet, 1)

      let isPastCutoff
      isPastCutoffDayTime(cuttoffSet) ? (isPastCutoff = true) : (isPastCutoff = false)

      return
    },
    async setNewDelvData() {
      stillProcessingWarningPopup()
      const { address, error } = await this.customerUpdateAddress({
        updates: {
          id: this.addressId,
          note_attributes: [
            {
              name: 'Delivery Day',
              value: this.newDelvDay
            },
            {
              name: 'Delivery Date',
              value: this.newDelvDate
            }
          ]
        }
      })

      if (this.isCutoffChange) await this.resetToDefaultMenu()

      this.setNextCharge()
    },
    async setNextCharge() {
      const { charges, onetimes, subscriptions, error } = await this.customerUpdateChargesDate({
        addressId: this.addressId,
        updates: [
          {
            id: this.nextUpcomingCharge[0].id,
            next_charge_date: format(this.nxtChargeDate, 'YYYY-MM-DD')
          }
        ]
      })
      this.cancelModel = false
      this.UI_CLOSE_SIDEBAR()
      removeReloadWarning()
    },
    getProductObject(id) {
      return this.allProducts.find(product => product.variants.find(varn => varn.id === id))
    },
    async setDfMenu() {
      this.dfMenuArr = []
      const arry = this.defaultMenu.favorites.map(async prod => {
        let qty = prod.quantity
        const product = await this.getProductObject(prod.shopify_variant_id)
        let meal = { ...product }
        if (meal) {
          meal.quantity = qty
          if (meal.variants.length > 1) {
            prod.shopify_variant_id === meal.variants[1].id
              ? (meal.upsellId = prod.shopify_variant_id)
              : delete meal.upsellId
          } else {
            delete meal.upsellId
          }
          this.dfMenuArr.push(meal)
        }
      })
    },
    async deleteAddons() {
      const addressId = this.addressId
      const addOnsIds = this.addOnsItemsIds
      const apiClient = new apiService()
      const { data } = await apiClient.delete('/v1/customer/onetimes', {
        data: { addressId, ids: addOnsIds }
      })
      const { charges, onetimes, error } = data
      return { onetimes, error }
    },
    async resetToDefaultMenu() {
      if (!this.isDefaultMenu) {
        stillProcessingWarningPopup()
        await this.deleteAddons()

        const addressId = this.addressId
        const subscriptionIds = this.subscriptionItemIds
        const updates = [...this.setToDefault]

        const appRequest = await fetch('https://fmp-app-production.herokuapp.com/plan/update', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-fmp-key': window.Scoutside.api.fmp_app_key
          },
          body: JSON.stringify({
            addressId,
            updates,
            deletes: subscriptionIds
          })
        })
        return
      }
    }
  },
  async mounted() {
    document.addEventListener(
      'dayChangeConfirmed',
      e => {
        const { confirm } = e.detail
        if (confirm) {
          this.getNewDelvData()
        }
      },
      { once: true }
    ) //false
    if (this.defaultMenuM && this.dfMenuArr.length < 1)
      setTimeout(() => {
        this.setDfMenu()
      }, 500)

    this.isDefaultMenu = sessionStorage.getItem('isDefaultMenu')
  },
  watch: {
    cancelModel: {
      immediate: true,
      handler(val) {
        this.$emit('input', val)
        return false
      }
    },
    nxtChargeDate() {
      this.setNewDelvData()
    },
    defaultMenuM: async function() {
      setTimeout(() => {
        this.setDfMenu()
      }, 100)
    }
  }
}
</script>

<style lang="scss">
.c-editDelivRadios {
  margin-top: 1.25rem;

  .hideThis {
    opacity: 0.4;
    pointer-events: none;
  }

  .c-editDelivRadios__item {
    background-color: #fbfaf4;
    border-radius: 7px;
    border: 1px solid #e2dfd7;
    padding: 0.75rem 1rem;
    margin-bottom: 1rem;
    max-width: 90%;
  }
}

.c-editDelivRadios {
  .c-radio::before {
    box-shadow: none;
  }
}
</style>
