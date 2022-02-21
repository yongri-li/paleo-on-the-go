<template>
  <div :class="_buildModifiers('c-modalDeliverychange', modifiers)"
    v-if="content"
  >
    <section v-if="!message.visibility">
      <c-h class="c-modalDeliverychange__heading c-modal__heading"
        tag="h2"
        level="2"
        :text="settings.isCutoffChange ? content.deliverychange_heading : content.deliverychange_heading2"
        :modifiers="['isBolder']"
      />
      <c-p class="c-modalDeliverychange__text"
        tag="p"
        level="2"
        v-if="text1 && fromSidebarChangeDay"
        :text="settings.isCutoffChange ? text1 : text3"
        :modifiers="['isBolder']"
      />
      <c-p class="c-modalDeliverychange__text"
        tag="p"
        level="2"
        v-if="text1 && !fromSidebarChangeDay"
        :text="settings.isCutoffChange ? text1 : text2"
        :modifiers="['isBolder']"
      />
      <c-button class="c-modalDeliverychange__cta c-cta"
        v-if="content.deliverychange_button_confirm"
        :text="content.deliverychange_button_confirm"
        @click="confirmDeliveryChange"
      /> <!-- @change="this.$emit('changeConfirmed', true)" -->
      <c-button class="c-modalDeliverychange__cancel"
        v-if="content.deliverychange_button_cancel"
        :text="content.deliverychange_button_cancel"
        :modifiers="[ 'isUnderline', 'isPrimary' ]"
        @click="closeModalandSidebar"
      />
    </section>
    <section v-else>
      <c-h class="c-modalDeliverychange__heading c-modal__heading"
        tag="h2"
        level="2"
        text="Update Confirmed"
        :modifiers="['isBolder']"
      />
      <c-p class="c-modalDeliverychange__text"
        tag="p"
        level="2"
        :text="updatedDeliveryMessage"
        :modifiers="['isBolder']"
      />
      <c-button class="c-modalDeliverychange__cancel"
        v-if="content.deliverychange_button_cancel"
        text="Close"
        :modifiers="[ 'isUnderline', 'isPrimary' ]"
        @click="closeModalandSidebar"
      />
    </section>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'

import cH from '@shared/components/core/cH.vue'
import cP from '@shared/components/core/cP.vue'
import cButton from '@shared/components/core/cButton.vue'

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
    cH, cP, cButton
  },
  data: () => ({
    loading: {
      delay: false
    },
    message: {
      text: 'Delivery Day Updated',
      visibility: false
    }
  }),
  computed: {
    deliveryChangeDay() {
      return this.settings.deliveryChangeDay
    },
    deliveryChangeDate() {
      return this.settings.deliveryChangeDate
    },
    fromSidebarChangeDay() {
      return this.settings.fromSidebarChangeDay
    },
    text1() {
      const { deliverychange_new_day } = this.content
      const mapObj = {
         "{{ new_day }}": `${this.deliveryChangeDay}`,
         "{{ new_date }}": `${this.deliveryChangeDate}`
      };
      if(deliverychange_new_day) {
        return deliverychange_new_day.replace(/{{ new_day }}|{{ new_date }}/gi, function(matched){
          return mapObj[matched];
        });
      }
    },
    text2() {
      return "Please click to confirm your delivery date change."
    },
    text3() {
      return `Updating delivery day to ${this.deliveryChangeDay} will change your upcoming delivery to ${this.deliveryChangeDate}.`
    },
    updatedDeliveryMessage() {
      return `Your delivery day has been updated to ${this.deliveryChangeDate}.`
    }
  },
  methods: {
    ...mapMutations('ui', ['UI_CLOSE_MODAL','UI_CLOSE_SIDEBAR']),
    closeModalandSidebar() {
      const evt = new CustomEvent('dayChangeCanceled', {
        detail: {
          canceled: true
        }
      }, false);
      document.dispatchEvent(evt);      
      setTimeout(()=>{
        this.UI_CLOSE_MODAL();
        this.UI_CLOSE_SIDEBAR();
      },500)
    },
    confirmDeliveryChange() {
      if (this.fromSidebarChangeDay) {
        const evt = new CustomEvent('dayChangeConfirmed', {
          detail: {
            confirm: true
          }
        });
        document.dispatchEvent(evt);
        this.message.visibility = true
      } else {
        const event = new CustomEvent('deliveryChangeConfirmed', {
          detail: {
            confirmed: true,
            isCutoffChange: this.settings.isCutoffChange
          }
        });
        document.dispatchEvent(event);
        setTimeout(()=>{this.UI_CLOSE_MODAL()},500)
      }
    }
  },
  // mounted(){
  // }
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
  .c-modalDeliverychange__text {
    margin-bottom: 32px;
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
