<template>
  <div :class="_buildModifiers('c-shipmentsBox', modifiers)" ref="shipmentBoxx">
    <section :class="isPastCutoff && 'grey-out'">
      <header class="c-shipmentsBox__header">
        <div class="c-shipmentsBox__headings">
          <div v-if="!skipd && isUpcoming">
            <br />
            <h3 class="c-shipmentsBox__heading c-h3">Delivery on {{ formatDayDateIOS(deliveryDate) }}</h3>
            <p class="c-shipmentsBox__copy">
              Select your Meals by {{ formatDayDate(userCutoffDate) }} (6pm EST)
            </p>
          </div>
          <div v-else>
            <h3 class="c-shipmentsBox__heading c-h3">
              {{ formatDayDateIOS(deliveryDate) }}
            </h3>
            <p class="c-shipmentsBox__copy c-shipmentsBox__copy--skip u-colorBroccoli">
              This order has been skipped
            </p>
            <p class="c-shipmentsBox__copy">Unskip before {{ formatDayDate(userCutoffDate) }} (6pm EST)</p>
          </div>
        </div>

        <ul
          v-if="isUpcoming"
          :class="[
            'c-shipmentsBox__actions',
            {
              'c-shipmentsBox__actions--dropdownOpen': dateSelectOpen
            }
          ]"
        >
          <li
            v-if="!skipd"
            :class="[
              'c-shipmentsBox__dropdown',
              {
                recharge__loading: rechargeLoading,
                recharge__loading: delvDateProcessing
              }
            ]"
          >
            <div
              :class="[
                'c-dropdown',
                {
                  'c-dropdown--open': dateSelectOpen
                }
              ]"
            >
              <section class="c-dropdown__inner">
                <div
                  class="c-dropdown__toggle u-relative u-pointer"
                  @click.stop="dateSelectOpen = !dateSelectOpen"
                >
                  {{ dropdownText }}
                  <div class="c-dropdown__icons">
                    <span class="c-dropdown__arrow">
                      <c-icon icon="chevron" />
                    </span>
                  </div>
                </div>
                <div
                  v-for="(day, i) in 7"
                  :class="[
                    'c-dropdown__item',
                    {
                      hideDate: !availableForDelivery.days.includes(i) || dateNotAvailable(i),
                      currentDate: formatDayDateIOS(setDropdownDate(i)).includes(deliveryDay)
                    }
                  ]"
                  :key="i"
                  :daynumber="i"
                  :date="setDropdownDate(i)"
                  @click="dropdownDateClk"
                >
                  <template
                    v-if="
                      setDropdownDate(i)
                        .toString()
                        .includes('Mon')
                    "
                  >
                    {{ formatDayDateMMIOS(setDropdownDate(i)) }} (Office hours)
                  </template>
                  <template
                    v-else-if="
                      setDropdownDate(i)
                        .toString()
                        .includes('Sun')
                    "
                  >
                    {{ formatDayDateMMIOS(setDropdownDate(i)) }} (PM hours)
                  </template>
                  <template v-else>
                    {{ formatDayDateMMIOS(setDropdownDate(i)) }}
                  </template>
                </div>
              </section>
            </div>
          </li>
          <li v-if="!skipd">
            <button class="c-cta" @click="() => handleToggleBundleDrawer()">
              Change Meals
            </button>
          </li>
          <li v-if="!skipd">
            <c-button
              class="c-cta c-cta--inverse c-loading--isSecondary"
              :disabled="submitting || skipsProcessing || delvDateProcessing"
              :loading="loading.skiporder"
              @click="skipOrderFn"
              text="Skip Order"
              :modifiers="['isDefault', 'isSecondary', 'hideTextLoading']"
            />
          </li>
          <li v-else>
            <c-button
              class="c-cta c-loading--isSecondary"
              :disabled="submitting || skipsProcessing || delvDateProcessing"
              :loading="loading.skiporder"
              @click="unSkipOrderFn"
              text="Unskip"
              :modifiers="['isDefault', 'isSecondary', 'hideTextLoading']"
            />
          </li>
        </ul>
      </header>

      <div v-if="isUpcoming" class="c-shipmentsBox__lineItems">
        <h4 class="c-ordersAccordion__heading c-h4">
          Your Meals
          <span v-if="!isNotDefaultMenu || isDefaultMenu" class="c-shipmentsGroups__mealsStatus">
            Default Meals
          </span>
          <span
            v-if="isNotDefaultMenu"
            class="c-shipmentsGroups__mealsStatus c-shipmentsGroups__mealsStatus--edited"
          >
            Selected Meals
          </span>
          <span v-if="!skipped" class="open-date__txt u-hideMobile">
            New Menu Opens 10am EST on {{ formatDayDateIOS(newOpenEditDate) }}
          </span>
          <span v-if="!skipped" class="open-date__txt u-hideDesktop">
            New Menu Opens 10am EST on {{ formatShortMonth(newOpenEditDate) }}
          </span>
          <c-loading v-if="menuLoading" :modifiers="['isSecondary', 'isHollow', 'isSmallest']" />
        </h4>
        <div class="c-shipmentsBox__grid">
          <c-orders-item
            v-for="item in getSubscriptionItems(shipment.lineItems)"
            :discount="priceDiscount"
            :item="item"
            :key="item.id"
          />
        </div>
        <div v-if="!skipped">
          <h4 class="c-ordersAccordion__heading c-h4">
            Fresh+ Add-Ons
          </h4>
          <div class="c-shipmentsBox__grid">
            <c-shipmentsAddOnsPromo
              v-if="!getAddOns(shipment.lineItems).length"
              :content="content"
              @toggleAddOns="() => handleToggleBundleDrawer(1)"
            />
            <c-orders-item
              v-else
              v-for="item in getAddOns(shipment.lineItems)"
              :key="item.id"
              :item="item"
              isAddOn
            />
          </div>
        </div>
      </div>
      <div v-if="isUpcoming" class="c-shipmentsGroups__bottom">
        <c-shipmentsDiscount
          class="c-shipmentsGroups__discount"
          :address="address"
          :shipment="shipment"
          :content="{
            placeholder: content.discount_placeholder,
            button_text: content.discount_button_text,
            button_success: content.discount_button_success
          }"
        />
        <c-shipmentsSummary
          class="c-shipmentsGroups__summary"
          :shipment="shipment"
          :modifiers="[]"
          :content="{
            label_order: content.summary_label_order,
            label_subtotal: content.summary_label_subtotal,
            label_discount: content.summary_label_discount,
            label_tax: content.summary_label_tax,
            label_shipping: content.summary_label_shipping,
            label_total: content.summary_label_total
          }"
        />
      </div>
    </section>
  </div>
</template>

<script>
import { mapGetters, mapState, mapActions, mapMutations } from 'vuex'
import { _buildUpdates } from '@vue/portal/utils'
import cH from '@shared/components/core/cH.vue'
import cIcon from '@shared/components/core/cIcon.vue'
import cButton from '@shared/components/core/cButton.vue'
import cLoading from '@shared/components/core/cLoading.vue'
import cOrdersItem from '../orders/cOrdersItem.vue'
import cShipmentsDiscount from './cShipmentsDiscount.vue'
import cShipmentsAddOnsPromo from './cShipmentsAddOnsPromo.vue'
import cShipmentsSummary from './cShipmentsSummary.vue'
import { _filterItemsByAddOns, _filterItemsBySubscription } from '../../utils'
import cShipments from '../pages/cShipments.vue'
import Datepicker from 'vuejs-datepicker'
import cSvg from '@shared/components/core/cSvg.vue'
import { format } from 'date-fns'
import {
  isPastCutoffDayTime,
  setNextCutoffDate,
  addDaysToDate,
  convertToYYYYMMDDlocalT,
  convertDayToNum,
  getWeekStart,
  calcDatesDiff,
  shipDateBasedOnCharge,
  delay,
  areSortedArraysEqual,
  warningPop,
  stillProcessingWarningPopup,
  removeReloadWarning
} from '@shared/utils'
import { apiService } from '@shared/services'

export default {
  name: 'ShipmentsBox',
  props: {
    shipment: {
      type: Object
    },
    content: {
      type: Object,
      required: true
    },
    dateSelectOpen: {
      type: Boolean
    },
    isUpcoming: {
      type: Boolean
    },
    skipd: {
      type: Boolean
    }
  },
  data() {
    return {
      userCutoffDate: new Date(new Date(this.shipment.scheduled_at) - 1),
      cutoffDayNum: new Date(new Date(this.shipment.scheduled_at) - 1).getDay(),
      shipDate: '',
      shipDateDay: '',
      chargeDelay: '',
      mealIds: [],
      chrgDay1: '',
      chrgDay2: '',
      cutoffD1: '',
      cutoffD2: '',
      dropdownText: 'Change Delivery Date',
      isPastCutoff: false,
      isFutureDelivery: false,
      lastWeek: new Date(new Date(this.shipment.scheduled_at) - 1000 * 60 * 60 * 26 * 6.192),
      newOpenEditDate: new Date(new Date(this.shipment.scheduled_at) - 1000 * 3600 * 24 * 7),
      nextChargeDay: '',
      nextChargeDate: new Date(new Date(this.shipment.scheduled_at)),
      priorChargeDate: '',
      priorWeek: '',
      deliveryDay: this.shipment.note_attributes[0].value.trim(),
      deliveryDate: shipDateBasedOnCharge(this.shipment.scheduled_at, this.shipment.note_attributes[0].value),
      deliveryDateFormat: '',
      currentDate: new Date(),
      selectDateText: 'Click to Select Delivery Date',
      submitting: false,
      deliveryInstructions: '',
      availableForDelivery: {
        days: []
      },
      editingZip: false,
      toDay: new Date(),
      thisWeek: null,
      isCutoffChange: false,
      dfmenuarr: [],
      menuLoading: false,
      rechargeLoading: false,
      modifiers: [],
      newDateTrigger: false,
      resetMenuTrigger: false,
      loading: { skiporder: false },
      ...window.Scoutside.shop
    }
  },
  computed: {
    ...mapState(['bundle', 'account', 'customer']),
    ...mapState('ui', ['defaultMenuOpen', 'skipsProcessing', 'delvDateProcessing', 'timeEST']),
    ...mapState('products', ['defaultMenu']),
    ...mapState('bundle', ['plans', 'selectedPlan']),
    ...mapState('customer', [
      'deliveryday',
      'deliverydays',
      'deliverydate',
      'setdday',
      'isNewSelected',
      'isNextSkipped'
    ]),
    ...mapGetters('customer', [
      'customerUpcomingCharge',
      'customerUpcomingCharges',
      'customerRecharge',
      'customerChargeToAddress',
      'customerAddressesWithStatus',
      ['customerShopify']
    ]),
    ...mapGetters('products', ['allProducts']),
    address() {
      return this.customerChargeToAddress(this.shipment.addressId)
    },
    firstDateOfWeek() {
      const dateStr = convertToYYYYMMDDlocalT(this.deliveryDate)
      return getWeekStart(new Date(dateStr))
    },
    todayNum() {
      return this.toDay.getDay()
    },
    resetDropdownText() {
      if (this.defaultMenuOpen) return (this.dropdownText = 'Change Delivery Date')
    },
    zipFromRC() {
      if (this.customerAddressesWithStatus.active[0].zip.length <= 5) {
        return this.customerAddressesWithStatus.active[0].zip * 1
      } else {
        const zipStr = this.customerAddressesWithStatus.active[0].zip
        const zipArr = zipStr.split('-')
        return zipArr[0] * 1
      }
    },
    selectedday() {
      return new Date(this.deliveryDate).getDay()
    },
    deliveryDateNextWeek() {
      return format(addDaysToDate(this.deliveryDate, 7), 'MM-DD-YYYY')
    },
    deliveryDateLastWeek() {
      return format(addDaysToDate(this.deliveryDate, -7), 'MM-DD-YYYY')
    },
    charge() {
      const { chargeId } = this.settings
      if (chargeId) return this.$store.getters['customer/customerChargeById'](chargeId)
    },
    nextUpcomingCharge() {
      return this.customerUpcomingCharges.filter(chrg => chrg.status !== 'REFUNDED')
    },
    chargeStatus() {
      return this.nextUpcomingCharge[0].status
    },
    startOfShipWeek() {
      return getWeekStart(this.deliveryDate)
    },
    subscriptionItems() {
      return _filterItemsBySubscription(this.shipment.lineItems)
    },
    subscriptionItemIds() {
      const subIds1 = this.subscriptionItems.map(itm => itm.itemId)
      if (typeof subIds1[0] === 'undefined') {
        const subIds2 = this.subscriptionItems.map(itm => itm.subscription_id)
        return subIds2
      } else {
        return subIds1
      }
    },
    addOnsItems() {
      return this.getAddOns(this.shipment.lineItems)
    },
    addOnsItemsIds() {
      return this.addOnsItems.map(item => item.itemId)
    },
    shipmentLineItemIds() {
      return this.shipment.lineItems
        .filter(item => !item.properties.find(property => property.name === '_addOn'))
        .map(item => Number(item.productId))
    },
    lineItemVarIds() {
      return this.shipment.lineItems
        .filter(item => !item.properties.find(property => property.name === '_addOn'))
        .map(item => Number(item.variantId))
    },
    numberOfSubItems() {
      const subz = this.subscriptionItems.map(sub => sub.quantity)
      const reducer = (accumulator, curr) => accumulator + curr
      return subz.reduce(reducer)
    },
    priceDiscount() {
      if (this.numberOfSubItems >= 14) {
        return 3
      } else if (this.numberOfSubItems >= 10) {
        return 2
      } else if (this.numberOfSubItems >= 6) {
        return 1
      }
    },
    defaultMenuM() {
      return this.defaultMenu.favorites
    },
    hasNewDelvDayFromSidebar() {
      return this.setdday
    },
    defaultMenuIds() {
      return this.defaultMenuM.map(item => item.shopify_product_id)
    },
    defaultMenuVarIds() {
      return this.defaultMenuM.map(item => item.shopify_variant_id)
    },
    defaultMenuQtys() {
      return this.defaultMenuM.map(item => item.quantity)
    },
    diffFromShipDateAndToday() {
      return calcDatesDiff(this.toDay, this.startOfShipWeek)
    },
    shipDaysAhead() {
      return 7 - this.diffFromShipDateAndToday
    },
    isDefaultMenu() {
      //  areSortedArraysEqual()
      if (this.shipmentLineItemIds.length !== this.defaultMenuIds.length) return false
      const lineItmVarIdsSrt = this.lineItemVarIds.sort()
      const dfMenuVarIdsSrt = this.defaultMenuVarIds.sort()

      for (var i = 0; i < lineItmVarIdsSrt.length; i++) {
        if (lineItmVarIdsSrt[i] !== dfMenuVarIdsSrt[i]) return false
      }
      for (var i = 0; i < this.defaultMenuQtys.length; i++) {
        const subItmQtys = this.subscriptionItems.map(itm => itm.quantity).sort()
        const dfMItmQtys = this.defaultMenuQtys.sort()
        if (subItmQtys[i] !== dfMItmQtys[i]) return false
      }
      if (this.isNewSelected) return false
      if (this.addOnsItems.length > 0) return false
      return true
    },
    isNotDefaultMenu() {
      if (this.shipmentLineItemIds.length !== this.defaultMenuIds.length) return true
      const lineItmVarIdsSrt = this.lineItemVarIds.sort()
      const dfMenuVarIdsSrt = this.defaultMenuVarIds.sort()

      for (var i = 0; i < this.lineItemVarIds.length; i++) {
        if (lineItmVarIdsSrt[i] !== dfMenuVarIdsSrt[i]) return true
      }
      for (var i = 0; i < this.defaultMenuQtys.length; i++) {
        const subItmQtys = this.subscriptionItems.map(itm => itm.quantity).sort()
        const dfMItmQtys = this.defaultMenuQtys.sort()
        if (subItmQtys[i] !== dfMItmQtys[i]) return true
      }
      if (this.isNewSelected) return true
      if (this.addOnsItems.length > 0) return true
      return false
    },
    nextMealPlan() {
      return this.nextUpcomingCharge[0].lineItems
    },
    modalContent() {
      const deliverychange = this.$store.getters['customize/customizeModalByPrefix']('deliverychange_')
      return { deliverychange }
    },
    skipped() {
      return this.chargeStatus === 'SKIPPED' ? true : false
    },
    setToDefault() {
      return this.dfmenuarr.map(child => {
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
          next_charge_scheduled_at: format(this.nextChargeDate, 'YYYY-MM-DD')
        }
      })
    }
  },
  methods: {
    ...mapActions('customer', [
      'customerSetResources',
      'customerUpdateProfile',
      'customerUpdateChargesDate',
      'customerChargesSkip',
      'customerChargesUnskip',
      'customerUpdateSubscriptions',
      'customerCreateSubscriptions',
      'customerUpdateAddress',
      'customerUpdateAddressItems',
      'setNewCharge'
    ]),
    ...mapMutations('ui', [
      'UI_SET_MODAL',
      'UI_CLOSE_MODAL',
      'UI_TOGGLE_SKIP_PROCESSING',
      'UI_TOGGLE_DELVDATE_PROCESSING',
      'UI_TOGGLE_NO_DFMENU_RETURNED',
      'UI_SET_TIME_EST',
      'UI_PAST_CUTOFF_EST'
    ]),
    ...mapMutations('customer', [
      'CUSTOMER_SET_DELIVERYDAY',
      'CUSTOMER_SET_DELIVERYDATE',
      'CUSTOMER_SET_DELIVERYDAYS',
      'CUSTOMER_SET_NEWSELECTEDMENU',
      'CUSTOMER_SET_NEXTSKIPPED',
      'CUSTOMER_SET_NEXTCHRGDATE'
    ]),
    isChargeDayBefore10aEST() {
      const today0gmt = format(this.toDay, 'MM-DD-YYYY')
      const diffChrgToday = calcDatesDiff(this.nextChargeDate, today0gmt)
      if (diffChrgToday === -7 && this.timeEST > 0 && this.timeEST < 10) this.addFutureDelvCls()
    },
    setIsPastCutoff(bool) {
      return (this.isPastCutoff = bool)
    },
    checkIfPastCutoff() {
      let nowEST, setIfPast, setIsCutoffEST, updateDropdownDates

      const today = this.toDay.getDay()
      const cutoffday = new Date(this.userCutoffDate).getDay()
      const diffFromShip = Math.abs(calcDatesDiff(this.userCutoffDate, this.toDay))

      setIfPast = bool => this.setIsPastCutoff(bool)
      setIsCutoffEST = bool => this.UI_PAST_CUTOFF_EST(bool)
      updateDropdownDates = () => this.dateNotAvailable()

      if (new Date(this.toDay) > new Date(this.userCutoffDate)) {
        setIfPast(true)
        return
      }

      if (today !== cutoffday) {
        return
      }

      const timeCheck = setInterval(
        (function int() {
          let thisDay = new Date()
          let nowUTC = thisDay.getUTCHours()
          nowEST = nowUTC < 5 ? nowUTC + 24 - 5 : nowUTC - 5

          if (today === cutoffday && diffFromShip <= 1 && (nowEST >= 18 || nowEST <= 3)) {
            setIfPast(true)
            setIsCutoffEST(true)
            updateDropdownDates()
            clearInterval(timeCheck)
          }
          return int
        })(),
        1000 * 60
      )
    },
    getProductObject(id) {
      return this.allProducts.find(product => product.variants.find(varn => varn.id === id))
    },
    async setDfMenu() {
      this.dfmenuarr = []
      const arry = this.defaultMenuM.map(async prod => {
        const product = await this.getProductObject(prod.shopify_variant_id)
        const qty = prod.quantity
        let meal = { ...product }

        if (meal) {
          meal.quantity = qty
          if (meal.variants?.length > 1) {
            prod.shopify_variant_id === meal.variants[1].id
              ? (meal.upsellId = prod.shopify_variant_id)
              : delete meal.upsellId
          } else {
            delete meal.upsellId
          }
          this.dfmenuarr.push(meal)
        }
      })
    },
    async setDeliveryDate() {
      this.rechargeLoading = true
      this.UI_TOGGLE_DELVDATE_PROCESSING(true)
      stillProcessingWarningPopup()

      this.deliveryDay = await format(this.shipDate, 'dddd')
      this.deliveryDate = await format(this.shipDate, 'MM-DD-YYYY')
      this.deliveryDateFormat = await format(this.shipDate, 'YYYY-MM-DD')
      this.deliveryDateFormat = (await this.deliveryDateFormat) + 'T00:00:00'

      let newDelvdate = new Date(this.deliveryDateFormat)
      const cuttoffSet = await new Date(setNextCutoffDate(newDelvdate))
      this.userCutoffDate = cuttoffSet
      this.newOpenEditDate = new Date(addDaysToDate(this.userCutoffDate, -6))

      this.CUSTOMER_SET_DELIVERYDAY(this.deliveryDay)
      this.CUSTOMER_SET_DELIVERYDATE(this.deliveryDate)
      localStorage.setItem('selectedDelvDay', this.deliveryDay)
      localStorage.setItem('selectedDelvDate', this.deliveryDate)

      const { address, error } = await this.customerUpdateAddress({
        updates: {
          id: this.shipment.addressId,
          note_attributes: [
            {
              name: 'Delivery Day',
              value: this.deliveryDay
            },
            {
              name: 'Delivery Date',
              value: this.deliveryDate
            }
          ]
        }
      })

      await this.setNewChargeDate()

      this.$emit('deliveryDateChanged')
      this.rechargeLoading = false
      await removeReloadWarning()
      return false
    },
    getSubscriptionItems(items) {
      return _filterItemsBySubscription(items)
    },
    getAddOns(items) {
      return _filterItemsByAddOns(items)
    },
    handleToggleBundleDrawer(step = null) {
      const event = new CustomEvent('openBundleDrawer', {
        detail: {
          children: this.subscriptionItems,
          addOns: this.addOnsItems,
          customer: {
            email: this.customer.recharge.email,
            addressId: this.shipment.addressId,
            subscriptionIds: this.subscriptionItems.map(item => item.itemId),
            addOnsIds: this.addOnsItems.map(item => item.itemId),
            nextChargeDate: this.shipment.scheduledAt,
            likes: this.customerShopify.tags.filter(tag => tag.indexOf('like::') === 0),
            dislikes: this.customerShopify.tags.filter(tag => tag.indexOf('dislike::') === 0),
            tags: this.customerShopify.tags,
            handleFavorites: this.customerUpdateProfile
          },
          activeStep: step
        }
      })
      document.dispatchEvent(event)
      setTimeout(() => {
        this.dropdownText = 'Change Delivery Date'
      }, 500)
    },
    setDropdownDate(index) {
      return new Date(addDaysToDate(new Date(this.firstDateOfWeek), index))
    },
    dateNotAvailable(i) {
      const thisDate = addDaysToDate(this.firstDateOfWeek, i)
      const moTuWe = [1, 2, 3]
      const arrA = [0, 1, 2]
      const arrB = [3, 4, 5, 6]
      let today = this.toDay.getDay()
      let daysFromToday = calcDatesDiff(this.toDay, thisDate)

      if (this.timeEST >= 18 || this.timeEST <= 3) {
        if (today === 0) {
          today = 1
        } else if (today === 3) {
          today = 4
        }
      }

      if (daysFromToday < 4) return true
      if (daysFromToday < 8) {
        if (moTuWe.includes(today) && arrB.includes(i)) return true
        if ((today > 3 || today === 0) && arrA.includes(i)) return true
      }
      return false
      // if ((this.todayNum > 3 || this.todayNum === 0) && daysFromToday < 4) return true
      // if (daysFromToday < 3) return true
    },
    formatDayDate(date) {
      return date != null ? format(new Date(date), 'dddd, MMMM D') : null
    },
    formatDayDateIOS(date) {
      const dateStr = convertToYYYYMMDDlocalT(date)
      return dateStr != null ? format(new Date(dateStr), 'dddd, MMMM D') : null
    },
    formatShortMonth(date) {
      const dateStr = convertToYYYYMMDDlocalT(date)
      return dateStr != null ? format(new Date(dateStr), 'dddd, MMM D') : null
    },
    formatDayDateMMIOS(date) {
      const dateStr = convertToYYYYMMDDlocalT(date)
      return dateStr != null ? format(new Date(dateStr), 'dddd, MMM D') : null
    },
    dropdownDateClk(event) {
      const dateText = event.target.textContent
      this.dropdownText = dateText.split('(')[0].trim()
      this.shipDate = new Date(event.target.getAttribute('date'))
      this.dateSelectOpen = false
    },
    async mainDeliveryFunc(custom_jsonZipData) {
      const convertZipTextToJson = JSON.parse(this.customer.shipCutoffData.custom_json)
      const zipData = Object.entries(convertZipTextToJson)
      const newDay = new Date()
      const currentDay = newDay.getDay()
      const cutoffday = new Date(this.userCutoffDate).getDay()

      const dayToNumTable = {
        sunday: 0,
        monday: 1,
        tuesday: 2,
        wednesday: 3,
        thursday: 4,
        friday: 5,
        saturday: 6
      }

      const makeSundaySeven = tdy => (tdy = tdy === 0 ? tdy + 7 : tdy + 0)
      const dayMap = day => dayToNumTable[day]

      const getShipChargeDaysPerZipandDay = (data, userzip, today) => {
        let getCustomerByZip = Object.entries(data).filter(function(o) {
          if (userzip <= o[1][1]['zip_1'] && userzip >= o[1][1]['zip_0']) {
            return o[0]
          } else {
            return false
          }
        })

        if (getCustomerByZip.length) {
          let xArr = getCustomerByZip.length - 1
          if (getCustomerByZip[xArr][1][1]['ship'] === 'yes') {
            var cutoffDay1 = dayMap(getCustomerByZip[xArr][1][1]['cutoff_day1'])
            var cutoffDay2 = dayMap(getCustomerByZip[xArr][1][1]['cutoff_day2'])
            var chargeDay1 = getCustomerByZip[xArr][1][1]['charge_day1']
            var chargeDay2 = getCustomerByZip[xArr][1][1]['charge_day2']
            var delvDay1 = getCustomerByZip[xArr][1][1]['delivery_day1']
            var delvDay2 = getCustomerByZip[xArr][1][1]['delivery_day2']
            var delvDay1arr = delvDay1
              .replace(' ', '')
              .split(',')
              .map(el => dayMap(el))
            var delvDay2arr = delvDay2
              .replace(' ', '')
              .split(',')
              .map(el => dayMap(el))
            var delvDays = delvDay1arr.concat(delvDay2arr)
            var cutoffToday = cutoffDay1 === today || cutoffDay2 === today ? true : false
            cutoffDay1 = makeSundaySeven(cutoffDay1)
            cutoffDay2 = makeSundaySeven(cutoffDay2)
            this.cutoffD1 = cutoffDay1
            this.cutoffD2 = cutoffDay2
            today = makeSundaySeven(today)

            this.CUSTOMER_SET_DELIVERYDAYS(delvDays)
            localStorage.setItem('delvDays', delvDays)
            this.availableForDelivery.days = delvDays
            this.selectDateText = 'Click to Select Delivery Date'

            this.chrgDay1 = dayMap(chargeDay1)
            this.chrgDay2 =
              dayMap(chargeDay2) < dayMap(chargeDay1) ? dayMap(chargeDay2) + 7 : dayMap(chargeDay2)

            // if ((today > cutoffDay1 && today < cutoffDay2) || (cutoffToday && (this.timeEST >= 18 || this.timeEST <= 3))) {
            //   this.chargeDay = (dayMap(chargeDay2) + 7) - this.shipDateDay;
            // }
          } else {
            this.selectDateText = 'No delivery to this zip'
            this.availableForDelivery.days = []
            this.CUSTOMER_SET_DELIVERYDAYS([])
            localStorage.setItem('delvDays', [])
            this.shipDate = ''
          }
        } else {
          this.availableForDelivery.days = [1, 2, 5, 6]
          this.CUSTOMER_SET_DELIVERYDAYS([1, 2, 5, 6])
          localStorage.setItem('delvDays', [1, 2, 5, 6])
          this.selectDateText = 'Click to Select Delivery Date'
        }
      }

      let newDay1 = new Date(this.startOfShipWeek)
      let newDay2 = new Date(this.startOfShipWeek)

      getShipChargeDaysPerZipandDay(zipData, this.zipFromRC, currentDay)
    },
    setNewChargeDate() {
      this.nextChargeDate = new Date(addDaysToDate(this.userCutoffDate, 1))
      this.priorChargeDate = new Date(addDaysToDate(this.userCutoffDate, -6))
    },
    async changeNextChargeDate() {
      const { charges, onetimes, subscriptions, error } = await this.customerUpdateChargesDate({
        addressId: this.shipment.addressId,
        updates: [
          {
            id: this.nextUpcomingCharge[0].id,
            next_charge_date: format(this.nextChargeDate, 'YYYY-MM-DD')
          }
        ]
      })
    },
    async deleteAddons() {
      const addressId = this.shipment.addressId
      const addOnsIds = this.addOnsItemsIds
      const apiClient = new apiService()
      const { data } = await apiClient.delete('/v1/customer/onetimes', {
        data: { addressId, ids: addOnsIds }
      })
      const { charges, onetimes, error } = data
      return { onetimes, error }
    },
    updateModifiersAndSkip() {
      if (this.chargeStatus === 'SKIPPED') {
        this.skipped = true
        this.modifiers = ['skipped']
      }
    },
    triggerSkipsProcessingModal() {
      this.UI_SET_MODAL({
        component: 'cModalChangesProcessing',
        settings: {
          closable: false
        }
      })
    },
    async skipOrderFn() {
      this.submitting = true
      this.loading.skiporder = true
      this.UI_TOGGLE_SKIP_PROCESSING(true)
      stillProcessingWarningPopup()

      this.triggerSkipsProcessingModal()

      await this.resetToDefaultMenu()

      setTimeout(async () => {
        this.loading.skiporder = true
        const res = await this.customerChargesSkip({
          addressId: this.shipment.addressId,
          updates: [
            {
              id: this.nextUpcomingCharge[0].id,
              subscription_ids: this.subscriptionItemIds
            }
          ]
        })
        if (res.error) {
          console.log('ERROR', res.error)
        }
        this.addSkippedCls()
        this.skipd = true
        this.CUSTOMER_SET_NEXTSKIPPED(true)
        this.submitting = false
        this.loading.skiporder = false
        this.UI_TOGGLE_SKIP_PROCESSING(false)
        removeReloadWarning()
      }, 750)

      await this.customerUpdateAddress({
        updates: {
          id: this.shipment.addressId,
          note_attributes: [
            {
              name: 'Delivery Day',
              value: this.deliveryDay
            },
            {
              name: 'Delivery Date',
              value: this.deliveryDateNextWeek
            }
          ]
        }
      })

      this.resetMenuTrigger = false
      await delay(1000)
    },
    async unSkipOrderFn() {
      this.submitting = true
      this.loading.skiporder = true
      this.UI_TOGGLE_SKIP_PROCESSING(true)
      this.triggerSkipsProcessingModal()
      stillProcessingWarningPopup()

      const { charges, onetimes, subscriptions, error } = await this.customerChargesUnskip({
        addressId: this.shipment.addressId,
        updates: [
          {
            id: this.nextUpcomingCharge[0].id,
            subscription_ids: this.subscriptionItemIds
          }
        ]
      })

      //let i
      // for (i = 0; i < this.subscriptionItemIds.length; i++) {
      //   const { charges, onetimes, subscriptions, error } = await this.customerChargesUnskip({
      //     addressId: this.shipment.addressId,
      //     updates: [
      //       {
      //         id: this.nextUpcomingCharge[0].id,
      //         subscription_id: this.subscriptionItemIds[i]
      //       }
      //     ]
      //   })
      //   if (error) {
      //     console.log('ERROR', error)
      //   }
      // }

      await this.customerUpdateAddress({
        updates: {
          id: this.shipment.addressId,
          note_attributes: [
            {
              name: 'Delivery Day',
              value: this.deliveryDay
            },
            {
              name: 'Delivery Date',
              value: format(new Date(this.deliveryDate), 'MM-DD-YYYY')
            }
          ]
        }
      })

      this.submitting = false
      this.skipd = false
      this.skipped = false
      this.CUSTOMER_SET_NEXTSKIPPED(false)
      this.UI_TOGGLE_SKIP_PROCESSING(false)
      removeReloadWarning()
      this.modifiers = []
      this.loading.skiporder = false
      this.shipment.status = 'QUEUED'
      this.removeSkippedCls()
      // this.setNewChargeId()
      const { success } = await this.customerSetResources({
        resources: ['charges', 'subscriptions']
      })
      if (this.lastWeek > this.toDay) {
        setTimeout(() => {
          this.addFutureDelvCls()
        }, 250)
      }
    },
    confirmDeliveryDateModal() {
      let boolAnswer
      let covtToDate = new Date(`'${this.userCutoffDate}'`)
      let cutd = covtToDate.getDay()
      let diffFromOldToNewShips = calcDatesDiff(new Date(this.deliveryDate), this.shipDate)

      if (cutd === this.cutoffD1) {
        if (this.shipDate.getDay() < cutd) {
          boolAnswer = false
        }
        if (this.shipDate.getDay() >= cutd) {
          boolAnswer = true
        }
      } else {
        if (this.shipDate.getDay() >= this.cutoffD1) {
          boolAnswer = false
        }
        if (this.shipDate.getDay() < this.cutoffD1 || diffFromOldToNewShips < -2) {
          boolAnswer = true
        }
      }

      this.UI_SET_MODAL({
        component: 'cModalDeliverychange',
        content: this.modalContent.deliverychange,
        settings: {
          closable: false,
          deliveryChangeDay: format(this.shipDate, 'dddd'),
          deliveryChangeDate: format(this.shipDate, 'MM-DD-YYYY'),
          isCutoffChange: boolAnswer
        }
      })
    },
    async resetToDefaultMenu() {
      if (!this.isDefaultMenu) {
        this.menuLoading = true

        await this.deleteAddons()
        await delay(100)

        try {
          const addressId = this.shipment.addressId
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

          if (appRequest)
            setTimeout(() => {
              this.setNewLineItems()
            }, 250)
          this.menuLoading = false
          return appRequest
        } catch (error) {
          console.error('dfmenureset error', error)
        }
      }
    },
    async getChargesData() {
      const apiClient = new apiService()
      const { data } = await apiClient.get('/v1/customer/resources?resources=charges')
      const charges = data.resources.charges
      return charges
    },
    async setNewChargeId() {
      const charges = await this.getChargesData()
      charges.some(chrg => {
        if (chrg.status === 'QUEUED') {
          this.shipment.id = chrg.id
        }
      })
    },
    async setNewLineItems() {
      const charges = await this.getChargesData()
      charges.some(chrg => {
        if (chrg.status === 'QUEUED') this.shipment.lineItems = chrg.lineItems
      })
      this.CUSTOMER_SET_NEWSELECTEDMENU(false)
    },
    async setShipDateStates() {
      this.CUSTOMER_SET_DELIVERYDAY(this.deliveryDay)
      this.CUSTOMER_SET_DELIVERYDATE(this.deliveryDate)
      localStorage.setItem('selectedDelvDay', this.deliveryDay)
      localStorage.setItem('selectedDelvDate', this.deliveryDate)
    },
    async setFutureShipDate() {
      if (this.toDay < new Date(this.lastWeek)) {
        this.addFutureDelvCls()
      } else {
        this.removeFutureDelvCls()
      }
    },
    async disableIfPriorToUpcomingWeek() {
      if (this.toDay < this.priorChargeDate) {
        this.addFutureDelvCls()
      } else {
        this.removeFutureDelvCls()
      }
    },
    removeSkippedCls() {
      this.$refs.shipmentBoxx?.classList.remove('c-shipmentsBox--skipped')
      this.$refs.shipmentBoxx?.classList.remove('future-delivery')
    },
    addSkippedCls() {
      const boxx = document.querySelector('.c-shipmentsBox')
      boxx.classList.add('c-shipmentsBox--skipped')
      //this.$refs.shipmentBoxx.classList.add('c-shipmentsBox--skipped')
    },
    addFutureDelvCls() {
      this.$refs.shipmentBoxx?.classList.add('future-delivery')
    },
    removeFutureDelvCls() {
      this.$refs.shipmentBoxx?.classList.remove('future-delivery')
    },
    setIsDefault() {
      sessionStorage.setItem('isDefaultMenu', true)
    },
    removeIsDefault() {
      sessionStorage.removeItem('isDefaultMenu')
    },
    async setNewDelvDate() {
      document.addEventListener(
        'deliveryChangeConfirmed',
        async e => {
          const { confirmed, isCutoffChange } = e.detail
          if (confirmed) this.newDateTrigger = !this.newDateTrigger
          if (isCutoffChange) {
            this.resetMenuTrigger = true
            this.checkIfPastCutoff()
          }
        },
        { once: true }
      )
    },
    async setDayModalCancel() {
      document.addEventListener(
        'dayChangeCanceled',
        async e => {
          const { canceled } = e.detail
          if (canceled) {
            this.dropdownText = 'Change Delivery Date'
          }
        },
        { once: true }
      )
    },
    async bundleDrawerClose() {
      document.addEventListener('closeBundleDrawer', async () => {
        this.setDfMenu()
      })
    },
    async triggerBundleDrawer() {
      let x
      const isAddOnPdp = sessionStorage.getItem('is_addOn')
      isAddOnPdp === 'true' ? (x = 1) : (x = 0)
      if (this.subscriptionItems) this.handleToggleBundleDrawer(x)
    }
  },
  async created() {
    this.setShipDateStates()
    //this.setFutureShipDate();
  },
  async mounted() {
    this.mainDeliveryFunc()
    this.setFutureShipDate()
    if (this.defaultMenuM && this.dfmenuarr.length < 1)
      setTimeout(() => {
        this.setDfMenu()
      }, 500)
    this.updateModifiersAndSkip()

    const fromPdp = sessionStorage.getItem('from_pdp')
    if (fromPdp) await this.triggerBundleDrawer()
    sessionStorage.removeItem('from_pdp')
    sessionStorage.removeItem('bundle_content')
    sessionStorage.removeItem('addon_content')

    this.bundleDrawerClose()

    if (this.isDefaultMenu) this.setIsDefault()
    if (this.isNotDefaultMenu) this.removeIsDefault()

    this.checkIfPastCutoff()
    this.isChargeDayBefore10aEST()
  },
  watch: {
    shipDate() {
      this.confirmDeliveryDateModal()
      this.setNewDelvDate()
      this.setDayModalCancel()
    },
    defaultMenuM() {
      setTimeout(() => {
        this.setDfMenu()
      }, 125)
    },
    priorChargeDate(newValue, oldValue) {
      this.disableIfPriorToUpcomingWeek()
    },
    async nextChargeDate() {
      await this.changeNextChargeDate()
      if (this.resetMenuTrigger) await this.resetToDefaultMenu()
    },
    async newDateTrigger() {
      await this.setDeliveryDate()
      // if(this.resetMenuTrigger) await this.resetToDefaultMenu();
    },
    async skipsProcessing() {
      await delay(325)
      if (!this.skipsProcessing) this.UI_CLOSE_MODAL()
    },
    isNotDefaultMenu() {
      if (this.isDefaultMenu) this.setIsDefault()
      if (this.isNotDefaultMenu) this.removeIsDefault()
    }
  },
  components: {
    cH,
    cButton,
    cIcon,
    cOrdersItem,
    cShipmentsDiscount,
    cShipmentsAddOnsPromo,
    cShipmentsSummary,
    cShipments,
    Datepicker,
    cSvg,
    cLoading
  }
}
</script>

<style lang="scss">
@mixin no__click {
  opacity: 0.5;
  pointer-events: none;
}

.c-shipmentsBox {
  background-color: $color-ecru;
  border-radius: 12px;
  border: 1px solid $color-paleo;
  padding: 23px 26px;
}

.open-date__txt {
  display: none;
}

.recharge__loading {
  @include no__click;
}

.c-shipmentsBox--skipped {
  section > div,
  header > div {
    @include no__click;
  }
}

.future-delivery {
  .c-shipmentsBox__actions {
    li:nth-child(2) {
      @include no__click;
    }
  }

  .open-date__txt {
    display: inline-block;
    font-family: Mier, sans-serif;
    font-size: 12px;
    font-weight: 400;
    margin-left: 0.75rem;

    @include media-desktop-up {
      font-size: 16px;
      margin-left: 1rem;
    }
  }

  .c-lineItem--promo {
    display: none;
  }
}

.grey-out {
  @include no__click;
}

.c-shipmentsBox__header {
  @include media-desktop-up {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .c-shipments__box--first & {
    border-bottom: 1px solid $color-paleo;
    padding-bottom: 11px;
  }
}
.c-dropdown--open .c-dropdown__item {
  cursor: pointer;

  &.hideDate {
    display: none;
  }

  &.currentDate {
    opacity: 0.5;
    pointer-events: none;
  }
}

.c-shipmentsBox__actions {
  display: grid;
  grid-row-gap: 12px;
  @include media-desktop-up {
    grid-template-columns: minmax(225px, 1fr) 1fr 1fr;
    grid-row-gap: 0;
    grid-column-gap: 7px;
    padding-left: 20px;
    max-width: 53%;
  }
  &.c-shipmentsBox__actions--dropdownOpen {
    @include media-desktop-up {
      grid-template-columns: minmax(225px, 1fr) 1fr 1fr;
    }
  }
  .c-shipmentsBox--skipped & {
    @include media-desktop-up {
      grid-template-columns: minmax(225px, 1fr);
    }
  }
  .c-dropdown__inner {
    /*box-shadow: 0 0 0 1px $color-paleo;*/
    border: 1px solid $color-paleo;
    background-color: $color-ecru;

    width: fit-content;
    min-width: 100%;
    .c-dropdown__toggle {
      letter-spacing: 0.25px;
      padding-right: 32px;
    }
  }
  .c-cta,
  .c-dropdown__toggle {
    font-weight: 500;
  }
}

.c-shipmentsBox__dropdown {
  order: 1;
  @include media-desktop-up {
    order: 0;

    .vdp-datepicker {
      .vdp-datepicker__calendar {
        width: calc(100% + 5rem);
      }

      input[type='text'] {
        font-weight: 500;
        font-size: 16px;
        padding: 14px 20px;
      }
    }
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
  line-height: 1.125;
  @include media-tablet-up {
    font-size: 17px;
  }
}
.c-shipmentsBox__copy--skip {
  margin-bottom: 10px;
}
.c-shipmentsBox__grid {
  display: grid;
  grid-gap: 10px;
  @include media-tablet-up {
    grid-template-columns: repeat(2, 1fr);
    grid-gap: 20px 40px;
  }
  @include media-desktop-up {
    grid-template-columns: repeat(3, 1fr);
  }

  & + div .c-ordersAccordion__heading {
    margin-top: 1rem;
  }
}

.c-shipmentsBox__lineItems {
  .c-ordersAccordion__heading {
    @include media-tablet-down {
      display: grid;
      grid-template-columns: 1fr 1fr;

      .open-date__txt {
        grid-column-start: 1;
        grid-column-end: 3;
        margin: 1rem 0 0 0;
      }
    }
  }
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
.c-shipmentsGroups__summary {
  box-shadow: 0 0 0 1px $color-paleo;
  border-radius: 24px;
  @include media-desktop-up {
    width: 272px;
  }
}
.c-shipmentsDiscount__input {
  max-width: 160px;
}
.c-shipmentsGroups__discount {
  margin-bottom: 10px;
  @include media-desktop-up {
    max-width: 313px;
    margin: 0;
  }
}
.c-shipmentsGroups__mealsStatus {
  width: 130px;
  text-align: center;
  text-transform: uppercase;
  font-family: $font-body;
  font-size: 11px;
  border-radius: 6px;
  background-color: $color-paleo;
  color: $color-off-black;
  letter-spacing: 0.08em;
  margin-left: 18px;
  padding: 7px 10px;
  line-height: 1;
}
.c-shipmentsGroups__mealsStatus--edited {
  background-color: $color-evergreen-light;
  color: $color-evergreen;
}

.c-sidebar__line {
  .vdp-datepicker input[type='text'] {
    color: #fbfaf4;
  }
}

.placeholder-wrap {
  position: relative;
}

.placeholder-wrap::after {
  position: absolute;
  top: 18px;
  left: 18px;
  color: #555;
  content: 'Change Delivery Date';
  font-size: 17px;
  font-weight: 400;
  pointer-events: none;
}

.placeholder-arrow {
  position: absolute;
  top: 17px;
  right: 19px;
  color: #3a3a3a;
  font-weight: 400;
  z-index: 0;

  svg {
    width: 18px;
    height: 18px;

    path {
      fill: #3a3a3a !important;
      stroke: #3a3a3a !important;
    }
  }
}

.vdp-datepicker__calendar .cell.selected.highlighted {
  background-color: #cae5ed;
}

.c-cta--inverse {
  .c-loading__wheel {
    border-top-color: $color-broccoli;
  }
}

.u-hideMobile {
  @include media-tablet-down {
    display: none !important;
  }
}

.u-hideDesktop {
  @include media-desktop-up {
    display: none !important;
  }
}
</style>
