<template>
  <div class="o-container page">
    <div v-html="content"></div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      content: window.Scoutside.policies.content
    }
  }
}
</script>

<style lang="scss" scoped>
.page {
  max-width: 800px;
  margin: 2rem auto 4rem;
}
</style>