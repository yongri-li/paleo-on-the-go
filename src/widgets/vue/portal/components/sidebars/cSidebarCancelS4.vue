<template>
  <div :class="_buildModifiers('c-sidebarCancel', modifiers)" v-if="content && address">
    <c-h class="c-sidebar__heading" tag="h1" level="1" :text="content.cancel_heading" />

    <c-p
      class="c-sidebarCancel__address"
      tag="address"
      level="1"
      v-html="
        _buildAddress({
          address: address,
          options: {
            hiddenFields: ['name', 'country', 'company'],
            provinceName: 'short',
            flatten: true
          }
        })
      "
    />
    <c-h
      class="c-sidebarCancel__meal-plan-heading"
      tag="h4"
      level="4"
      :text="content.cancel_meal_plan_heading_s4"
    />

    <div class="c-sidebarCancel__meal-plans">
      <c-orders-item
        v-for="(subscription, index) in subscriptions"
        :key="`${subscription.id}-${index}`"
        :content="subscription"
        :item="subscription"
      />
    </div>

    <hr class="c-sidebarCancel__hr" />

    <c-p
      class="c-sidebarCancel__terms-heading"
      tag="p"
      level="1"
      v-html="content.cancel_terms_heading_s4"
    />

    <div class="c-sidebarCancel__terms-wrapper">
      <input v-model="isChecked" type="checkbox" id="terms" class="checkbox" />
      <label for="terms" class="checkbox-label">
        {{ content.cancel_terms }}
        <span class="checkbox-icon" v-html="iconCheck" />
      </label>
    </div>

    <div class="c-sidebarCancel__btn-wrapper">
      <c-button
        :loading="loading"
        :success="status === 'success'"
        :text="content.cancel_submit_button_s4"
        :attributes="{ disabled: !isChecked }"
        :modifiers="['isDefault', 'isSecondary', 'hideTextLoading']"
        @click="handleSubmit"
      />
      <button class="c-sidebarCancel__nevermind" @click="UI_CLOSE_SIDEBAR">
        {{ content.cancel_nevermind_button_s4 }}
      </button>
    </div>
  </div>
</template>

<script>
import { mapActions, mapMutations, mapState, mapGetters } from 'vuex'
import { _buildUpdates } from '@vue/portal/utils'
import cP from '@shared/components/core/cP.vue'
import cH from '@shared/components/core/cH.vue'
import cButton from '@shared/components/core/cButton.vue'
import cOrdersItem from '../orders/cOrdersItem.vue'
import { format } from 'date-fns'
import { apiService } from '@shared/services'

export default {
  components: {
    cP,
    cH,
    cButton,
    cOrdersItem
  },
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
  data: () => ({
    status: false,
    loading: false,
    isChecked: false,
    dfMenuSubs: [],
    oldOnetimes: [],
    iconCheck: `<svg width="11" height="8" viewBox="0 0 11 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4.23077 8L0 3.7608L1.18377 2.6172L4.20835 5.6064L9.76927 0L11 1.1224L4.23077 8Z" fill="white"/>
                </svg>`
  }),
  computed: {
    ...mapState('products', ['defaultMenu', 'defaultMenuItems']),
    ...mapGetters('products', ['allProducts']),
    ...mapGetters('customer', ['customerUpcomingCharges']),
    subscriptions() {
      return this.$store.getters['customer/customerSubscriptionsByAddress'](
        this.settings.addressId
      )
    },
    subscriptionIds() {
      return this.subscriptions.map((subscription) => subscription.id)
    },
    onetimes() {
      return this.$store.state.customer.resources.onetimes
    },
    address() {
      return this.$store.getters['customer/customerAddressById'](this.settings.addressId)
    },
    nextUpcomingCharge() {
      return this.customerUpcomingCharges.filter((chrg) => chrg.status !== 'REFUNDED')
    },
    dfMenuSubscriptionUpdates() {
      return this.defaultMenuItems.map((child) => {
        return {
          shopify_variant_id: child.upsellId || child.variants[0].id,
          quantity: child.quantity,
          price: (child.variants[0].price / 100).toFixed(2),
          hash: child.price_hashes[0],
          tags: child.tags,
          product_type: child.type,
          charge_interval_frequency: 1,
          order_interval_frequency: 1,
          order_interval_unit: 'week',
          upsell_id: child.upsellId ? child.upsellId : null,
          upsell_price: child.upsellId
            ? (child.variants[1].price / 100).toFixed(2)
            : null,
          next_charge_scheduled_at: format(
            this.nextUpcomingCharge[0].scheduled_at,
            'YYYY-MM-DD'
          )
        }
      })
    }
  },
  methods: {
    ...mapActions('customer', [
      'customerUpdateAddressItems',
      'customerUpdatePlanToDFMenu'
    ]),
    ...mapMutations('ui', ['UI_SET_SIDEBAR', 'UI_CLOSE_SIDEBAR']),
    ...mapActions('bundle', ['customerUpdatePlan', 'customerDeleteOnetimes']),
    productImage(pid) {
      return this.$store.getters['products/productById'](pid)?.images[0]
    },
    async handleSubmit() {
      try {
        this.loading = true

        const update = await this.customerUpdatePlanToDFMenu({
          addressId: this.address.id,
          updates: [...this.dfMenuSubscriptionUpdates],
          deletes: [...this.subscriptionIds]
        })

        if (update) {
          await this.getSubz()
          setTimeout(async () => {
            this.cancelSubscriptions()
          }, 250)
        }
      } catch (error) {
        console.error(error)
      }
    },
    async getSubz() {
      const apiClient = new apiService()
      const { data } = await apiClient.get(
        '/v1/customer/resources?resources=onetimes,subscriptions'
      )
      this.dfMenuSubs = data.resources.subscriptions
      this.oldOnetimes = data.resources.onetimes
      console.log('subsdata', this.dfMenuSubs, 'onetimes:', this.oldOnetimes)
    },
    async cancelSubscriptions() {
      await this.customerUpdateAddressItems({
        addressId: this.address.id,
        updatesOnetimes: _buildUpdates({
          items: this.oldOnetimes,
          actions: ['cancel'],
          values: {
            reason1: this.settings.cancelReason1,
            reason2: this.settings.cancelReason2
          }
        }),
        updatesSubscriptions: _buildUpdates({
          items: this.dfMenuSubs,
          actions: ['cancel'],
          values: {
            reason1: this.settings.cancelReason1,
            reason2: this.settings.cancelReason2
          }
        })
      })

      this.loading = false
      await this.$router.push({ path: '/shipments' })
    }
  }
}
</script>

<style lang="scss" scoped>
.c-sidebarCancel__meal-plan-heading {
  font-size: 16px;
  font-weight: 700;
  letter-spacing: -0.02em;
  margin-top: 30px;
  margin-bottom: 18px;
}

.c-sidebarCancel__meal-plans {
  margin-bottom: 25px;
}

.c-sidebarCancel__meal-plan {
  background-color: $color-ecru;
  border: 1px solid $color-paleo;
  border-radius: 5px;
  padding: 10px 34px 10px 14px;
  max-width: 338px;

  &:not(:last-child) {
    margin-bottom: 20px;
  }
}

.c-sidebarCancel__meal-row {
  display: flex;
  margin-left: -8px;
  margin-right: -8px;
}

.c-sidebarCancel__meal-col {
  padding-left: 8px;
  padding-right: 8px;
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;

  &--flex {
    flex: 1;
  }
}

.c-sidebarCancel__meal-image {
  display: block;
  width: 100%;
  max-width: 80px;
}

.c-sidebarCancel__meal-variant {
  margin-bottom: 0;
  color: $color-broccoli;
  text-transform: uppercase;
  font-weight: 800;
  font-size: 10px;
  letter-spacing: 0.05em;
  font-family: $font-body;
}

.c-sidebarCancel__meal-title {
  color: $color-off-black;
  font-weight: 700;
  font-size: 14px;
  margin-bottom: 0;
  font-family: $font-heading;
  line-height: 1.4;
}

.c-sidebarCancel__meal-quantity {
  width: 35px;
  height: 35px;
  line-height: 38px;
  border-radius: 50%;
  font-size: 16px;
  font-weight: 700;
  font-family: $font-body;
  text-align: center;
  color: $color-smooth-white;
  background-color: $color-broccoli;
  margin-bottom: 0;
}

.c-sidebarCancel__hr {
  margin-top: 24px;
  margin-bottom: 24px;
  border: 0;
  border-top: 1px solid $color-paleo;
}

.c-sidebarCancel__terms-heading {
  font-weight: 600;
  font-size: 20px;
}

.c-sidebarCancel__terms-wrapper {
  padding: 18px 20px;
  background-color: $color-ecru;
  border: 1px solid $color-paleo;
  border-radius: 12px;
  margin-bottom: 24px;
}

.c-sidebarCancel__btn-wrapper {
  text-align: center;

  button:first-child {
    width: 100%;
  }
}

.c-sidebarCancel__nevermind {
  font-size: 13px;
  font-weight: 800;
  text-transform: uppercase;
  color: $color-broccoli;
  margin-top: 18px;
  border: 0;
  padding: 0;
  border-bottom: 1px solid $color-broccoli;
  outline: 0;
  background: none;
  cursor: pointer;
}

.checkbox:not(:checked),
.checkbox:checked {
  position: absolute;
  left: 0;
  opacity: 0;
}

.checkbox-label {
  display: block;
  position: relative;
  padding-left: 36px;
  cursor: pointer;
  font-size: 16px;
  letter-spacing: 0.01em;
  line-height: 1.2;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 18px;
    height: 18px;
    border-radius: 4px;
    border: 1px solid $color-paleo;
    background-color: $color-white;
    transition: all 0.2s;
  }
}

.checkbox-icon {
  display: block;
  position: absolute;
  top: 5px;
  left: 3px;
  transition: all 0.2s;
  line-height: 0;
}

.checkbox:checked + .checkbox-label::before {
  background-color: $color-broccoli;
  border-color: $color-broccoli;
}

.checkbox:not(:checked) + .checkbox-label .checkbox-icon {
  opacity: 0;
  transform: scale(0);
}

.checkbox:checked + .checkbox-label .checkbox-icon {
  opacity: 1;
  transform: scale(1);
}
</style>
