<template>
  <div class="footer-banner one-time">
    <div v-if="title" class="footer-banner__title">
      {{ title }}
    </div>
    <div v-for="item in items" :key="item"
      class="footer-banner__item">
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
      default: []
    },
    title: {
      type: String,
      default: null
    }
  }
}
</script>

<style lang="scss" scoped>

.footer-banner {
  background-color: #231F20;
  color: #fefefe;
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: 2;
  width: 100%;
  padding: .5rem 0;
  display: flex;
  align-items: center;
  justify-content: space-evenly;

  &__title {
    font-family: 'Knockout', sans-serif;
    text-transform: uppercase;
  }

  &__item {
    display: flex;
    align-items: center;

    &--icon {
      margin-right: .5rem;
    }

    &--txt {
      text-transform: capitalize;
    }

  }

  @media screen and (max-width: 768px) {
    display: none;
  }

}

.one-time {

  .footer-banner {
    &__title {
      color: #FCD32B;
    }
  }

}

</style>