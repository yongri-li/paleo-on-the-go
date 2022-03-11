<template>
  <img :class="_buildModifiers('c-img', modifiers)" v-if="src" :alt="alt ? alt : ''" :src="src" ref="c-img" />
  <c-svg :class="_buildModifiers('c-img', modifiers)" v-else name="noImage" />
</template>

<script>
import cSvg from './cSvg.vue'

export default {
  props: {
    src: {
      type: [String, Boolean],
      required: false
    },
    alt: {
      type: [String, Boolean],
      required: false
    },
    modifiers: {
      type: Array,
      default: () => []
    }
  },
  components: { cSvg },
  mounted() {
    const imageEl = this.$refs['c-img']
    if (imageEl) {
      // const observer = vendors.lozad(imageEl)
      // observer.observe()
    }
  }
}
</script>

<style lang="scss">
.c-img {
  width: 100%;
}
</style>
