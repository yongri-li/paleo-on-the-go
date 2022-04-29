<template>
  <div class="c-tile">
    <img
      class="c-tile__image"
      :src="tile.img"
    />
    <div
      v-if="tile.title"
      class="c-h3 c-tile__title"
    >
      {{ tile.title }}
    </div>
    <div
      v-if="tile.subtitle"
      class="c-tile__subtitle"
    >
      {{ tile.subtitle }}
    </div>
    <p v-html="tile.text" class="c-tile__text"></p>
  </div>
</template>

<script>
export default {
  props: {
    tile: {
      type: Object,
      required: true
    }
  }
}
</script>

<style lang="scss" scoped>
.c-tile {

  max-width: 500px;

  &__title {
    margin-bottom: 0;
  }

  &__subtitle {
    color: $color-secondary;
    text-transform: capitalize;
    text-decoration: underline;
    font-size: 1.2rem;
    font-weight: 500;
  }

  &__text {
    margin-top: 1rem;
  }
}
</style>