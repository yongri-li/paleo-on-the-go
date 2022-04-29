<template>
  <div class="hero-ancillary">
    <img
      :src="mobileBackground"
      :alt="text"
      class="u-hideTabletUp"
    />
    <img
      :src="deskBackground"
      :alt="text"
      class="u-hideMobileDown u-showTabletUp"
    />
    <div
      class="c-h1 hero-ancillary__text"
      :class="{ 'u-hide': text.length === 0 }"
    >
      {{ text }}
    </div>
  </div>
</template>

<script>
export default {
  props: {
    deskBackground: {
      type: String,
      required: true
    },
    mobileBackground: {
      type: String,
      required: true
    },
    text: {
      type: String,
      default: ''
    }
  }
}
</script>

<style lang="scss" scoped>
.hero-ancillary {
  position: relative;

  img {
    width: 100%;
    height: auto;
  }

  &__text {
    color: $color-white;
    position: absolute;
    top: 50%;
    left: 5%;
    transform: translate(0, -50%);

    @include media-tablet-up {
      left: 50%;
      transform: translate(-50%, -50%);
      color: $color-black;
      background-color: $color-white;
      padding: 1rem 2rem;
    }
  }
}
</style>