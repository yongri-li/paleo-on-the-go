<template>
  <div :class="_buildModifiers('c-sidebarCancel c-sidebarActivate', modifiers)" v-if="content && address">
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
      @click="handleActivate"
      :loading="loading"
      text="Reactivate Subscription"
      :modifiers="['isDefault', 'isPrimary', 'hideTextLoading']"
      :attributes="{ disabled: loading }"
    />
    <c-button
      class="u-mrgTop--sm"
      text="Nevermind"
      :modifiers="['isUnderline', 'isBlack']"
      @click="$root.$emit('closeAccActivate', [boxNum, boxName])"
    />
    <span class="activate-disclaimer"
      >Your subscription will charge 2 days after you reactivate it – this gives you time to edit your
      subscription, adjust your charge date, or update your frequency if needed.</span
    >
  </div>
</template>

<script>
import { mapMutations, mapActions } from 'vuex'
import { _sortItemsByCharge, _buildUpdates } from '@vue/portal/utils'
import { stillProcessingWarningPopup, removeReloadWarning } from '@shared/utils'
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
    loading: false,
    boxName: 'Reactivate'
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
      stillProcessingWarningPopup()
      await this.customerUpdateAddressItems({
        addressId: this.address.id,
        updatesSubscriptions: _buildUpdates({
          items: this.subscriptions,
          actions: ['activate']
        })
      })
      removeReloadWarning()
      this.loading = false
    }
  }
}
</script>

<style lang="scss">
.c-sidebarActivate {
  position: relative;

  .activate-disclaimer {
    width: clamp(300px, 33vw, 600px);
    position: absolute;
    float: right;
    right: 0;
    bottom: 30px;
    font-size: 1rem;
    line-height: 1.5;
  }
}
</style>
