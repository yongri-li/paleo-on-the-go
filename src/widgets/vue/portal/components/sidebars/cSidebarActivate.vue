<template>
  <div :class="_buildModifiers('c-sidebarCancel', modifiers)" v-if="content && address">
    <section class="c-sidebarCancel__wrapper">
      <h6 class="c-h6">
        {{ totalSubItems }} Meals &nbsp;<span class="c-basicTxt--md">
          Delivers Every {{ frequency }} Week</span
        >
      </h6>
      <div class="c-sidebarCancel__items">
        <c-orders-item
          v-for="(item, index) in subItems"
          :item="item"
          :content="content"
          :key="`${item.id}-${index}`"
        />
      </div>
    </section>
    <c-button
      class="c-sidebarCancel__cancelButton"
      v-if="content.cancel_submit_button"
      @click="handleActivate"
      :loading="loading.activate"
      text="Reactivate Subscription"
      :modifiers="['isDefault', 'isPrimary', 'hideTextLoading']"
      :attributes="{ disabled: loading.activate }"
    />
    <!-- :text="content.cancel_submit_button" -->
    <c-button
      class="u-marginTop--sm"
      text="Nevermind"
      :modifiers="['isUnderline', 'isBlack']"
      @click="$parent.$emit('closeThisAcc', boxNum)"
    />
  </div>
</template>

<script>
import { mapMutations, mapActions } from 'vuex'
import { _sortItemsByCharge, _buildUpdates } from '@vue/portal/utils'
import cP from '@shared/components/core/cP.vue'
import cButton from '@shared/components/core/cButton.vue'
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
    },
    boxNum: {
      type: Number
    }
  },
  components: {
    cP,
    cButton,
    cOrdersItem
  },
  data: () => ({
    loading: { delay: false, activate: false }
  }),
  computed: {
    subscriptions() {
      return this.$store.getters['customer/customerSubscriptionsByAddress'](this.address)
    },
    subItems() {
      return _sortItemsByCharge({ items: [...this.subscriptions], order: 'ascending' })
    },
    totalSubItems() {
      return this.subscriptions?.reduce((sum, sub) => sum + sub.quantity, 0)
    },
    frequency() {
      const freqObj = this.subscriptions?.find(sub => sub.frequency)
      return freqObj.frequency
    },
    disclaimers() {
      const { activate_disclaimer } = this.content
      if (activate_disclaimer) return this._buildTextArray(activate_disclaimer)
      else return []
    }
  },
  methods: {
    ...mapActions('customer', ['customerUpdateAddressItems']),
    async handleActivate() {
      this.loading = true
      await this.customerUpdateAddressItems({
        addressId: this.settings.address.id,
        updatesSubscriptions: _buildUpdates({
          items: this.subscriptions,
          actions: ['activate']
        })
      })
      this.loading = false
    }
  }
}
</script>

<style lang="scss">
.c-sidebarCancel {
  .c-h5 {
    font-size: 1.5rem;
  }

  &__wrapper {
    border-top: 2px solid #efede6;
    border-bottom: 2px solid #efede6;
    padding-top: 2rem;
  }

  &__address {
    margin-top: -10px;
    font-weight: 700;
  }

  &__items {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    grid-gap: 2.5rem;
    padding: 2rem 0;
  }

  &__cancelButton {
    width: 100%;
    margin-top: 2rem;
  }

  .c-sidebarCancel__cancelButton + button {
    height: 1.75rem;
  }
}

.c-details__box--isCancelSubs {
  .withAccordion .c-accordionItem__trigger--isOpen .c-details__boxButton section {
    opacity: 1 !important;
  }

  .withAccordion .c-accordionItem__trigger--isOpen + .c-accordionItem__content {
    margin-top: 1.5rem !important;
    /*    max-height: fit-content !important;*/
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
</style>
