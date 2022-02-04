<template>
  <span v-html="svg" class="c-icon" />
</template>

<script>
export default {
  props: ['icon'],
  data() {
    return { svg: false }
  },
  mounted() {
    this.svg = require(`./icons/${this.icon}`).default
  }
}
</script>
