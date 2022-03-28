<template>
  <div :class="_buildModifiers('c-details', modifiers)">
    <c-detailsLoading class="c-details__loading" v-if="!ready" />
    <div class="c-details__content" v-if="ready">
      <c-h
        class="c-details__heading"
        v-if="content.page_heading"
        tag="h2"
        level="2"
        :text="content.page_heading"
      />
      <div class="c-details__box">
        <!-- email -->
        <div class="c-details__boxSingle">
          <c-detailsBlock class="c-details__boxItem withAccordion">
            <c-accordion>
              <c-accordionItem>
                <div class="c-details__boxButton" slot="trigger">
                  <section>
                    <span class="class-details__boxText" v-html="customerShopify.email" />
                    <br />
                    ************
                  </section>
                  <span class="c-details__editTrigger c-button--isUnderline c-button--isBlack"></span>
                </div>
                <div class="" slot="content">
                  <c-formPassword
                    class="c-sidebarPassword__form"
                    :value="customerShopify.email"
                    :hideAlert="true"
                    :content="{
                      email_label: sidebarContent.password.password_email_label,
                      button_text: sidebarContent.password.password_button_text,
                      button_success: sidebarContent.password.password_button_success
                    }"
                  />
                </div>
              </c-accordionItem>
            </c-accordion>
          </c-detailsBlock>
        </div>
        <!-- Old Code With Pop-out Sidebar Drawer -->
        <!-- <div class="c-details__boxSingle">
          <c-detailsBlock class="c-details__boxItem" :heading="content.email_label">
            <c-p class="class-details__boxText" tag="p" level="3" v-html="customerShopify.email" />
            <span class="class-details__boxText" v-html="content.password_placeholder" />
            <c-button
              class="c-details__boxButton"
              :text="content.password_edit"
              :modifiers="['isUnderline', 'isPrimary']"
              @click="
                UI_SET_SIDEBAR({
                  component: 'cSidebarPassword',
                  content: sidebarContent.password
                })
              "
            />
          </c-detailsBlock>
        </div> -->

        <!-- billing address -->
        <div class="c-details__boxSingle">
          <c-detailsBlock
            class="c-details__boxItem withAccordion"
            v-if="customerRecharge"
            :heading="content.billing_label"
          >
            <c-accordion>
              <c-accordionItem>
                <div class="c-details__boxButton" slot="trigger">
                  <section>
                    <c-p
                      class="class-details__boxText"
                      tag="address"
                      level="3"
                      v-html="
                        _buildAddress({
                          address: customerRecharge.billingAddress,
                          options: {
                            hiddenFields: ['country'],
                            provinceName: 'short'
                          }
                        })
                      "
                    />
                  </section>
                  <span class="c-details__editTrigger c-button--isUnderline c-button--isBlack"></span>
                </div>
                <div class="" slot="content">
                  <c-formBilling
                    class="c-sidebarBilling__form"
                    :hideAlert="true"
                    :content="{
                      first_label: sidebarContent.billing.billing_first_label,
                      last_label: sidebarContent.billing.billing_last_label,
                      address1_label: sidebarContent.billing.billing_address1_label,
                      address2_label: sidebarContent.billing.billing_address2_label,
                      city_label: sidebarContent.billing.billing_city_label,
                      province_label: sidebarContent.billing.billing_province_label,
                      button_text: sidebarContent.billing.billing_button_text,
                      zip_label: sidebarContent.billing.billing_zip_label,
                      country_label: sidebarContent.billing.billing_country_label,
                      button_success: sidebarContent.billing.billing_button_success
                    }"
                  />
                </div>
              </c-accordionItem>
            </c-accordion>
          </c-detailsBlock>
        </div>

        <!-- payment update -->
        <div class="c-details__boxSingle">
          <c-detailsBlock
            class="c-details__boxItem withAccordion"
            v-if="customerRecharge"
            :heading="content.payment_label"
          >
            <c-accordion>
              <c-accordionItem>
                <div class="c-details__boxButton" slot="trigger">
                  <section>
                    <c-p class="class-details__boxText" tag="address" level="3" text="**** ****** ****" />
                  </section>
                  <span class="c-details__editTrigger c-button--isUnderline c-button--isBlack"></span>
                </div>
                <div class="" slot="content">
                  <c-sidebarPayment class="c-pageDetails__payment" :settings="sidebar.settings" />
                </div>
              </c-accordionItem>
            </c-accordion>
          </c-detailsBlock>
        </div>
      </div>

      <hr />

      <c-h
        class="c-details__heading"
        v-if="content.plans_heading"
        tag="h2"
        level="2"
        :text="content.plans_heading"
      />
      <div class="c-details__box c-box__isEditSubs editCancel" v-if="showAddresses">
        <div class="c-details__boxSingle" v-for="(address, i) in addressList.active" :key="address.id">
          <c-detailsBlock class="c-details__boxItem withAccordion" v-if="customerRecharge">
            <c-accordion>
              <c-accordionItem :boxNum="i" @closeThisAcc="closeSlotAcc" :closeBoxAcc="[closeBoxAcc, inc]">
                <div class="c-details__boxButton" slot="trigger">
                  <section>
                    <address class="c-details__boxAddress" v-html="address.address1" />
                    <span class="c-details__boxShips" v-html="content.plans_text_next" />
                    <span class="c-details__boxDate" v-html="shipDate(address)" />
                  </section>
                  <span class="c-details__editTrigger c-button--isUnderline c-button--isBlack"></span>
                </div>
                <div class="" slot="content">
                  <c-sidebarCancel :address="address" :content="sidebarContent.cancel" :boxNum="i" />
                </div>
              </c-accordionItem>
            </c-accordion>
          </c-detailsBlock>
        </div>
      </div>

      <div class="c-details__box c-box__isEditSubs editActivate" v-if="showAddresses">
        <div class="c-details__boxSingle" v-for="(address, i) in addressList.inactive" :key="address.id">
          <c-detailsBlock class="c-details__boxItem withAccordion" v-if="customerRecharge">
            <c-accordion>
              <c-accordionItem
                :boxNum="i + 10"
                @closeThisAcc="closeSlotAcc"
                :closeBoxAcc="[closeBoxAcc + 10, inc]"
              >
                <!-- @closeThisAcc="closeSlotAcc" :closeBoxAcc="[closeBoxAcc, inc]" -->
                <div class="c-details__boxButton" slot="trigger">
                  <section>
                    <address class="c-details__boxAddress" v-html="address.address1" style="margin: 0" />
                  </section>
                  <span class="c-details__editTrigger c-button--isUnderline c-button--isBlack"></span>
                </div>
                <div class="" slot="content">
                  <c-sidebarActivate
                    :address="address"
                    :content="sidebarContent.activate"
                    :boxNum="i"
                    :settings="{ address: address }"
                  />
                </div>
              </c-accordionItem>
            </c-accordion>
          </c-detailsBlock>
        </div>
        <!--         <div class="c-details__boxSingle" v-for="address in addressList.inactive" :key="address.id">
          <c-detailsBlock class="c-details__boxItem">
            <div class="c-details__boxContent">
              <address class="c-details__boxAddress" v-html="address.address1" style="margin: 0" />
            </div>
            <c-button
              class="c-details__boxButton isReactivate"
              :text="content.plans_button_activate"
              :modifiers="['isUnderline', 'isBlack']"
              @click="
                UI_SET_SIDEBAR({
                  component: 'cSidebarActivate',
                  content: sidebarContent.activate,
                  settings: { address: address }
                })
              "
            />
          </c-detailsBlock>
        </div> -->
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
import cAccordion from '@shared/components/core/cAccordion.vue'
import cAccordionItem from '@shared/components/core/cAccordionItem.vue'
import cFormPassword from '../forms/cFormPassword.vue'
import cFormBilling from '../forms/cFormBilling.vue'
import cFormShipping from '../forms/cFormShipping.vue'
import cSidebarPayment from '../sidebars/cSidebarPayment.vue'
import cSidebarCancel from '../sidebars/cSidebarCancel.vue'
import cSidebarActivate from '../sidebars/cSidebarActivate.vue'

export default {
  props: {
    modifiers: {
      type: Array,
      default: () => []
    }
  },
  components: {
    cH,
    cP,
    cButton,
    cDetailsLoading,
    cDetailsBlock,
    cAccordion,
    cAccordionItem,
    cFormPassword,
    cFormBilling,
    cFormShipping,
    cSidebarPayment,
    cSidebarCancel,
    cSidebarActivate
  },
  data() {
    return {
      ready: false,
      error: false,
      setBoxHeight: false,
      closeBoxAcc: null,
      inc: 0
    }
  },
  computed: {
    ...mapGetters('customer', ['customerShopify', 'customerRecharge']),
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
      if (addressList) {
        const { active, inactive } = addressList
        return active.length > 0 || inactive.length > 0
      }
    },
    sidebar() {
      return this.$store.getters['ui/uiByKey']('sidebar')
    }
  },
  methods: {
    ...mapActions('customer', ['customerSetResources']),
    ...mapMutations('ui', ['UI_SET_SIDEBAR']),
    closeSlotAcc(e) {
      this.closeBoxAcc = e
      this.inc += 1
    },
    shipDate(address) {
      return address.date ? this._formatDate(address.date, 'MMM DD, YYYY') : this.content.plans_text_never
    },
    setBoxMaxHeight() {
      this.setBoxHeight = !this.setBoxHeight
    }
  },
  async created() {
    if (this.customerRecharge) {
      const { success, error } = await this.customerSetResources({
        resources: ['addresses', 'charges', 'onetimes', 'subscriptions']
      })
      if (error) this.error = error
      this.ready = true
    } else this.ready = true
  }
}
</script>

<style lang="scss">
.c-details {
  max-width: 1240px;
  margin: 0 auto;
  padding: 2rem 0 4rem;
  @include media-desktop-up {
    padding-top: 40px;
  }
}
.c-details__heading {
  color: $color-black;
}
.c-details__box {
  padding: 0;
  background-color: $color-ecru;
  border-radius: 0;
}
.c-details__box + hr {
  margin-bottom: 2rem;
  @include media-tablet-up {
    margin-bottom: 4rem;
  }
}
.c-details__boxSingle,
.c-details__boxGroup {
  padding-bottom: 3rem;
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
}
.c-details__boxAddress {
  margin-bottom: 0.5rem;
  font-size: 1.125rem;
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
.c-details__editTrigger {
  float: right;
  border-bottom: 1px solid $color-black;
  transition: color 170ms;
}
.c-details__editTrigger::after {
  content: 'Edit';
}

.c-accordionItem__trigger--isOpen {
  .c-details__editTrigger {
    color: $color-secondary;

    &::after {
      content: 'Close';
    }
  }
}

/*.c-box__isEditSubs {
  .c-details__boxButton {
    &.isReactivate {
    }
  }
}*/

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

.c-box__isEditSubs {
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

.editActivate {
  .c-details__editTrigger::after {
    content: 'Reactivate';
  }

  .c-accordionItem__trigger--isOpen {
    .c-details__editTrigger::after {
      content: 'Close';
    }
  }

  .withAccordion {
    .c-accordionItem__trigger--isOpen + .c-accordionItem__content {
      margin-top: 0 !important;
    }
  }
}
</style>
