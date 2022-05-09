<template>
  <div class="addons">
    <div class="addons__title">
      Add Ons
    </div>
    <product-item-add-ons
      v-for="addon in addons"
      :key="addon.id"
      :product="addon"
      class="addons__content"
    />
  </div>
</template>

<script>
import ProductItemAddOns from '../Products/ProductItemAddOns.vue'

export default {
  props: {
    addons: {
      type: Array,
      required: true
    }
  },
  components: {
    ProductItemAddOns
  },
}
</script>

<style lang="scss" scoped>
.addons {
  &__title {
    text-transform: uppercase;
    font-weight: 700;
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
  }
}
</style>
