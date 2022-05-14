<template>
  <div class="your-cart">
    <div class="your-cart__title">
      Your Cart
    </div>
    <div class="your-cart__content">
      <div class="your-cart__content--msg">
        your cart is currently empty
      </div>
      <c-button
        class="c-cta your-cart__content--btn"
        @click="goToPage('/pages/bundle')"
        text="Start a Box"
        :modifiers="['isDefault', 'isPrimary', 'hideTextLoading']"
      />
    </div>
  </div>
</template>

<script>
import cButton from "@shared/components/core/cButton.vue";

export default {
  components: {
    cButton
  },
  methods: {
    goToPage(url) {
      window.location = url
    }
  }
}
</script>

<style lang="scss" scoped>
.your-cart {
  margin-bottom: 2rem;

  &__title {
    font-family: $font-heading;
    font-size: 2.63rem;
    text-transform: uppercase;
    margin-bottom: 1rem;

    @include media-tablet-up {
      font-size: 2.5rem;
    }
  }

  &__content {
    &--msg {
      font-family: $font-heading;
      font-size: 1.7rem;
      text-transform: capitalize;
      margin-bottom: 1rem;
    }

    &--btn {
      margin-bottom: 1rem;
    }
  }
}
</style>