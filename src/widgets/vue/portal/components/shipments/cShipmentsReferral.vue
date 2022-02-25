<template>
  <div :class="_buildModifiers('c-shipmentsReferral', modifiers)"
    v-if="content"
  >
    <span class="c-shipmentsReferral__preheading"
      v-if="content.preheading"
      v-html="content.preheading"
    />
    <c-h class="c-shipmentReferral__heading"
      v-if="content.heading"
      tag="h2"
      level="2"
      :text="content.heading"
    />
    <c-button class="c-shipmentReferral__button"
      data-lion-refer
      v-if="content.button"
      :text="content.button"
      :modifiers="['isDefault', 'isBlack']"
    />
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
  .c-shipmentsReferral {
    @include media-tablet-up {
      @include flex($direction: column);
    }
    @include media-desktop-up {
      margin-bottom: 40px;
    }
  }
  .c-shipmentsReferral__preheading {
    @include text-body;
    color: $color-secondary;
    font-size: 16px;
    text-transform: uppercase;
    font-weight: 700;
  }
  .c-shipmentReferral__heading {
    margin-bottom: 10px;
  }
</style>