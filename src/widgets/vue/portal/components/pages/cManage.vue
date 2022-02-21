<template>
  <div class="c-page" v-if="ready && !noDFMenuReturnedFromApp">
    <div class="o-containerMedium o-containerMedium--manage">
      <h1 class="c-page__heading c-h1">Manage Subscription</h1>

      <div v-if="hasActiveSubscriptions" class="c-page__headingSmall">
        WEEKLY DELIVERY DAY
      </div>
      <div v-if="hasActiveSubscriptions" class="c-page__detail" :class="pastCutoffEST && 'no__click'">
        <button
          class="c-page__detailEdit u-btnUnset"
          @click="
            UI_SET_SIDEBAR({
              component: 'cSidebarEditSchedule',
              content: sidebarContentEdit.edit,
              settings: { addressId: shippingAddress.id },
              nextscheduledat: nextUpcomingCharge[0].scheduledAt
            })
          "
        >
          Edit
        </button>
        <div>{{ deliverydayy }}</div>
      </div>

      <div class="c-page__headingSmall">
        DIETARY PREFERENCES
      </div>
      <div class="c-page__detail">
        <router-link class="c-page__detailEdit" to="/dietary-preferences">
          Edit
        </router-link>
        Select Likes / Dislikes
      </div>
      <div v-if="hasActiveSubscriptions" class="c-page__headingSmall">
        DEFAULT MENU
      </div>
      <div v-if="hasActiveSubscriptions" class="c-page__detail">
        <!-- :class="pastCutoffEST && 'no__click'" -->
        <button class="c-page__detailEdit u-btnUnset" @click="handleOpenDefaultMenu">
          Edit
        </button>
        Select Weekly Default Menu
      </div>

      <div class="c-page__detailBottom">
        <div class="c-page__headingSmall">
          MANAGE SUBSCRIPTION
        </div>
        <div class="c-page__detail c-page__detail--border">
          <button
            v-if="hasActiveSubscriptions || customerUpcomingCharges.length"
            class="c-page__detailEdit u-btnUnset"
            @click="
              UI_SET_SIDEBAR({
                component: 'cSidebarCancelS1',
                content: sidebarContent.cancel,
                settings: { addressId: shippingAddress.id }
              })
            "
          >
            <!-- <span v-if="customerRecharge.subscriptionsActive.length">Cancel Subscription</span> -->
            <span>Cancel Subscription</span>
          </button>
          <button
            v-else
            class="c-page__detailEdit u-btnUnset"
            @click="
              UI_SET_SIDEBAR({
                component: 'cSidebarActivate',
                content: sidebarContent.cancel,
                settings: {
                  address: shippingAddress,
                  addressId: shippingAddress.id,
                  modifiers: ['activate-subscriptions']
                }
              })
            "
          >
            <!-- <span v-if="customerRecharge.subscriptionsActive.length">Cancel Subscription</span> -->
            <span>Reactivate Subscription</span>
          </button>
          <br />
          <span v-if="hasActiveSubscriptions || customerUpcomingCharges.length">
            Next box ships: {{ nextDeliveryDate }}
          </span>
          <span v-else>
            Subscription is inactive
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions, mapState } from 'vuex'
import { _sortItemsByCharge } from '@vue/portal/utils'
import { convertToYYYYMMDDlocalT } from '@shared/utils'
import cDrawer from '@shared/components/core/cDrawer.vue'
import { format } from 'date-fns'

export default {
  name: 'Manage',
  data() {
    return {
      ready: false,
      defaultMenuOpen: false
    }
  },
  computed: {
    ...mapGetters('customer', [
      'customerRecharge',
      'customerSubscriptions',
      'customerAddressesWithStatus',
      'customerUpcomingCharges'
    ]),
    ...mapState('customer', ['deliveryday', 'deliverydate']),
    ...mapState('ui', ['noDFMenuReturnedFromApp', 'noSkipsReturnedFromApp', 'pastCutoffEST']),
    deliverydayy() {
      return this.deliveryday ? this.deliveryday : localStorage.getItem('selectedDelvDay')
    },
    billingAddress() {
      return this.customerRecharge.billingAddress
    },
    sidebarContent() {
      const cancel = this.$store.getters['customize/customizeSidebarByPrefix']('cancel_')
      return { cancel }
    },
    sidebarContentEdit() {
      const edit = this.$store.getters['customize/customizeSidebarByPrefix']('edit_')
      return { edit }
    },
    subscriptionAddressId() {
      return this.customerSubscriptions[0].addressId
    },
    shippingAddress() {
      return this.customerAddressesWithStatus.active[0] || this.customerAddressesWithStatus.empty[0]
    },
    nextUpcomingCharge() {
      return this.customerUpcomingCharges.filter(chrg => chrg.status !== ('REFUNDED' || 'CANCELLED'))
    },
    delvDateConverted() {
      return this.deliverydate
        ? convertToYYYYMMDDlocalT(this.deliverydate)
        : convertToYYYYMMDDlocalT(this.nextUpcomingCharge[0]?.noteAttributes[1].value)
    },
    nextDeliveryDate() {
      return format(new Date(this.delvDateConverted), 'dddd, MMMM D')
    },
    hasActiveSubscriptions() {
      return this.customerAddressesWithStatus?.active.length ? true : false
    }
  },
  async created() {
    const { success, error } = await this.customerSetResources({
      resources: ['addresses', 'charges', 'onetimes', 'subscriptions']
    })
    this.ready = true
  },
  methods: {
    ...mapActions('customer', ['customerSetResources']),
    ...mapMutations('ui', ['UI_TOGGLE_DEFAULT_MENU', 'UI_SET_SIDEBAR']),
    handleOpenDefaultMenu() {
      return this.UI_TOGGLE_DEFAULT_MENU(true)
    }
  },
  mounted() {
    document.addEventListener('cancelSubscriptions', e => {
      const { existingSubs } = e.detail
      this.hasActiveSubscriptions = existingSubs
    })

    document.addEventListener('reactivateSubscriptions', e => {
      const { existingSubs } = e.detail
      this.hasActiveSubscriptions = existingSubs
    })
  },
  components: {
    cDrawer
  }
}
</script>

<style lang="scss">
.c-page__detailBottom {
  border-top: 1px solid $color-paleo;
  margin-top: 35px;
  padding: 27px 0;

  .c-page__detailEdit {
    white-space: nowrap;
  }
}

.c-page__detailEdit {
  white-space: nowrap;
}

.o-containerMedium {
  @include media-desktop-up {
    width: 100%;
    max-width: 952px;
    margin: 0 auto;
  }

  &--manage {
    @include media-tablet-down {
      padding-left: 25px;
      padding-right: 25px;
    }
  }
}

.no__click {
  opacity: 0.575;
  pointer-events: none;
}
</style>
