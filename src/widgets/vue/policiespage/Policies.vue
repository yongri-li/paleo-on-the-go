<template>
  <div class="o-container page">
    <div class="c-h1">
      {{ header }}
    </div>
    <div v-html="body"></div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      header: window.Scoutside.policies.content.header,
      body: window.Scoutside.policies.content.body
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