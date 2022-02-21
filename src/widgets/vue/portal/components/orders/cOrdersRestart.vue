<template>
  <div class="c-stackedText u-textCenter">
<!--     <div class="c-stackedText__text">
      <h3 class="c-promoBlock__heading c-h3">
        {{ content.start_new_order_heading }}
      </h3>
      <div class="c-promoBlock__text">
        {{ content.start_new_order_text }}
      </div>
      <a class="c-promoBlock__cta c-cta" :href="content.start_new_order_cta_url">
        {{ content.start_new_order_cta_text }}
      </a>
    </div> -->
    <div class="c-stackedText__text">
      <h3 class="c-promoBlock__heading c-h3">
        {{ content.reactivate_order_heading }}
      </h3>
      <div class="c-promoBlock__text">
        {{ content.reactivate_order_text }}
      </div>
      <c-button class="c-cta c-ctaBlock__cta c-sidebarActivate__button"
        @click="UI_SET_SIDEBAR({
          component: 'cSidebarActivate',
          content: sidebarContent.cancel,
          settings: {
            address: address,
            addressId: addressId,
            modifiers: ['activate-subscriptions'],
            nextDeliveryDay: delivday
          }
        })"
        :loading="loading.activate"
        :text="content.reactivate_order_cta_text"
      />      
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import cButton from '@shared/components/core/cButton.vue'  

export default {
  props: {
    addressId: {
      type: [String, Number],
      required: true
    },
    address: {
      type: Object,
      required: true
    },
    content: {
      type: Object,
      required: true
    },    
    delivday: {
      type: [String, Number],
      required: true
    }
  },
  data() {
    return {
      loading: { cancel: false, activate: false }
    }
  },
  computed: {
    sidebarContent() {
      const cancel = this.$store.getters['customize/customizeSidebarByPrefix']('cancel_activate_')
      return { cancel }
    }
  },
  methods: {
    ...mapMutations('ui', ['UI_SET_SIDEBAR'])
  },
  components: {
    cButton
  }  
}
</script>

<style lang="scss">
  .c-stackedText {
    background-color: $color-ecru;
    border-radius: 12px;
    border: 1px solid $color-paleo;
    padding: 16px;
    @include media-desktop-up {
      padding: 20px 80px;
    }
  }
  .c-stackedText__heading {
    font-size: 22px;
    @include media-desktop-up {
      font-size: 26px;
    }
  }
  .c-stackedText__text {
    padding: 22px 0;
    @include media-desktop-up {
      padding: 30px 0;
    }
    &:first-child {
   /*   border-bottom: 1px solid $color-paleo;*/
    }
  }
</style>