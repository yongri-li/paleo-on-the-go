<template>
  <div class="items">
    <your-box-body-items-info :size-selected="sizeSelected" />
    <div class="items__products">
      <product-item-cart
        v-for="item in items"
        :key="item.id"
        :product="item"
        type-class="addons"
        class="item"
      />
    </div>
  </div>
</template>

<script>
import YourBoxBodyItemsInfo from './YourBoxBodyItemsInfo.vue'
import ProductItemCart from '../Products/ProductItemCart.vue'

export default {
  components: {
    YourBoxBodyItemsInfo,
    ProductItemCart
  },
  props: {
    items: {
      type: Array,
      required: true
    },
    sizeSelected: {
      type: Object,
      required: true
    }
  }
}
</script>

<style lang="scss" scoped>
.items {
  background-color: #EFEDE6;
  padding: .3rem .5rem .5rem;
  margin-bottom: 2rem;

  &__products {
    background-color: $color-white;
    padding: 1rem;

    @include media-tablet-up {
      @include flex();
      padding: 0 .5rem 1rem;

      .item {
        width: 32.6%;
      }
      .item:nth-child(3n+2) {
        margin-left: 1%;
        margin-right: 1%;
      }
    }
  }

}
</style>