<template>
  <div :class="_buildModifiers('c-shipmentsLoading', modifiers)">
    I'm a shipments loading
  </div>
</template>

<script>
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
  }
}
</script>

<style lang="scss">
</style>