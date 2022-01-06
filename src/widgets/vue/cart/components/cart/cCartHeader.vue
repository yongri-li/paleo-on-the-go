<template>
  <div :class="_buildModifiers('c-cartHeader', modifiers)">
    <h3 class="c-cartHeader__label c-h3 u-textCenter"
      v-html="content.header_text
        ? content.header_text : '{{ header_text }}'
      "
    />
  </div>
</template>

<script>
export default {
  props: {
    modifiers: {
      type: Array,
      default: () => ([])
    }
  },
  computed: {
    content() {
      return this.$store.getters['contentByPrefix']('header_')
    }
  }
}
</script>

<style lang="scss">
  .c-cartHeader {
    padding: 30px 20px;
    border-bottom: 1px solid $color-hr;
  }
  .c-cartHeader__label {
    margin-bottom: 0;
  }
</style>