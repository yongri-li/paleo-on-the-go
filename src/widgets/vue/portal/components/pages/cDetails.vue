<template>
  <div :class="_buildModifiers('c-details', modifiers)">
    <c-detailsLoading class="c-details__loading" 
      v-if="!ready"
    />
    <div class="c-details__content" v-if="ready">
      <c-h class="c-details__heading"
        v-if="content.page_heading"
        tag="h1"
        level="1"
        :text="content.page_heading"
      />
      <div class="c-details__box">
        <div class="c-details__boxSingle">
          <c-detailsBlock class="c-details__boxItem"
            v-if="customerRecharge"
            :heading="content.billing_label"
          >
            <c-p class="class-details__boxText"
              tag="address"
              level="3"
              v-html="_buildAddress({
                address: customerRecharge.billingAddress,
                options: {
                  hiddenFields: ['country'],
                  provinceName: 'short'
                }
              })"
            />
            <c-button class="c-details__boxButton"
              :text="content.billing_edit"
              :modifiers="['isUnderline', 'isPrimary']"
              @click="UI_SET_SIDEBAR({ 
                component: 'cSidebarBilling',
                content: sidebarContent.billing
              })"
            />
          </c-detailsBlock>
        </div>
        <div class="c-details__boxGroup">
          <c-detailsBlock class="c-details__boxItem"
            :heading="content.email_label"
          >
            <c-p class="class-details__boxText"
              tag="p"
              level="3"
              v-html="customerShopify.email"
            />
          </c-detailsBlock>
          <c-detailsBlock class="c-details__boxItem"
            :heading="content.password_label"
          >
            <span class="class-details__boxText"
              v-html="content.password_placeholder"
            />
            <c-button class="c-details__boxButton"
              :text="content.password_edit"
              :modifiers="['isUnderline', 'isPrimary']"
              @click="UI_SET_SIDEBAR({ 
                component: 'cSidebarPassword',
                content: sidebarContent.password
              })"
            />
          </c-detailsBlock>
          <c-detailsBlock class="c-details__boxItem"
            v-if="customerRecharge"
            :heading="content.payment_label"
          >
            <span class="class-details__boxText"
              v-html="content.payment_placeholder"
            />
            <c-button class="c-details__boxButton"
              :text="content.payment_edit"
              :modifiers="['isUnderline', 'isPrimary']"
              @click="UI_SET_SIDEBAR({ 
                component: 'cSidebarPayment',
                content: sidebarContent.payment
              })"
            />
          </c-detailsBlock>
          <c-detailsBlock class="c-details__boxItem"
            v-if="customerRecharge"
            :heading="content.notifications_label"
          >
            <c-button class="c-details__boxButton"
              :text="content.notifications_edit"
              :modifiers="['isUnderline', 'isPrimary']"
            />
          </c-detailsBlock>
        </div>
      </div>
      <div class="c-details__box c-details__box--isAddresses" 
        v-if="showAddresses"
      >
        <c-h class="c-details__boxHeading"
          v-if="content.plans_heading"
          tag="h5"
          level="5"
          :modifiers="['isLabel']"
          :text="content.plans_heading"
        />
        <div class="c-details__boxSingle"
          v-for="address in addressList.active"
          :key="address.id"
        >
          <c-detailsBlock class="c-details__boxItem">
            <div class="c-details__boxContent">
              <address class="c-details__boxAddress"
                v-html="address.address1"
              />
              <span class="c-details__boxShips"
                v-html="content.plans_text_next"
              />
              <span class="c-details__boxDate"
                v-html="shipDate(address)"
              />
            </div>
            <c-button class="c-details__boxButton"
              :text="content.plans_button_cancel"
              :modifiers="['isUnderline', 'isPrimary']"
              @click="UI_SET_SIDEBAR({ 
                component: 'cSidebarCancel',
                content: sidebarContent.cancel,
                settings: { address: address }
              })"
            />
          </c-detailsBlock>
        </div>
        <div class="c-details__boxSingle"
          v-for="address in addressList.inactive"
          :key="address.id"
        >
          <c-detailsBlock class="c-details__boxItem">
            <div class="c-details__boxContent">
              <address class="c-details__boxAddress"
                v-html="address.address1"
              />
              <span class="c-details__boxShips"
                v-html="content.plans_text_last"
              />
              <span class="c-details__boxDate"
                v-html="shipDate(address)"
              />
            </div>
            <c-button class="c-details__boxButton"
              :text="content.plans_button_activate"
              :modifiers="['isUnderline', 'isPrimary']"
              @click="UI_SET_SIDEBAR({ 
                component: 'cSidebarActivate',
                content: sidebarContent.activate,
                settings: { address: address }
              })"
            />
          </c-detailsBlock>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex'
import cH from '@shared/components/core/cH.vue'
import cP from '@shared/components/core/cP.vue'
import cButton from '@shared/components/core/cButton.vue'
import cDetailsLoading from '../details/cDetailsLoading.vue'
import cDetailsBlock from '../details/cDetailsBlock.vue'

export default {
  props: {
    modifiers: {
      type: Array,
      default: () => ([])
    }
  },
  components: { 
    cH, cP, cButton,
    cDetailsLoading, cDetailsBlock
  },
  data: () => ({ ready: false, error: false }),
  computed: {
    ...mapGetters('customer', [
      'customerShopify', 'customerRecharge'
    ]),
    content() {
      return this.$store.getters['customize/customizeContentByKey']('details')
    },
    sidebarContent() {
      const billing = this.$store.getters['customize/customizeSidebarByPrefix']('billing_')
      const password = this.$store.getters['customize/customizeSidebarByPrefix']('password_')
      const payment = this.$store.getters['customize/customizeSidebarByPrefix']('payment_')
      const cancel = this.$store.getters['customize/customizeSidebarByPrefix']('cancel_')
      const activate = this.$store.getters['customize/customizeSidebarByPrefix']('activate_')
      return { billing, password, payment, cancel, activate }
    },
    addressList() {
      return this.$store.getters['customer/customerAddressesWithStatus']
    },
    showAddresses() {
      const { addressList } = this
      if(addressList) {
        const { active, inactive } = addressList
        return active.length > 0 || inactive.length > 0
      }
    },
  },
  methods: {
    ...mapActions('customer', ['customerSetResources']),
    ...mapMutations('ui', ['UI_SET_SIDEBAR']),
    shipDate(address) {
      return address.date 
        ? this._formatDate(address.date, 'MMM DD, YYYY')
        : this.content.plans_text_never
    }
  },
  async created() {
    if(this.customerRecharge) {
      const { success, error } = await this.customerSetResources({
        resources: [ 'addresses', 'charges', 'onetimes', 'subscriptions' ]
      })
      if(error) this.error = error
      this.ready = true
    }
    else this.ready = true
  }
}
</script>

<style lang="scss">
  .c-details {
    max-width: 1000px;
    margin: 0 auto;
    padding: 30px 0 60px;
    @include media-desktop-up {
      padding-top: 40px;
    }
  }
  .c-details__heading {
    color: $color-secondary;
  }
  .c-details__box {
    padding: 15px 20px 0;
    @include shadow-card;
    background-color: $color-white;
    border-radius: 3px;
    &.c-details__box--isAddresses {
      margin-top: 40px;
    }
  }
  .c-details__boxSingle,
  .c-details__boxGroup {
    padding-bottom: 20px;
  }
  .c-details__boxGroup {
    @include grid($columns: 1fr, $auto-flow: row, $gap: 30px 20px);
    @include media-tablet-up {
      grid-template-columns: 1fr 1fr;
    }
  }
  .class-details__boxText {
    font-size: 15px;
    margin: 0;
  }
  .c-details__boxContent {
    @include flex($direction: column, $align: flex-start);
  }
  .c-details__boxAddress,
  .c-details__boxShips {
    display: block;
    @include text-heading;
  }
  .c-details__boxAddress {
    margin-bottom: 4px;
    font-size: 20px;
    font-weight: 700;
  }
  .c-details__boxShips {
    font-size: 16px;
    text-transform: uppercase;
    font-weight: 800;
  }
  .c-details__boxDate {
    display: block;
    @include text-body;
    font-size: 16px;
  }
</style>