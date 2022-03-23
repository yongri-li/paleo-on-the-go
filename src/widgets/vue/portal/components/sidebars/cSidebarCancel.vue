<template>
  <div :class="_buildModifiers('c-sidebarCancel', modifiers)" v-if="content && address">
    <div class="c-sidebarCancel__items">
      <!--       <c-sidebarCancelItem
        class="c-sidebarCancel__item"
        v-for="(item, index) in items"
        :key="`${item.id}-${index}`"
        :item="item"
      /> -->
      <c-orders-item
        v-for="(item, index) in items"
        :item="item"
        :content="content"
        :key="`${item.id}-${index}`"
      />
    </div>

    <c-h
      class="c-cancelRadios__delayHeading u-marginTop--lg"
      v-if="content.cancel_heading"
      tag="h5"
      level="5"
      :text="content.cancel_heading"
    />

    <c-cancelRadios
      class="c-sidebarCancel__radios"
      v-model="cancelModel"
      :loading="loading"
      @delay="handleDelay"
      :content="{
        reason_1: content.cancel_reason_1,
        reason_2: content.cancel_reason_2,
        reason_3: content.cancel_reason_3,
        reason_4: content.cancel_reason_4,
        reason_5: content.cancel_reason_5,
        reason_other: content.cancel_reason_other,
        delay_heading: content.cancel_delay_heading,
        delay_button: content.cancel_delay_button
      }"
    />
    <c-button
      class="c-sidebarCancel__cancelButton"
      v-if="content.cancel_submit_button"
      @click="handleCancel"
      :loading="loading.cancel"
      :text="content.cancel_submit_button"
      :modifiers="['isDefault', 'isPrimary', 'hideTextLoading']"
      :attributes="{ disabled: !cancelModel || loading.cancel || loading.delay }"
    />
  </div>
</template>

<script>
import { mapMutations, mapActions } from 'vuex'
import { _sortItemsByCharge, _buildUpdates } from '@vue/portal/utils'
import cP from '@shared/components/core/cP.vue'
import cH from '@shared/components/core/cH.vue'
import cButton from '@shared/components/core/cButton.vue'
import cSidebarCancelItem from './cSidebarCancelItem.vue'
import cCancelRadios from '../parts/cCancelRadios.vue'
import cOrdersItem from '../orders/cOrdersItem.vue'

export default {
  props: {
    content: {
      type: Object,
      required: true
    },
    address: {
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
    cSidebarCancelItem,
    cCancelRadios,
    cOrdersItem
  },
  data: () => ({
    cancelModel: false,
    loading: { delay: false, cancel: false }
  }),
  computed: {
    subscriptions() {
      return this.$store.getters['customer/customerSubscriptionsByAddress'](this.address)
    },
    subscriptionIds() {
      return this.subscriptions.map(subscription => subscription.id)
    },
    onetimes() {
      return this.$store.getters['customer/customerOnetimesByAddress'](this.address)
    },
    onetimeIds() {
      return this.onetimes.map(onetime => onetime.id)
    },
    items() {
      return _sortItemsByCharge({ items: [...this.subscriptions, ...this.onetimes], order: 'ascending' })
    }
  },
  methods: {
    ...mapMutations('ui', ['UI_CLOSE_SIDEBAR']),
    ...mapActions('customer', ['customerUpdateAddressItems']),
    async handleDelay() {
      this.loading.delay = true
      await this.customerUpdateAddressItems({
        addressId: this.address.id,
        updatesOnetimes: _buildUpdates({
          items: this.onetimes,
          action: 'delay',
          values: { frequency: 1, unit: 'month' }
        }),
        updatesSubscriptions: _buildUpdates({
          items: this.subscriptions,
          action: 'delay',
          values: { frequency: 1, unit: 'month' }
        })
      })
      this.loading.delay = false
      this.UI_CLOSE_SIDEBAR()
    },
    async handleCancel() {
      this.loading.cancel = true
      await this.customerUpdateAddressItems({
        addressId: this.address.id,
        updatesOnetimes: _buildUpdates({
          items: this.onetimes,
          actions: ['cancel'],
          values: { reason: this.cancelModel }
        }),
        updatesSubscriptions: _buildUpdates({
          items: this.subscriptions,
          actions: ['cancel'],
          values: { reason: this.cancelModel }
        })
      })
      this.loading.cancel = false
      this.UI_CLOSE_SIDEBAR()
    }
  }
}
</script>

<style lang="scss">
.c-sidebarCancel {
  .c-h5 {
    font-size: 1.5rem;
  }
}

.c-sidebarCancel__address {
  margin-top: -10px;
  font-weight: 700;
}
.c-sidebarCancel__items {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  grid-gap: 2.5rem;
  padding: 2rem 0 1rem;
  border-top: 2px solid $color-ecru;
  border-bottom: 2px solid $color-ecru;
}
.c-sidebarCancel__cancelButton {
  width: 100%;
  margin-top: 2rem;
}

.c-details__box--isCancelSubs {
  .withAccordion .c-accordionItem__trigger--isOpen .c-details__boxButton section {
    opacity: 1 !important;
  }

  .withAccordion .c-accordionItem__trigger--isOpen + .c-accordionItem__content {
    margin-top: 1.5rem !important;
  }

  .c-details__editTrigger::after {
    content: 'Cancel Plan';
  }

  .c-details__boxButton {
    @include media-tablet-up {
      section {
        flex: 1;
      }
    }
  }

  @include media-mobile-down {
    .c-accordion {
      max-width: calc(100vw - 4.5rem);
    }

    .c-sidebarCancel__items {
      grid-template-columns: repeat(2, 1fr);
      grid-gap: 1.5rem;
      padding: 1.5rem 0.75rem;
    }
  }
}

/* for TESTING only!!!! */
/*.c-details__box--isCancelSubs .c-accordionItem.c-accordionItem--hasTransition {
  min-height: 800px;
}*/
</style>
