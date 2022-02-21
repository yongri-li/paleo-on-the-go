<template>
  <div :class="_buildModifiers('c-detailsLoading', modifiers)">
    <div class="c-detailsLoading__heading c-detailsLoading__blockBase" />
    <div class="c-detailsLoading__box">
      <div class="cDetailsLoadingBlock" />

    </div>
  </div>
</template>

<script>
import cDetailsLoadingBlock from './cDetailsLoadingBlock.vue'

export default {
  props: {
    modifiers: {
      type: Array,
      default: () => ([])
    }
  },
  components: { cDetailsLoadingBlock }
}
</script>

<style lang="scss">
  .c-detailsLoading__blockBase {
    @include gradient-shimmer;
  }
  .c-detailsLoading__heading {
    width: 420px;
    max-width: 100%;
    height: 44px;
    margin-bottom: 40px;
    border-radius: 3px;
  }
  .c-detailsLoading__box {
    padding: 20px;
    margin-bottom: 40px;
    border-radius: 3px;
    border: 1px solid #E5E5E5;
  }
</style>