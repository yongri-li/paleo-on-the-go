<template>
  <div class="c-richtext">
    <div :class="headerClass">
      {{ header }}
    </div>
    <div v-html="body"></div>
  </div>
</template>

<script>
export default {
  props: {
    header: {
      type: String
    },
    headerClass: {
      type: String,
      default: 'c-h1'
    },
    body: {
      type: String,
      required: true
    }
  }
}
</script>