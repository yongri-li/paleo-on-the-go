<template>
  <div class="prepare__container">
    <p class="c-p2 prepare__title">{{ this.labels.prepare }}</p>
    <p class="c-p2 prepare__content" v-if="content" v-html="content" />
  </div>
</template>
<script>
export default {
  props: {
    labels: {
      type: Object,
      required: true
    },
    content: {
      type: String
    }
  }
}
</script>

<style lang="scss">
.prepare__container {
  border-bottom: 1px solid $color-white;
  padding-bottom: 27px;
  padding-top: 1px;

  @include media-tablet-up {
    border-bottom: 1px solid transparent;
    padding-bottom: 50px;
  }
}
.prepare__title {
  font-weight: 700;
  letter-spacing: -0.02em;
}
.prepare__content {
  font-size: 17px;
  line-height: 150%;
}
</style>
