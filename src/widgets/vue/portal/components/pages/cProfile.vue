<template>
  <div class="c-page" v-if="ready">
    <div class="o-containerMedium o-containerMedium--profile">
      <h1 class="c-page__heading c-h1">My Profile</h1>
      <div class="c-page__headingSmall">
        Customer Information
      </div>
      <div class="c-page__detail">
        <button
          class="c-page__detailEdit u-btnUnset"
          @click="
            UI_SET_SIDEBAR({
              component: 'cSidebarPassword',
              content: sidebarContent.password
            })
          "
        >
          Edit
        </button>
        {{ customer.email }}
        <br />
        ************
      </div>

      <div class="c-page__headingSmall">
        Billing Address
      </div>
      <div class="c-page__detail">
        <!-- c-page__detail--desktop-only -->
        <button
          class="c-page__detailEdit u-btnUnset"
          @click="
            UI_SET_SIDEBAR({
              component: 'cSidebarBilling',
              content: sidebarContent.billing
            })
          "
        >
          Edit
        </button>
        <div v-if="billingAddress">
          {{ customer.firstName }} {{ customer.lastName }}
          <div v-if="billingAddress.address1">
            {{ billingAddress.address1 }}
          </div>
          <div v-if="billingAddress.address2">
            {{ billingAddress.address2 }}
          </div>
          {{ billingAddress.city }}, {{ billingAddress.province }} {{ billingAddress.zip }}
        </div>
      </div>

      <div class="c-page__headingSmall">
        Shipping Address
      </div>
      <div class="c-page__detail">
        <!-- c-page__detail--desktop-only -->
        <button
          class="c-page__detailEdit u-btnUnset"
          @click="
            UI_SET_SIDEBAR({
              component: 'cSidebarShipping',
              content: sidebarContent.shipping,
              settings: { addressId: shippingAddress.id }
            })
          "
        >
          Edit
        </button>
        <div v-if="shippingAddress">
          {{ shippingAddress.firstName }} {{ shippingAddress.lastName }}
          <div>
            {{ shippingAddress.address1 }}
          </div>
          <div v-if="shippingAddress.address2">
            {{ shippingAddress.address2 }}
          </div>
          {{ shippingAddress.city }}, {{ shippingAddress.province }} {{ shippingAddress.zip }}
        </div>
      </div>
      <div class="c-page__headingSmall">
        Payment Method
      </div>
      <div class="c-page__detail">
        <button
          class="c-page__detailEdit u-btnUnset"
          @click="
            UI_SET_SIDEBAR({
              component: 'cSidebarPayment',
              content: sidebarContent.payment
            })
          "
        >
          Edit
        </button>
        **** ****** *****
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from 'vuex'
import { _sortItemsByCharge } from '@vue/portal/utils'

export default {
  data() {
    return {
      ready: null
    }
  },
  computed: {
    ...mapGetters('customer', ['customerRecharge', 'customerShopify', 'customerAddressesWithStatus']),
    customer() {
      return {
        firstName: this.customerRecharge ? this.customerRecharge.firstName : this.customerShopify.firstName,
        lastName: this.customerRecharge ? this.customerRecharge.lastName : this.customerShopify.lastName,
        email: this.customerRecharge ? this.customerRecharge.email : this.customerShopify.email
      }
    },
    billingAddress() {
      if (!this.customerRecharge) {
        return this.customerShopify.defaultAddress
      } else {
        return this.customerRecharge.billingAddress
      }
    },
    sidebarContent() {
      const billing = this.$store.getters['customize/customizeSidebarByPrefix']('billing_')
      const shipping = this.$store.getters['customize/customizeSidebarByPrefix']('shipping_')
      const password = this.$store.getters['customize/customizeSidebarByPrefix']('password_')
      const payment = this.$store.getters['customize/customizeSidebarByPrefix']('payment_')
      const retention = this.$store.getters['customize/customizeSidebarByPrefix']('retention_')
      const activate = this.$store.getters['customize/customizeSidebarByPrefix']('activate_')
      return { billing, shipping, password, payment, retention, activate }
    },
    shippingAddress() {
      if (!this.customerRecharge) {
        return this.customerShopify.defaultAddress
      } else {
        return this.customerAddressesWithStatus?.active[0] || this.customerAddressesWithStatus?.empty[0]
      }
    }
  },
  async mounted() {
    const fromPaymentUpdate = sessionStorage.getItem('from_update_payment') === 'true' ? true : false
    if (fromPaymentUpdate) {
      this.UI_SET_SIDEBAR({
        component: 'cSidebarPayment',
        content: this.sidebarContent.payment
      })
      sessionStorage.removeItem('from_update_payment')
    }
  },
  async created() {
    if (this.customerRecharge) {
      const { success, error } = await this.customerSetResources({
        resources: ['addresses', 'charges', 'onetimes', 'subscriptions']
      })
      if (error) this.error = error
      this.ready = true
    } else this.ready = true
  },
  methods: {
    ...mapActions('customer', ['customerSetResources']),
    ...mapMutations('ui', ['UI_SET_SIDEBAR'])
  }
}
</script>

<style lang="scss">
.o-containerMedium--profile {
  @include media-tablet-down {
    padding-left: 25px;
    padding-right: 25px;
  }
}
.c-page {
  padding: 30px 0;
  @include media-desktop-up {
    padding: 55px 0;
  }
}
.c-page__heading {
  font-size: 24px;
  margin-bottom: 30px;
  @include media-desktop-up {
    font-size: 32px;
  }
}
.c-page__headingSmall {
  font-size: 14px;
  font-weight: 600;
  color: $color-off-black;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  margin-bottom: 16px;
}
.c-page__detail {
  display: flex;
  flex-direction: row-reverse;
  align-items: center;
  justify-content: space-between;
  position: relative;
  font-size: 16px;
  border: 1px solid $color-paleo;
  border-radius: 12px;
  background-color: $color-ecru;
  line-height: 1.5;
  margin-bottom: 25px;
  padding: 40px 20px;

  @include media-desktop-up {
    padding: 34px;
  }

  &--desktop-only {
    display: none;
    @include media-desktop-up {
      display: flex;
    }
  }

  &--mobile-only {
    display: flex;
    flex-direction: row;
    @include media-desktop-up {
      display: none;
    }
  }
}
.c-page__detailEdit {
  color: $color-broccoli;
  font-size: 13px;
  font-weight: 600;
  text-decoration: underline;
  text-transform: uppercase;
}
</style>
