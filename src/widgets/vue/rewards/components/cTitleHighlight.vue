<template>
  <h2 class="c-h2 u-highlightText">
    <span class="u-highlightText--secondary">
      {{ ecruText }}
    </span>
    {{ blackText }}
  </h2>
</template>

<script>
export default {
  props: {
    ecruText: {
      type: String,
      default: ''
    },
    blackText: {
      type: String,
      required: true
    }
  }
}
</script>

<style lang="scss" scoped>
.u-highlightText {
  @include flex($justify: center);
  font-size: 3rem;

  @include media-tablet-up {
    font-size: 4rem;
  }

  &--secondary {
    width: auto;
    margin-right: .4rem;
  }
}
</style>