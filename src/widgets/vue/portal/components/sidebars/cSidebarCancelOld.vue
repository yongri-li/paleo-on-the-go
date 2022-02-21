<template>
  <div :class="_buildModifiers('c-sidebarCancel', modifiers)"
    v-if="content && address"
  >
    <c-p class="c-sidebarCancel__address"
      tag="address"
      level="1"
      v-html="_buildAddress({
        address: address,
        options: {
          hiddenFields: ['name', 'country', 'company'],
          provinceName: 'short',
          flatten: true
        }
      })"
    />

    <!-- <div class="c-sidebarCancel__items"> -->
      <!-- v-if="item['status'] !== 'CANCELLED'" -->
<!--       <c-sidebarCancelItem class="c-sidebarCancel__item"
        v-for="(item, index) in items"
        :key="`${item.id}-${index}`"
        :item="item"
      />
    </div> -->

      <h4 class="c-ordersAccordion__heading c-h4">Your Meals</h4>
      <div class="c-itemsBox__flex">
<!--      v-for="item in getSubscriptionItems(shipment.lineItems)"
          :item="item"
          :key="item.id" -->
        <c-orders-item
          v-for="(item, index) in items"
          :key="`${item.id}-${index}`"
          :item="item"
        />
      </div>



    <section v-if="anyActiveSubs">
      <c-cancelRadios class="c-sidebarCancel__radios"
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
      <c-button class="c-sidebarCancel__cancelButton c-button--isDefault c-button--isSecondary"
        v-if="content.cancel_submit_button"
        @click="handleCancel"
        :loading="loading.cancel"
        :text="content.cancel_submit_button"
        :modifiers="['hideTextLoading']"
        :attributes="{ disabled: !cancelModel || loading.cancel || loading.delay }"
      />
    </section>

    <section v-if="!anyActiveSubs">
      <!-- v-if="content.activate_button" -->
      <!-- :text="content.activate_button" -->
      <!-- :attributes="{ disabled: !activateModel.length > 0 || loading }" -->
      <!-- :attributes="{ disabled: !cancelModel || loading.activate || loading.delay }"       -->
      <c-button class="c-sidebarActivate__button"
        @click="handleActivate"
        :loading="loading.activate"
        text="Reactivate"
        :modifiers="['isDefault', 'isSecondary']"
      />  <!-- 'hideTextLoading' -->
      <div class="c-sidebarActivate__disclaimers"
        v-if="content.activate_disclaimer"
      >
        <!-- v-for="(disclaimer, index) in _buildTextArray(content.activate_disclaimer)"
          :key="`disclaimer-${index}`" -->
        <!-- :text="disclaimer" -->
        <c-p class="c-sidebarActivate__disclaimer"
          tag="p"
          level="3"
        />
      </div>
    </section>
  </div>
</template>

<script>
import { mapMutations, mapActions } from 'vuex'
import { _sortItemsByCharge, _buildUpdates } from '@vue/portal/utils'
import cP from '@shared/components/core/cP.vue'
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
    cSidebarCancelItem, cCancelRadios,
    cOrdersItem
  },
  data: () => ({
    cancelModel: false,
    anyActiveSubs: false,
    loading: { delay: false, cancel: false, activate: false }
  }),
  computed: {
    subscriptions() {
      return this.$store.getters['customer/customerSubscriptionsByAddress'](this.settings.addressId)
    },
    subscriptionIds() {
      return this.subscriptions.map(subscription => subscription.id)
    },
    onetimes() {
      return this.$store.getters['customer/customerOnetimesByAddress'](this.settings.addressId)
    },
    onetimeIds() {
      return this.onetimes.map(onetime => onetime.id)
    },
    items() {
      return _sortItemsByCharge(
        { items: [ ...this.subscriptions, ...this.onetimes ], order: 'ascending' }
      )
    },
    address() {
      return this.$store.getters['customer/customerAddressById'](this.settings.addressId)
    },
    // anyActiveSubscriptions() {
    //   // return this.items.map((itm, i) => {
    //   //   if (Object.values(itm).includes('CANCELLED') && i < 1) {
    //   //     // console.log('asd', true, i)
    //   //     // console.log(itm)
    //   //     // //this.anyActiveSubs = true;
    //   //     return true;
    //   //   }
    //   // })
    //   return function checkArr(subscriptions) {
    //     for (let i of subscriptions) {
    //       if (Object.values(itm).includes('CANCELLED') && i < 1) {
    //         // console.log('asd', true, i)
    //         // console.log(itm)
    //         // //this.anyActiveSubs = true;
    //         return true;
    //       }
    //     }
    //   }
    // }
  },
  methods: {
    ...mapMutations('ui', ['UI_CLOSE_SIDEBAR']),
    ...mapActions('customer', ['customerUpdateAddressItems']),
    async handleDelay() {
      this.loading.delay = true
      await this.customerUpdateAddressItems({
        addressId: this.settings.addressId,
        updatesOnetimes: _buildUpdates({
          items: this.onetimes, action: 'delay', values: { frequency: 1, unit: 'month'}
        }),
         updatesSubscriptions: _buildUpdates({
          items: this.subscriptions, action: 'delay', values: { frequency: 1, unit: 'month'}
        })
      })
      this.loading.delay = false
      this.UI_CLOSE_SIDEBAR()
    },
    async handleCancel() {
      this.loading.cancel = true
      await this.customerUpdateAddressItems({
        addressId: this.settings.addressId,
        updatesOnetimes: _buildUpdates({
          items: this.onetimes, actions: ['cancel'], values: { reason: this.cancelModel }
        }),
         updatesSubscriptions: _buildUpdates({
          items: this.subscriptions, actions: ['cancel'], values: { reason: this.cancelModel }
        })
      })
      this.loading.cancel = false

      this.UI_CLOSE_SIDEBAR()
    },
    async handleActivate() {
      this.loading.activate = true

      ///////
      await this.customerUpdateAddressItems({
         addressId: this.settings.addressId,
         updatesSubscriptions: _buildUpdates({
          items: this.subscriptions, actions: ['activate'], values: { reason: 'reactivated' }
        })
      })

      ////
      // this.loading.activate = true
      // const { subscriptions, onetimes, error, success } = await this.customerUpdateAddressItems({
      //   addressId: this.settings.addressId,
      //    updatesSubscriptions: _buildUpdates({
      //     items: this.activateItems, actions: ['activate']
      //   })
      // })
      // this.loading.activate = false
      // this.UI_CLOSE_SIDEBAR()
      ////

      this.loading.activate = false
      this.UI_CLOSE_SIDEBAR()
    },
    anyActiveSubscriptions() {
      this.items.map((itm, i) => {
        if (Object.values(itm).includes('ACTIVE') && i < 1) {
          this.anyActiveSubs = true;
          return;
        }
      });
    }
  },
  mounted() {
    this.anyActiveSubscriptions();
  }
}
</script>

<style lang="scss" scoped>
  .c-sidebarCancel {
    @include media-tablet-up {
      margin-top: -1.5rem;
    }
  }

  .c-sidebarCancel__address {
    font-size: 18px;
    font-weight: 500;
  }
  .c-sidebarCancel__items {
    margin-bottom: 20px;
  }
  .c-sidebarCancel__cancelButton {
    margin-top: 30px;
  }

  .c-sidebarActivate__button .c-loading__wheel {
    width: 21px;
    height: 21px;
  }

  .c-itemsBox__flex {
    display: flex;
    flex-direction: column;
    gap: 20px;
    margin-bottom: 2rem;

    .c-lineItem {
      max-width: 350px;
      padding: 12px 24px 13px 12px;
    }
  }

</style>
