<template>
  <div :class="_buildModifiers('c-detailsBlock', modifiers)">
    <c-h
      class="c-detailsBlock__heading"
      v-if="heading"
      tag="h5"
      level="5"
      :modifiers="['isLabel']"
      :text="heading"
    />
    <div class="c-detailsBlock__inner">
      <slot />
    </div>
  </div>
</template>

<script>
import cH from '@shared/components/core/cH.vue'

export default {
  props: {
    heading: {
      type: [String, Boolean],
      default: false
    },
    modifiers: {
      type: Array,
      default: () => []
    }
  },
  components: { cH }
}
</script>

<style lang="scss">
/* asdsasdsad asdsa */
.c-detailsBlock {
  height: 100%;
  width: 100%;
  @include flex($direction: column, $justify: stretch, $align: stretch, $wrap: nowrap);
}
.c-detailsBlock__inner {
  min-height: 100px;
  padding: 15px 20px;
  @include flex($justify: space-between, $wrap: nowrap);
  background-color: $color-white;
  @include border-card;
  @include shadow-card($opacity: 0.05);
  @include media-tablet-up {
    padding: 20px 30px;
  }
}
</style>
