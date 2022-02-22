<template>
  <div :class="_buildModifiers('c-sidebarActivate', modifiers)"
    v-if="content && settings.address"
  >
    <c-p class="c-sidebarActivate__address"
      tag="address"
      level="1"
      v-html="_buildAddress({
        address: settings.address,
        options: {
          hiddenFields: ['name', 'country'],
          provinceName: 'short',
          flatten: true
        }
      })"
    />
    <div class="c-sidebarActivate__items">
      <c-sidebarActivateItem class="c-sidebarActivate__item"
        v-for="(item, index) in items" 
        :key="`${item.id}-${index}`"
        :item="item"
        :activeIds="activateModel"
        :content="{ ships: content.activate_ships }"
        @update="handleUpdate"
      />
      <div class="c-sidebarActivate__total"
        v-if="content.activate_total && total"
      >
        <span class="c-sidebarActivate__totalLabel"
          v-html="content.activate_total"
        />
        <span class="c-sidebarActivate__totalValue"
          v-html="total"
        />
      </div>
      <c-button class="c-sidebarActivate__button"
        v-if="content.activate_button"
        @click="handleActivate"
        :loading="loading"
        :text="content.activate_button"
        :modifiers="['isDefault', 'isSecondary', 'hideTextLoading']"
        :attributes="{ disabled: !activateModel.length > 0 || loading }"
      />
      <div class="c-sidebarActivate__disclaimers"
        v-if="content.activate_disclaimer"
      >
        <c-p class="c-sidebarActivate__disclaimer"
          v-for="(disclaimer, index) in _buildTextArray(content.activate_disclaimer)"
          :key="`disclaimer-${index}`"
          tag="p"
          level="3"
          :text="disclaimer"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapActions } from 'vuex'
import { _sortItemsByCharge, _buildUpdates } from '@vue/portal/utils'
import cP from '@shared/components/core/cP.vue'
import cButton from '@shared/components/core/cButton.vue'
import cSidebarActivateItem from './cSidebarActivateItem.vue'

export default {
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
      default: () => ([])
    }
  },
  components: { 
    cP, cButton,
    cSidebarActivateItem
  },
  data: () => ({ 
    activateModel: [],
    loading: false
  }),
  computed: {
    subscriptions() {
      return this.$store.getters['customer/customerSubscriptionsByAddress'](this.settings.address)
    },
    subscriptionIds() {
      return this.subscriptions.map(subscription => subscription.id)
    },
    items() {
      return _sortItemsByCharge(
        { items: this.subscriptions, order: 'ascending' }
      )
    },
    currencySymbol() {
      return this.$store.getters['customize/customizeShopByKey']('currency_symbol')
    },
    total() {
      let total = 0
      const checkedSubscriptions = this.subscriptions.filter(subscription => {
        return this.activateModel.includes(subscription.id)
      })
      checkedSubscriptions.forEach(subscription => total += subscription.total)
      return `${this.currencySymbol}${this._formatMoney({ amount: total })}`
    },
    disclaimers() {
      const { activate_disclaimer } = this.content
      if(activate_disclaimer) return this._buildTextArray(activate_disclaimer)
      else return []
    }
  },
  methods: {
    ...mapMutations('ui', ['UI_CLOSE_SIDEBAR']),
    ...mapActions('customer', ['customerUpdateAddressItems']),
    handleUpdate(val) {
      const { id, action } = val
      this.activateModel = this.activateModel.filter(item => item.id == id)
      if(action === 'add') this.activateModel = [ ...this.activateModel, id]
    },
    async handleActivate() {
      this.loading = true
      await this.customerUpdateAddressItems({ 
        addressId: this.settings.address.id,
         updatesSubscriptions: _buildUpdates({
          items: this.subscriptions, action: 'activate', values: { reason: this.cancelModel }
        })
      })
      this.loading = false
      this.UI_CLOSE_SIDEBAR()
    }
  },
  mounted() {
    this.activateModel = this.subscriptionIds
  }
}
</script>

<style lang="scss">
  .c-sidebarActivate__address {
    margin-top: -10px;
    font-weight: 700;
  }
  .c-sidebarActivate__items {
    margin-bottom: 40px;
  }
  .c-sidebarActivate__total {
    width: 100%;
    max-width: 320px;
    margin-top: 30px;
    @include flex($justify: space-between);
  }
  .c-sidebarActivate__totalLabel {
    @include text-heading;
    font-size: 20px;
  }
  .c-sidebarActivate__totalValue {
    @include text-body;
    font-size: 20px;
  }
  .c-sidebarActivate__button {
    width: 100%;
    max-width: 320px;
    margin-top: 30px;
  }
  .c-sidebarActivate__disclaimers {
    max-width: 420px;
    margin-top: 40px;
  }
</style>