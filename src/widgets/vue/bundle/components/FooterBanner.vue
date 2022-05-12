<template>
  <div :class="{ 'one-time': title }" class="footer-banner">
    <div v-if="title" class="footer-banner__title">
      {{ title }}
    </div>
    <div v-for="item in items" :key="item.text" class="footer-banner__item">
      <div class="footer-banner__item--icon">
        <img :src="item.icon" :alt="item.text" />
      </div>
      <div class="footer-banner__item--txt">
        {{ item.text }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    items: {
      type: Array,
      default: [],
    },
    title: {
      type: String,
      default: null,
    },
  },
};
</script>

<style lang="scss" scoped>
.footer-banner {
  background-color: $color-black;
  color: $color-white;
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: 2;
  width: 100%;
  padding: 0.5rem 0;
  @include flex($justify: space-evenly);

  &__title {
    font-family: $font-heading;
    text-transform: uppercase;
  }

  &__item {
    @include flex($justify: center, $wrap: nowrap);
    max-width: 25%;

    &--icon {
      margin-right: 0.63rem;
      flex-shrink: 0;
      display: flex;
      img {
        width: 26px;
        height: 26px;
      }
    }

    &--txt {
      text-transform: capitalize;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      width: 100%;
      font-size: 0.88rem;
      font-weight: 700;
    }
  }

  @media screen and (max-width: 768px) {
    display: none;
  }
}

.one-time {
  .footer-banner {
    &__title {
      color: $color-primary;
    }
  }
}
</style>
