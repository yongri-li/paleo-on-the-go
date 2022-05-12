<template>
  <div :class="_buildModifiers('c-field', modifiers)">
    <label class="c-field__label" v-if="label" v-html="label" />
    <slot />
  </div>
</template>

<script>
export default {
  props: {
    label: {
      type: [String, Boolean],
      default: false
    },
    error: {
      type: Boolean,
      default: false
    },
    modifiers: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    extendedModifiers() {
      let modifiers = [...this.modifiers]
      if (this.error) modifiers.push('hasError')
      return modifiers
    }
  }
}
</script>

<style lang="scss">
.c-field {
  width: 100%;
  margin-bottom: 20px;
}
.c-field__label {
  display: block;
  margin-bottom: 10px;
  font-size: 1rem;
  font-weight: 600;
  letter-spacing: 1px;
  /*text-transform: uppercase;*/
  text-transform: capitalize;
}
</style>
