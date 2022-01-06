<template>
  <div :class="_buildModifiers('c-shipmentsUpsell', modifiers)">
    I'm the shipment upsell
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