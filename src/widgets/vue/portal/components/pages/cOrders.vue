<template>
  <div class="o-containerLarge">
    <div :class="_buildModifiers('c-orders', modifiers)">
      <c-ordersLoading class="c-orders__loading" v-if="!ready" />
      <div v-else>
        <section v-if="orders">
          <div class="c-orders__promo" v-if="!activeSubs && totalSubs">
            <c-ordersRestart
              :address="address"
              :addressId="addressId"
              :content="content"
              :delivday="noteDeliveryDay"
              class="c-orders__content"
            />
          </div>
          <c-ordersSubscribePromo
            v-if="!activeSubs && !totalSubs"
            :content="content"
            :billing="customerRecharge.billingAddress"
            class="c-orders__promo"
          />
          <div class="c-orders__content">
            <div class="c-orders__content" v-if="orders">
              <c-h
                class="c-orders__heading"
                v-if="content.page_heading"
                tag="h1"
                level="1"
                :text="content.page_heading"
              />
              <c-h
                class="c-orders__subheading"
                v-if="content.last_heading"
                tag="h5"
                level="5"
                :modifiers="['isLabel']"
                :text="content.last_heading"
              />
              <c-ordersAccordion
                class="c-orders__accordion"
                :orders="[orders[0]]"
                :open="0"
                :content="{
                  name: content.order_name,
                  processing: content.order_processing,
                  transit: content.order_transit,
                  track: content.order_track,
                  delivered: content.order_delivered,
                  ships: content.order_ships,
                  billing: content.order_billing,
                  payment: content.order_payment,
                  paid: content.order_paid,
                  subtotal: content.order_subtotal_label,
                  discount: content.order_discount_label,
                  shipping: content.order_shipping_label,
                  tax: content.order_tax_label,
                  total: content.order_total_label
                }"
              />
              <span class="c-orders__scrollTo" ref="scrollTo" />
              <c-h
                class="c-orders__subheading"
                v-if="activeOrders.length > 0 && content.previous_heading"
                tag="h5"
                level="5"
                :modifiers="['isLabel']"
                :text="content.previous_heading"
              />
              <c-ordersAccordion
                class="c-orders__accordion"
                v-if="activeOrders.length > 0"
                :orders="activeOrders"
                :content="{
                  name: content.order_name,
                  processing: content.order_processing,
                  transit: content.order_transit,
                  track: content.order_track,
                  delivered: content.order_delivered,
                  ships: content.order_ships,
                  billing: content.order_billing,
                  payment: content.order_payment,
                  paid: content.order_paid,
                  subtotal: content.order_subtotal_label,
                  discount: content.order_discount_label,
                  shipping: content.order_shipping_label,
                  tax: content.order_tax_label,
                  total: content.order_total_label
                }"
              />
              <c-pagination
                class="c-orders__pagination"
                :active="activePagination"
                :count="paginationCount"
                @update="updatePagination"
              />
            </div>
          </div>
        </section>
        <div v-else>
          <c-ordersSubscribePromo :content="content" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import cH from '@shared/components/core/cH.vue'
import cPagination from '@shared/components/core/cPagination.vue'
import cOrdersLoading from '../orders/cOrdersLoading.vue'
import cOrdersEmpty from '../orders/cOrdersEmpty.vue'
import cOrdersAccordion from '../orders/cOrdersAccordion.vue'
import cOrdersSubscribePromo from '../orders/cOrdersSubscribePromo.vue'
import cOrdersRestart from '../orders/cOrdersRestart.vue'

export default {
  name: 'Orders',
  props: {
    modifiers: {
      type: Array,
      default: () => []
    }
  },
  components: {
    cH,
    cPagination,
    cOrdersLoading,
    cOrdersEmpty,
    cOrdersAccordion,
    cOrdersSubscribePromo,
    cOrdersRestart
  },
  data: () => ({
    activePagination: 1,
    ready: false,
    error: false
  }),
  computed: {
    ...mapGetters('customer', [
      'customerOrders',
      'customerRecharge',
      'customerSubscriptions',
      'customerAddressesWithStatus',
      'customerAddressesWithStatus'
    ]),
    address() {
      let addrObj = this.customerRecharge.billingAddress
      addrObj.id = this.addressId
      return addrObj
    },
    addressId() {
      return this.customerSubscriptions[0].addressId
    },
    noteDeliveryDay() {
      if (this.customerAddressesWithStatus?.inactive.length) {
        return this.customerAddressesWithStatus.inactive[0].note_attributes[0]
          .value
      }
      if (this.customerAddressesWithStatus?.empty.length) {
        return this.customerAddressesWithStatus.empty[0].note_attributes[0]
          .value
      }
      return this.orders?.[this.orders.length - 1].note_attributes[0].value
    },
    content() {
      return this.$store.getters['customize/customizeContentByKey']('orders')
    },
    activeSubs() {
      return this.customerSubscriptions.some((sub) => sub.status === 'ACTIVE')
    },
    totalSubs() {
      return this.customerRecharge.subscriptionsTotal
    },
    orders() {
      return this.customerOrders
        ? this.customerOrders.length > 0
          ? this.customerOrders
          : false
        : false
    },
    activeOrders() {
      if (this.orders) {
        let prevOrders = [...this.orders]
        prevOrders.shift()
        const startIndex = (this.activePagination - 1) * 5
        const endIndex = this.activePagination * 5
        return prevOrders.slice(startIndex, endIndex)
      }
    },
    paginationCount() {
      if (this.orders) {
        let prevOrders = [...this.orders]
        prevOrders.shift()
        return Math.ceil(prevOrders.length / 5)
      }
    }
  },
  methods: {
    ...mapActions('customer', ['customerSetResources']),
    updatePagination(index) {
      this.activePagination = index
      const { scrollTo } = this.$refs
      setTimeout(() => {
        const outOfViewport = this._domOutOfViewport(scrollTo)
        if (outOfViewport.any) this._eventScrollTo(scrollTo, 350)
      })
    }
  },
  async created() {
    const { success, error } = await this.customerSetResources({
      resources: ['orders', 'subscriptions']
    })
    if (error) this.error = error
    this.ready = true
  }
}
</script>

<style lang="scss">
.c-orders {
  margin: 0 auto;
  padding: 30px 0 60px;
  @include media-desktop-up {
    padding-top: 40px;
  }
}
.c-orders__promo {
  max-width: 1012px;
  margin: 0 auto 30px;
  @include media-desktop-up {
    margin-bottom: 45px;
  }
}
.c-orders__content {
  max-width: 948px;
  margin: 0 auto;
}
.c-orders__heading {
  font-size: 24px;
  color: $color-off-black;
  margin-bottom: 30px;
  @include media-desktop-up {
    font-size: 32px;
    margin-bottom: 40px;
  }
}
.c-orders__subheading {
  font-family: $font-body;
  text-transform: uppercase;
  font-size: 14px;
  letter-spacing: 0.07em;
}
.c-orders__accordion {
  margin-bottom: 60px;
}
.c-orders__scrollTo {
  display: block;
  height: 50px;
  margin-top: -50px;
  opacity: 0;
  z-index: $z-index-behind;
}
</style>
