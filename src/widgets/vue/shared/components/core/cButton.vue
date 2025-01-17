<template>
  <button :class="_buildModifiers(baseClass, extendedModifiers)" v-bind="attributes" @click="$emit('click')">
    <slot name="before" />
    <c-loading :class="`${baseClass}__loading`" v-if="loading" :modifiers="modifiers" />
    <c-svg :class="`${baseClass}__success`" v-if="success" name="success" />
    <span :class="`${baseClass}__text`" v-if="buttonText" v-html="buttonText" />
    <slot />
  </button>
</template>

<script>
import cLoading from './cLoading.vue'
import cSvg from './cSvg.vue'

export default {
  props: {
    type: {
      type: String,
      default: 'button'
    },
    url: {
      type: String,
      required: false
    },
    text: {
      type: [Object, String, Number],
      required: false
    },
    loading: {
      type: Boolean,
      default: false
    },
    success: {
      type: Boolean,
      default: false
    },
    status: {
      type: [Boolean, String]
    },
    attributes: {
      type: Object,
      default: () => ({})
    },
    modifiers: {
      type: Array,
      default: () => []
    }
  },
  components: { cLoading, cSvg },
  computed: {
    baseClass() {
      return `c-${this.type}`
    },
    extendedModifiers() {
      let modifiers = [...this.modifiers]
      if (this.loading) modifiers.push('isLoading')
      if (this.success) modifiers.push('isSuccess')
      return modifiers
    },
    buttonText() {
      const { loading, success, text, status } = this
      const textDefault = text?.default ? text.default : text
      if (status === 'error') return text.error
      if (status === 'applied') return text.remove
      if (status === 'removed') return text.removed
      if (loading) return text.loading ? text.loading : textDefault
      if (success) return text.success ? text.success : textDefault
      return textDefault
    }
  }
}
</script>

<style lang="scss">
.c-button--isLoading {
  pointer-events: none;
}
.c-button__text {
  .c-button--isLoading.c-button--hideTextLoading & {
    opacity: 0;
  }
}
.c-button__loading {
  .c-button--hideTextLoading & {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
}
.c-button__success {
  width: 16px;
  margin: 0 0.25rem;
}

/*//asd*/
</style>
