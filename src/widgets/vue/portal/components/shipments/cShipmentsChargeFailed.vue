<template>
  <div class="c-calloutBlock">
    <div class="c-calloutBlock__text">
      <h3 class="c-calloutBlock__heading c-h3">
        <!-- {{ newCardPending ? 'Card Updated, Charge Pending' : content.charge_error_heading }} -->
        {{ content.charge_error_heading }}
      </h3>
      <div class="c-calloutBlock__message" v-html="content.charge_error_copy"></div>
    </div>
    <div class="u-textCenter">
      <button
        class="c-button c-button--isDefault c-button--isPrimary c-calloutBlock__btn"
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
import { mapMutations } from 'vuex'

export default {
  props: {
    content: {
      type: Object
      // required: true
    },
    newCardPending: {
      type: String
      // required: true
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
    triggerUpdatePaymentSidebar() {
      sessionStorage.setItem('from_update_payment', true)
      this.$router.push({ path: '/profile' })
    }
  }
}
</script>

<style lang="scss">
.c-calloutBlock {
  display: flex;
  background-color: $color-white;
  border-radius: 0;
  width: 94vw;
  max-width: 1600px;
  padding: 2rem;
  margin: 3rem auto 1rem;

  @include media-desktop-up {
    width: 84vw;
    align-items: center;
    gap: 3rem;
    text-align: left;
    padding: 3rem;
  }

  @include media-mobile-down {
    flex-direction: column;
  }

  & > div {
    flex: 1;

    & > * {
      width: clamp(300px, 30vw, 500px);
    }
  }

  &__heading {
    margin-bottom: 0.5rem;
    @include media-desktop-up {
      margin-bottom: 17px;
    }
  }

  &__text {
    @include media-desktop-up {
      border-right: 2px solid lightgrey;
    }
  }

  &__message {
    margin-bottom: 2rem;
    line-height: 1.5;
    @include media-desktop-up {
      margin: 0;
    }
  }

  &__btn {
    margin: 1.5rem auto;
  }

  &__ctaSecondary {
    color: $color-grey;
    font-weight: 600;
    text-decoration: underline;
  }
}
</style>
