<template>
  <div :class="_buildModifiers('c-shipments', modifiers)">
    <div v-if="display_disablePortal">
      <c-shipmentsNoFmpAppReturn />
    </div>
    <div v-else>
      <c-shipmentsLoading class="c-shipments__loading" v-if="!ready" />
      <div class="c-shipments__content" v-if="ready">
        <div
          v-if="customerRecharge && customerCharges.length"
          class="c-heroShort c-heroShort--shorter u-hideMobileDown"
        >
          <div class="o-containerLarge">
            <h2 class="c-heroShort__heading c-h2">
              Welcome Back, {{ customerShopify.firstName }}!
            </h2>
          </div>
        </div>

        <div
          v-if="!customerUpcomingCharges.length && !customerRecharge"
          class="o-containerLarge"
        >
          <!-- <c-shipmentsNoOrders :content="content" :ordercontent="orders" /> -->
          <c-ordersSubscribePromo :content="orders" />
        </div>

        <div v-if="customerRecharge && !activeSubs">
          <!-- activeSubs customerUpcomingCharges.length -->
          <c-shipmentsNoSubcscriptions
            :content="content"
            :addressID="addresses[0].id"
            :address="addresses[0]"
          />
        </div>

        <div v-if="activeSubs && noDFMenuReturnedFromApp">
          <c-shipmentsNoFmpAppReturn />
        </div>

        <div
          v-if="customerCharges.length && !noDFMenuReturnedFromApp"
          class="c-shipments__page o-container"
        >
          <div
            v-if="
              customerUpcomingCharges.length ||
                !customerRecharge.SubscriptionsActive
            "
          >
            <c-shipmentsChargeFailed
              v-if="chargeFailed"
              :content="content"
              :newCardPending="cardUpdatePending"
              class="c-shipments__callout"
            />
            <div :class="`${chargeFailed ? 'u-disable' : ''}`">
              <h1 class="c-shipments__heading c-h1">
                {{
                  customerUpcomingCharges.length
                    ? 'Upcoming Orders'
                    : 'Your Order History'
                }}
              </h1>
              <!-- v-if="activeSubs" -->
              <c-shipmentsBox
                v-if="activeSubs && !chargeFailed"
                class="c-shipments__box c-shipments__box--first"
                :shipment="nextUpcomingCharge[0]"
                :isUpcoming="true"
                :content="content"
                :skipd="
                  nextUpcomingCharge[0]
                    ? nextUpcomingCharge[0].status === 'SKIPPED'
                    : false
                "
                @deliveryDateChanged="updateComponents"
                :key="comp"
              />
              <!-- :modifiers="customerUpcomingCharges[0].status === 'SKIPPED' ? ['skipped'] : []" -->
              <!-- :skipped="customerUpcomingCharges[0].status === 'SKIPPED'" -->

              <!-- @dfmenuResetDone="forceUpdate" -->
              <!-- @dfmenuResetDone="dfmenuUpdate" -->
              <!--  <c-shipmentsBox v-for="(charge, index) in customerUpcomingCharges" :key="charge.id"
                  :class="['c-shipments__box', {
                    'c-shipments__box--first': index === 0
                  }]"
                  :modifiers="charge.status === 'SKIPPED' ? ['skipped'] : []"
                  :skipped="charge.status === 'SKIPPED'"
                  :shipment="charge"
                  :isUpcoming="index === 0"
                  :content="content"
              /> -->
              <template
                v-if="customerUpcomingCharges.length && !noSkipsReturnedFromApp"
              >
                <!-- activeSubs -->
                <c-shipmentsBoxFuture
                  v-for="(row, i) in 4"
                  :key="i + 1 + key"
                  ref="boxFuture"
                  class="c-shipments__box c-shipmentsBox"
                  :nextChargeInfo="
                    nextUpcomingCharge[i + 1]
                      ? nextUpcomingCharge[i + 1]
                      : nextUpcomingCharge[0]
                  "
                  :weeksOut="i"
                  :hasCharge="nextUpcomingCharge[i + 1] ? true : false"
                  :numOfCharges="nextUpcomingCharge.length"
                />
              </template>
              <!-- v-if="customerOrders.length > 1" -->
              <p class="c-shipmentsBox__total u-xPad">Most Recent Order</p>
              <c-shipmentsBoxRecent
                class="c-shipments__box c-shipmentsBox"
                :orderInfo="customerOrders"
                @deliveryDateChanged="forceUpdate"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions, mapMutations, mapState } from 'vuex'
import { _sortItemsByCharge } from '@vue/portal/utils'
import cShipmentsLoading from '../shipments/cShipmentsLoading.vue'
import cShipmentsLoyalty from '../shipments/cShipmentsLoyalty.vue'
import cShipmentsEmpty from '../shipments/cShipmentsEmpty.vue'
import cShipmentsBox from '../shipments/cShipmentsBox.vue'
import cShipmentsBoxFuture from '../shipments/cShipmentsBoxFuture.vue'
import cShipmentsBoxRecent from '../shipments/cShipmentsBoxRecent.vue'
import cShipmentsReferral from '../shipments/cShipmentsReferral.vue'
import cShipmentsUpsell from '../shipments/cShipmentsUpsell.vue'
import cShipmentsChargeFailed from '../shipments/cShipmentsChargeFailed.vue'
import cShipmentsNoOrders from '../shipments/cShipmentsNoOrders.vue'
import cShipmentsNoSubcscriptions from '../shipments/cShipmentsNoSubcscriptions.vue'
import cShipmentsNoFmpAppReturn from '../shipments/cShipmentsNoFmpAppReturn.vue'
import cOrdersSubscribePromo from '../orders/cOrdersSubscribePromo.vue'

export default {
  name: 'Shipments',
  data() {
    return {
      ready: null,
      chargeFailed: false,
      // cardUpdateStatus
      cardUpdatePending: false,
      key: 0,
      pop: 0,
      compUpdate: 0,
      comp: 0,
      ...window.Scoutside.shop
    }
  },
  props: {
    modifiers: {
      type: Array,
      default: () => []
    }
  },
  components: {
    cShipmentsBox,
    cShipmentsBoxFuture,
    cShipmentsBoxRecent,
    cShipmentsChargeFailed,
    cShipmentsEmpty,
    cShipmentsLoading,
    cShipmentsLoyalty,
    cShipmentsNoOrders,
    cShipmentsNoSubcscriptions,
    cShipmentsNoFmpAppReturn,
    cShipmentsReferral,
    cShipmentsUpsell,
    cOrdersSubscribePromo
  },
  computed: {
    ...mapState('customer', [
      'deliveryday',
      'deliverydate',
      'noteAttributeDelivDate'
    ]),
    ...mapState('ui', ['noDFMenuReturnedFromApp', 'noSkipsReturnedFromApp']),
    ...mapGetters('customer', [
      'customerAddressesWithStatus',
      'customerChargeError',
      'customerCharges',
      'customerOrders',
      'customerRecharge',
      'customerShopify',
      'customerSubscriptions',
      'customerUpcomingCharges'
    ]),
    content() {
      return this.$store.getters['customize/customizeContentByKey']('shipments')
    },
    orders() {
      return this.$store.getters['customize/customizeContentByKey']('orders')
    },
    nextUpcomingCharge() {
      return this.customerUpcomingCharges?.filter(
        (chrg) => chrg.status !== ('REFUNDED' || 'CANCELLED')
      )
    },
    activeSubs() {
      return this.customerSubscriptions?.some((sub) => sub.status === 'ACTIVE')
    },
    addresses() {
      const active = _sortItemsByCharge({
        items: this.customerAddressesWithStatus.active,
        order: 'ascending'
      })
      const inactive = _sortItemsByCharge({
        items: [
          ...this.customerAddressesWithStatus.inactive,
          ...this.customerAddressesWithStatus.empty
        ],
        order: 'ascending'
      })
      return [...active, ...inactive]
    },
    userAddressId() {
      return this.customerRecharge && this.nextUpcomingCharge.length
        ? this.nextUpcomingCharge[0].addressId
        : null
    }
  },
  methods: {
    ...mapActions('customer', [
      'customerSetResources',
      'customerUpdateAddressItems',
      'customerGetSkips'
    ]),
    ...mapMutations('customer', ['CUSTOMER_SET_DELIVERYDATE']),
    ...mapMutations('ui', ['UI_TOGGLE_NO_SKIPS_RETURNED']),
    forceUpdate(name) {
      this.key++
    },
    updateComponents() {
      this.compUpdate++
    },
    // dfmenuUpdate(name) {
    //   this.comp++;
    // },
    async getSkippedDeliveries() {
      const getSkips = await this.customerGetSkips({
        address_id: this.userAddressId
      })
      if (!getSkips) this.UI_TOGGLE_NO_SKIPS_RETURNED(true)
    }
  },
  watch: {
    customerChargeError: {
      immediate: true,
      handler(val) {
        if (val) {
          this.chargeFailed = true
          if (
            this.customerChargeError.error_type ===
            'CARD_UPDATED_NOW_PENDING_NEXT_ATTEMPT'
          )
            this.cardUpdatePending = true
        }
      }
    },
    compUpdate: {
      handler: 'forceUpdate'
    }
  },
  async created() {
    sessionStorage.setItem(
      'selected_plan',
      '{"title":"6 Meals","subscription":true,"price":"1199","text":"Subscribe & Save 8%","minimum":6}'
    )
    const { success, error } = await this.customerSetResources({
      resources: ['addresses', 'charges', 'onetimes', 'subscriptions', 'orders']
    })
    if (error) this.error = error
    this.ready = true

    this.getSkippedDeliveries()
  },
  mounted() {
    document.addEventListener('closeBundleDrawer', async () => {
      const { success, error } = await this.customerSetResources({
        resources: ['charges']
      })
      if (error) this.error = error
    })

    document.addEventListener('reactivateSubscriptions', (e) => {
      this.comp++
    })
  }
}
</script>

<style lang="scss">
.c-shipments__flex {
  padding: 30px 0 60px;
  @include flex($direction: column, $wrap: nowrap);
  @include media-desktop-up {
    padding-top: 40px;
    @include flex($justify: space-between, $align: flex-start, $wrap: nowrap);
  }
}
.c-shipments__flexSmall {
  width: 100%;
  @include flex($direction: column);
  @include media-tablet-only {
    margin-bottom: 30px;
    @include flex($justify: space-between, $wrap: nowrap);
  }
  @include media-desktop-up {
    width: 280px;
    margin-left: 40px;
  }
}
.c-shipments__flexLarge {
  width: 100%;
  @include media-desktop-up {
    width: calc(100% - 320px);
    order: -1;
  }
}
.c-shipments__heading {
  font-size: 24px;
  margin-bottom: 30px;
  @include media-desktop-up {
    font-size: 28px;
    padding-left: 27px;
  }
}
.c-shipments__page {
  padding-top: 30px;
  @include media-desktop-up {
    max-width: 1084px;
    margin: 0 auto;
    padding-top: 53px;
  }
}
.c-shipments__callout {
  margin-bottom: 34px;
  @include media-desktop-up {
    max-width: calc(100% - 54px);
    margin: 0 auto 67px;
  }
}
.c-shipments__box {
  max-width: 1012px;
  margin: 0 auto 30px;
  &.c-shipments__box--first {
    max-width: none;
  }
}
.u-disable {
  opacity: 0.5;
  pointer-events: none;
}

.u-xPad {
  padding: 16px 0 12px 28px;
  @include media-mobile-down {
    padding-left: 0;
  }
}

.c-drawer--onRight {
  @include media-tablet-up {
    .u-bgSpringWood .c-basketPage {
      .nav__wrapper {
        position: sticky;
        top: 0;
        z-index: 11;
      }
    }
  }
}
</style>
