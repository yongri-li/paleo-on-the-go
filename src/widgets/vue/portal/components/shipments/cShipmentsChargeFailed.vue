<template>
  <div class="c-calloutBlock">
    <div class="c-calloutBlock__text">
      <h3 class="c-calloutBlock__heading c-h3">
        {{ newCardPending ? 'Card Updated, Charge Pending' : content.charge_error_heading }}
      </h3>
      <div class="c-calloutBlock__message" v-html="newCardPending ? 'Thanks for updating your billing information. We will attempt another charge soon. For more info, please contact support.' : content.charge_error_copy">
      </div>
    </div>
    <div class="u-textCenter">
      <button v-if="!newCardPending" class="c-calloutBlock__cta c-cta"
          @click="triggerUpdatePaymentSidebar"
      >
        {{ content.charge_error_update_payment_text }}
      </button>   
      <a href="https://freshmealplan.zendesk.com/hc/en-us" class="c-calloutBlock__ctaSecondary u-btnUnset">
        {{ content.charge_error_contact_support_text }}
      </a>
    </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex';  

export default {
  props: {
    content: {
      type: Object,
      required: true
    },
    newCardPending: {
      type: String,
      required: true
    }
  },
  computed: {      
    sidebarContent() {
      const payment = this.$store.getters['customize/customizeSidebarByPrefix']('payment_')
      return { payment }
    }
  }, 
  methods: {
    ...mapMutations('ui', ['UI_SET_SIDEBAR']),
    triggerUpdatePaymentSidebar(){
      sessionStorage.setItem('from_update_payment', true)
      this.$router.push({ path: '/profile' })
    }
  }
}
</script>

<style lang="scss">
  .c-calloutBlock {
    text-align: center;
    background-color: $color-ecru;
    border-radius: 12px;
    border: 1px solid $color-citrus;
    padding: 23px 16px;
    @include media-desktop-up {
      display: grid;
      align-items: center;
      grid-template-columns: auto 330px;
      grid-column-gap: 135px;
      text-align: left;
      padding: 42px 30px;
    }
  }
  .c-calloutBlock__heading {
    font-size: 18px;
    margin-bottom: 7px;
    @include media-desktop-up {
      font-size: 26px;
      margin-bottom: 17px;
    }
  }
  .c-calloutBlock__message {
    font-size: 15px;
    margin-bottom: 29px;
    line-height: 1.5;
    @include media-desktop-up {
      font-size: 18px;
      margin: 0;
    }
  }
  .c-calloutBlock__cta {
    margin-bottom: 12px;
  }
  .c-calloutBlock__ctaSecondary {
    text-transform: uppercase;
    color: $color-broccoli;
    font-size: 13px;
    font-weight: 600;
    text-decoration: underline;
  }
</style>