<template>
  <div class="addons">
    <div class="addons__title">
      Add Ons
    </div>
    <product-item-add-ons
      class="addons__content"
    />
  </div>
</template>

<script>
import ProductItemAddOns from '../Products/ProductItemAddOns.vue'

export default {
  components: {
    ProductItemAddOns
  },
}
</script>

<style lang="scss" scoped>
.addons {
  &__title {
    text-transform: uppercase;
    font-weight: 500;
    font-size: 1.2rem;
    letter-spacing: .06em;
    margin-bottom: .5rem;

    @include media-tablet-up {
      font-size: 1rem;
    }
  }
  &__content {
    background-color: #efede6;
    padding: .5rem;

    @include media-tablet-up {
      @include flex($align: flex-start);

    }
  }
}
</style>
