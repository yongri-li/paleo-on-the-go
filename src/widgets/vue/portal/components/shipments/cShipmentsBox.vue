<template>
  <div :class="_buildModifiers('c-shipmentsBox', modifiers)">
    <div class="c-shipmentsBox__flex">
      <div class="c-shipmentsBox__flexSmall">
        <div class="c-shipmentsBox__shipping">
          <span class="c-shipmentsBox__shippingCharges u-block"
            v-html="'this box charges'"
          />
          <c-h class="c-shipmentsBox__shippingDate"
            tag="time"
            level="1"
            :text="'Mar 22'"
          />
          <c-button class="c-shipments__shippingButton"
            :modifiers="['isDefault', 'isPrimary']"
            :text="'ship it asap'"
          />
          <span class="c-shipmentsBox__shippingTo u-block"
            v-html="'Ships To'"
          />
          <c-button class="c-shipmentsBox__shippingAddress u-block"
            :text="'17 Princess Street'"
          />
        </div>
      </div>
      <div class="c-shipmentsBox__flexLarge">
      </div>
    </div>
  </div>
</template>

<script>
import cH from '@shared/components/core/cH.vue'
import cButton from '@shared/components/core/cButton.vue'

export default {
  props: {
    content: {
      type: Object,
      required: true
    },
    modifiers: {
      type: Array,
      default: () => ([])
    }
  },
  components: { 
    cH, cButton
  }
}
</script>

<style lang="scss">
  .c-shipmentsBox {
    @include shadow-card;
    padding: 15px 20px 20px;
    background-color: $color-white;
    border-radius: 3px;
    &:not(:last-child) {
      margin-bottom: 40px;
    }
  }
  .c-shipmentsBox__flex {
    @include flex($direction: column);
    @include media-tablet-up {
      @include flex($justify: space-between, $align: center, $wrap: nowrap);
    }
  }
  .c-shipmentsBox__flexSmall {
    width: 100%;
    @include media-tablet-up {
      max-width: 210px;
    }
    @include media-desktop-up {
      max-width: 250px;
    }
  }
  .c-shipmentsBox__flexLarge {
    @include media-tablet-up {
      max-width: calc(100% - 225px);
    }
    @include media-desktop-up {
      max-width: calc(100% - 280px);
    }
  }
  .c-shipmentBox__shipping {
    width: 100%;
  }
  .c-shipmentsBox__shippingCharges {
    @include text-heading;
    font-size: 14px;
    letter-spacing: 2px;
    text-transform: uppercase;
  }
  .c-shipmentsBox__shippingDate {
    margin-bottom: 15px;
    color: $color-secondary;
    font-size: 50px;
    line-height: 1;
    text-transform: uppercase;
  }
  .c-shipments__shippingButton {
    margin-bottom: 15px;
  }
  .c-shipments__shippingTo,
  .c-shipments__shippingAddress {
    @include text-heading;
    font-size: 18px;
  }
  .c-shipments__shippingAddress {
    color: $color-secondary;
  }
</style>