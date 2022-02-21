<template>
  <div :class="_buildModifiers('c-sidebarCancel', modifiers)"
    v-if="content && address"
  >
    <c-h class="c-sidebar__heading"
      v-if="filterActiveSubs.length"
      tag="h1"
      level="1"
      text="Cancel Subscription"
    />
    <c-h class="c-sidebar__heading"
      v-if="!filterActiveSubs.length"
      tag="h1"
      level="1"
      text="Reactive Subscription"
    />

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

    <article v-if="filterActiveSubs.length && stepNumber === 1" class="content-block__whtBg cancel__steps">
      <img :src="content.cancel_image1" alt="">
      <h2 class="c-h2 c-h2s">{{content.cancel_heading_s1}}</h2>
      <h3 class="sub-head">{{content.cancel_subheading_s1}}</h3>
      <p>{{content.cancel_text_s1}}</p>
      <button class="c-cta c-cta--inverse" @click="handleOpenDefaultMenu">{{content.cancel_manage_menu_btn1}}</button>
      <button class="c-cta c-button--isDefault" @click="nextStep">{{content.cancel_next_step_btn1}}</button>
    </article>

    <article v-if="filterActiveSubs.length && stepNumber === 2" class="content-block__whtBg cancel__steps">
      <img :src="content.cancel_image2" alt="">
      <h2 class="c-h4">{{content.cancel_heading_s2}}</h2>
      <h3 class="sub-head">{{content.cancel_subheading_s2}}</h3>
      <p>{{content.cancel_text_s2}}</p>
      <button class="c-cta c-cta--inverse">{{content.cancel_manage_menu_btn2}}</button>
      <button class="c-cta c-button--isDefault" @click="nextStep">{{content.cancel_next_step_btn2}}</button>
    </article>


    <section v-if="filterActiveSubs.length && stepNumber === 3">
      <h4 class="c-ordersAccordion__heading c-h4">Your Meals</h4>
      <div class="c-itemsBox__flex">
        <c-orders-item
          v-for="(item, index) in filterActiveSubs"
          :key="`${item.id}-${index}`"
          :item="item"
        />
      </div>
    </section>

    <section v-if="!filterActiveSubs.length">
      <h4 class="c-ordersAccordion__heading c-h4">Your Meals</h4>
      <div class="c-itemsBox__flex">
        <c-orders-item
          v-for="(item, index) in items"
          :key="`${item.id}-${index}`"
          :item="item"
        />
      </div>
    </section>

  <!--  <section v-if="anyActiveSubs">
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
   -->
      <section v-if="filterActiveSubs.length && stepNumber === 3">
        <br/>
        <h4 class="terms-h4">Terms & Agreements</h4>
        <article class="content-block__whtBg">
          <input type="checkbox" id="cancel-terms" name="cancel-terms" @change="checkTerms">
          <label for="cancel-terms">{{content.cancel_activate_disclaimer}}</label>
        </article>

        <c-button class="c-cta c-button--isDefault c-loading--isSecondary c-sidebarCancel__cancelButton"
          ref="btnnn"
          v-if="content.cancel_submit_button"
          @click="handleCancel"
          :loading="loading.cancel"
          :text="content.cancel_submit_button"
          :modifiers="['isDefault', 'isSecondary', 'hideTextLoading']"
          :attributes="{ disabled: !cancelModel || loading.cancel || loading.delay }"
        />
        <a href="#" class="exit-back" @click="exitBack">Nevermind, keep my subscription</a>
      </section>

      <section v-if="!filterActiveSubs.length">
        <c-button class="c-cta c-button--isDefault c-sidebarActivate__button"
          @click="handleActivate"
          :loading="loading.activate"
          :text="content.cancel_activate_button"
          :modifiers="['isDefault', 'isSecondary']"
        />  <!-- 'hideTextLoading' -->
        <div class="c-sidebarActivate__disclaimers"
          v-if="content.cancel_activate_disclaimer"
        >
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
import cOrdersItem from '../orders/cOrdersItem.vue';
import cH from '@shared/components/core/cH.vue'

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
    cP, cH, cButton,
    cSidebarCancelItem, cCancelRadios,
    cOrdersItem
  },
  data: () => ({
    stepNumber: 1,
    cancelModel: false,
    termsCheck: false,
    //  anyActiveSubs: false,
    defaultMenuOpen: false,
    loading: { delay: false, cancel: false, activate: false }
  }),
  computed: {
    subscriptions() {
      return this.$store.getters['customer/customerSubscriptionsByAddress'](this.settings.addressId)
    },
    subscriptionIds() {
      return this.subscriptions.map(subscription => subscription.id)
    },
    onetimez() {
      return this.$store.getters['customer/customerOnetimes']
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
    filterActiveSubs() {
      return this.items.filter(activeItm => activeItm.status.includes('ACTIVE'));
    }
  },
  methods: {
    ...mapMutations('ui', ['UI_TOGGLE_DEFAULT_MENU', 'UI_SET_SIDEBAR', 'UI_CLOSE_SIDEBAR']),
    ...mapActions('customer', ['customerUpdateAddressItems']),
    emitSubscriptionsCanceled(){
      const event = new CustomEvent('cancelSubscriptions', {
        detail: {
          existingSubs: false
        }
      });
      document.dispatchEvent(event);
    },
    emitSubscriptionsReactivate() {
      const event = new CustomEvent('reactivateSubscriptions', {
        detail: {
          existingSubs: true
        }
      });
      document.dispatchEvent(event);
    },
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
            items: this.onetimez, actions: ['cancel'], values: { reason: this.cancelModel }
          }),
         updatesSubscriptions: _buildUpdates({
          items: this.subscriptions, actions: ['cancel'], values: { reason: this.cancelModel }
        })
      })
      this.loading.cancel = false
      this.emitSubscriptionsCanceled();
      //this was the previous language with "cancel" vs delete for onetimes
        // updatesOnetimes: _buildUpdates({
        //   items: this.onetimes, actions: ['delete'], values: { reason: this.cancelModel }
        // }),
      this.UI_CLOSE_SIDEBAR()
    },
    async handleActivate() {
      this.loading.activate = true

      await this.customerUpdateAddressItems({
         addressId: this.settings.addressId,
         updatesSubscriptions: _buildUpdates({
          items: this.subscriptions, actions: ['activate'], values: { reason: 'reactivated' }
        })
      })

      this.loading.activate = false
      this.emitSubscriptionsReactivate();
      this.UI_CLOSE_SIDEBAR()
    },
    async checkTerms() {
      this.termsCheck = !this.termsCheck;
      document.querySelector('.c-sidebarCancel__cancelButton').disabled = !this.termsCheck;
    },
    exitBack(e) {
      e.preventDefault()
      this.UI_CLOSE_SIDEBAR()
    },
    nextStep() {
      this.stepNumber+=1
    },
    handleOpenDefaultMenu() {
      this.UI_CLOSE_SIDEBAR()
      this.UI_TOGGLE_DEFAULT_MENU(true);
    }
  }
}
</script>

<!-- #519864 -->
<style lang="scss" scoped>

  h2.c-h2s {
    font-size: 22px;
    letter-spacing: -1px;
  }

  h3.sub-head {
    color: $color-broccoli;
    font-size: 20px;
    font-weight: 600;
  }

  .c-sidebarCancel {
    @include media-tablet-up {
      margin-top: -1.5rem;
    }

    .c-sidebar__heading {
     margin-bottom: 10px;
    }

    .terms-h4 {
      font-weight: 600;
      font-size: 20px;
      margin-bottom: 10px;
    }

    .content-block__whtBg {
      border: 1px solid #e2dfd7;
      border-radius: 0.75rem;
      background: #fbfaf4;
      display: flex;
      padding: 1.15rem;
      line-height: 1.25;

      input {
        margin: 3px 12px 0 0;
      }
    }

    .cancel__steps {
      flex-direction: column;
      width: 100%;
      height: auto;
      gap: 5px;
      text-align: center;
      > * {
        margin-bottom: 8px;
      }

      h2, p {
        padding: 0 1.5rem;
        margin-bottom: 1rem;
      }

      h2, h3 {
        padding: 0 3rem;
      }

      img {
        border-radius: 1rem;
        margin-bottom: 12px;
      }
    }

    .c-sidebarCancel__cancelButton {
      width: 100%;
    }

    a.exit-back {
      display: block;
      color: $color-broccoli;
      font-size: 14px;
      font-weight: 700;
      letter-spacing: 0.5px;
      text-align: center;
      margin-top: 1.5rem;
      text-decoration: underline;
      text-transform: uppercase;
    }
  }
  .c-sidebarCancel__address {
    font-size: 20px;
    font-weight: 500;
    margin-bottom: 10px;
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
