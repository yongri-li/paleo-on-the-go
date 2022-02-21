<template>
  <div class="c-modalDeliverychange">
    <section class="c-modalZipChange">
      <c-h class="c-modalDeliverychange__heading c-modal__heading"
        tag="h2"
        level="2"
        :text="heading"
        :modifiers="['isBolder']"
      />
      <c-p class="c-modalDeliverychange__text"
        tag="p"
        level="2"
        :text="body"
        :modifiers="['isBolder']"
      />   
    </section>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'

import cH from '@shared/components/core/cH.vue'
import cP from '@shared/components/core/cP.vue'

export default {
  props: {
    settings: {
      type: Object,
      required: true
    }
  },
  components: {
    cH, cP
  },
  data: () => ({
    loading: {
      delay: false
    }
  }),
  computed: {
    heading() {
      const text = this.settings.isConfirmNewCC
        ? 'New Charge & Ship Dates'
        : 'Your Skips Are Processing!'
      return text
    },
    body() {
      const text = this.settings.isConfirmNewCC
        ? `Thanks for updating your payment method! Your next charge date as been set to ${this.settings.newChargeDate} and your next meal delivery will arrive on ${this.settings.newShipDate}.`
        : 'Wait a sec! To avoid errors with your order, please do not close or refresh this page until your skip changes are done processing. Thanks!'
      return text      
    }
  },
  methods: {
    ...mapMutations('ui', ['UI_CLOSE_MODAL']),
    closeModalandSidebar() {
      this.UI_CLOSE_MODAL()         
    }
  }
}
</script>

<style lang="scss">
  .c-modalDeliverychange {
    @include flex($direction: column);
    text-align: center;
  }
  .c-modalDeliverychange__confirm {
    margin-top: 20px;
  }
  p.c-modalDeliverychange__text {
    margin-bottom: 8px;
  }
  .c-modalDeliverychange__cta {
    width: 100%;
    max-width: 340px;
    margin: 0 auto;
  }
  .c-modalDeliverychange__cancel {
    margin-top: 22px;
    padding: 0 0 1px;
    border-bottom: 2px solid $color-primary;
    color: $color-primary;
    font-size: 14px;
    font-weight: 700;
    text-transform: uppercase;
    &:hover {
      border-color: transparent;
      cursor: pointer;
    }
  }
</style>
