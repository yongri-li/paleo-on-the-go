<template>
  <section class="o-container">
    <div v-if="!reactivated" class="c-ctaBlock u-textCenter c-shipmentsBox mg-top__md">
      <h2 class="c-ctaBlock__heading c-h2">
         {{ content.no_subs_heading }}
      </h2>
      <p>
        {{ content.no_subs_text }}
      </p>
      <c-button class="c-cta c-ctaBlock__cta c-sidebarActivate__button"
        @click="UI_SET_SIDEBAR({
          component: 'cSidebarActivate',
          content: sidebarContent.cancel,
          settings: {
            address: address,
            addressId: addressID,
            modifiers: ['activate-subscriptions']
          }
        })"
        :loading="loading.activate"
        :text="content.no_subs_cta_text"
      />
    </div>
  </section>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import { _buildUpdates } from '@vue/portal/utils'
import cButton from '@shared/components/core/cButton.vue'

export default {
  props: {
    address: {
      type: Object,
      required: true
    },
    content: {
      type: Object,
      required: true
    },
    addressID: {
      type: String,
      required: true
    }
  },
  data: () => ({
    loading: { cancel: false, activate: false },
    reactivated: false
  }),
  computed: {
    subscriptions() {
     return this.$store.getters['customer/customerSubscriptionsByAddress'](this.addressID)
    },
    sidebarContent() {
      const cancel = this.$store.getters['customize/customizeSidebarByPrefix']('cancel_activate_')
      return { cancel }
    },
    ...mapGetters('customer', [
      'customerShopify',
      'customerRecharge',
      'customerUpcomingCharges'
    ])
  },
  methods: {
    ...mapMutations('ui', ['UI_SET_SIDEBAR']),
    ...mapActions('customer', ['customerSetResources', 'customerUpdateAddressItems']),
    async handleActivate() {
      this.loading.activate = true
      await this.customerUpdateAddressItems({
         addressId: this.addressID,
         updatesSubscriptions: _buildUpdates({
          items: this.subscriptions, actions: ['activate'], values: { reason: 'reactivated' }
        })
      })
      this.loading.activate = false
      this.reactivated = true
    }
  },
  components: {
    cButton
  }
}
</script>

<style lang="scss">
  .o-container {
    .mg-top__md {
      margin-top: 3rem;
    }
  }
  .c-ctaBlock {
    padding: 80px 0;
  }
  .c-ctaBlock__smallHeading {
    text-transform: uppercase;
    font-size: 15px;
    font-weight: 600;
    color: $color-broccoli;
    margin-bottom: 10px;
    @include media-desktop-up {
      margin-bottom: 13px;
    }
  }
  .c-ctaBlock__heading {
    font-size: 26px;
    margin-bottom: 1rem;
    @include media-desktop-up {
      font-size: 34px;
    }
  }
  .c-ctaBlock__cta {
    width: 260px;
    max-width: 100%;
    margin: 1.5rem auto;

    .c-loading__wheel {
      border-style: inset;
    }
  }
</style>