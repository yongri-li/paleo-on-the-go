<template>
  <a
    :href="link"
    :target="targetLink"
    class="icon-text"
  >
    <img
      :src="imgSrc"
      :alt="text"
      class="icon-text__img"
    />
    <span
      v-html="text"
      class="icon-text__span"
    ></span>
  </a>
</template>

<script>
export default {
  props: {
    imgSrc: {
      type: String,
      required: true
    },
    text: {
      type: String,
      required: true
    },
    link: {
      type: String,
      default: '#'
    },
    targetLink: {
      type: String,
      default: '_self'
    }
  }
}
</script>

<style lang="scss" scoped>
.icon-text {
  @include flex($direction: column, $justify: center);

  &__img {
    margin-bottom: 1rem;
  }
}
</style>