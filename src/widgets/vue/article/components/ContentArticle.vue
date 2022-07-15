<template>
  <section class="content-article">
    <a href="/blogs/foods" class="content-article__back link-article"> Back To Blog </a>
    <div v-html="content"></div>
  </section>
</template>

<script>
export default {
  props: {
    content: {
      type: String,
      required: true
    }
  }
}
</script>

<style lang="scss" scoped>
.content-article .link-article {
  margin: 3rem 0;
}
</style>
