<template>
  <div :class="_buildModifiers('c-shipmentsEmpty', modifiers)">
    I'm a shipments empty
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