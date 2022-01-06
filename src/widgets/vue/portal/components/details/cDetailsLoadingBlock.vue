<template>
  <div :class="_buildModifiers('c-detailsLoadingBlock', modifiers)">
    <c-h class="c-detailsLoadingBlock__heading c-detailsLoadingBlock__blockBase"
      v-if="heading"
    />
    <div class="c-detailsLoadingBlock__inner">
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    heading: {
      type: Boolean,
      default: true
    },
    modifiers: {
      type: Array,
      default: () => ([])
    }
  }
}
</script>

<style lang="scss">
  .c-detailsLoadingBlock__blockBase {
    @include gradient-shimmer;
  }
  .c-detailsLoadingBlock {
    height: 100%;
    width: 100%;
    @include flex($direction: column, $justify: stretch, $align: stretch, $wrap: nowrap);
  }
  .c-detailsLoadingBlock__heading {
    width: 140px;
    max-width: 100%;
    height: 20px;
    margin-bottom: 10px;
    border-radius: 3px;
  }
  .c-detailsLoadingBlock__inner {
    min-height: 110px;
    padding: 15px 20px;
    @include flex($justify: space-between, $wrap: nowrap);
    background-color: $color-white;
    border-radius: 3px;
    border: 1px solid #E5E5E5;
    @include media-tablet-up {
      padding: 20px 30px;
    }
  }
</style>