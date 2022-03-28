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
      :loading="loading.activate"
      text="Reactivate Subscription"
      :modifiers="['isDefault', 'isPrimary', 'hideTextLoading']"
      :attributes="{ disabled: loading.activate }"
    />
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
    loading: { activate: false }
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

<style lang="scss"></style>
