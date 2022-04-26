<template>
  <div class="pagination">
    <a
      v-if="linkPrev"
      :href="linkPrev"
      class="pagination__link link-article"
    >
      Older Post
    </a>
    <span v-else></span>
    <a
      v-if="linkNext"
      :href="linkNext"
      class="pagination__link link-article"
    >
      Newer Post
    </a>
  </div>
</template>

<script>
export default {
  props: {
    linkPrev: {
      type: String,
      default: ''
    },
    linkNext: {
      type: String,
      default: ''
    }
  }
}
</script>

<style lang="scss" scoped>
.pagination {
  @include flex($justify: space-between);
  border-top: 1px solid $color-ecru;
  border-bottom: 1px solid $color-ecru;
  margin-top: 3rem;

  @include media-tablet-up {
    padding: 2rem 0;
  }
}
</style>