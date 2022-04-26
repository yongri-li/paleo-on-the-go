<template>
  <section class="c-hero__imgBg" :style="bgImage">
    <div class="c-hero__imgBg--copy">
      <h1 class="c-h1">
        {{ content.title }}
      </h1>
    </div>
  </section>
</template>

<script>
export default {
  props: {
    content: {
      type: Object,
      required: true
    }
  },
  computed: {
    bgImage() {
      return `background-image: url(${this.content.bg_image})`
    }
  }
}
</script>

<style lang="scss" scoped>
.c-hero__imgBg {
  place-content: end;
  place-items: flex-start;
  height: 65vh;

  &--copy {
    margin-left: 1rem;
    margin-bottom: 0;
    width: 90%;

    @include media-tablet-up {
      margin-left: 6rem;
      margin-bottom: 6rem;
      width: 35%;
    }

    h1 {
      margin-bottom: .5rem;
      color: $color-white;
    }
  }
}
</style>
