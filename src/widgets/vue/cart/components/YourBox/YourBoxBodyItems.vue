<template>
  <div class="items">
    <your-box-body-items-info />
    <div class="items__products">
      <product-item-box
        v-for="item in filteredItems"
        :key="item.id"
        :product="item"
        type-class="addons"
        class="item"
      />
    </div>
  </div>
</template>

<script>
import YourBoxBodyItemsInfo from "./YourBoxBodyItemsInfo.vue";
import ProductItemBox from "../Products/ProductItemBox.vue";

export default {
  components: {
    YourBoxBodyItemsInfo,
    ProductItemBox,
  },
  props: {
    items: {
      type: Array,
      required: true,
    },
  },
  computed: {
    filteredItems() {
      return this.items.filter((item) => item.hide !== true);
    },
  },
};
</script>

<style lang="scss" scoped>
.items {
  background-color: #efede6;
  padding: 0.3rem 0.5rem 0.5rem;
  margin-bottom: 2rem;

  &__products {
    background-color: $color-white;
    padding: 1rem;

    @include media-tablet-up {
      @include flex();
      padding: 0 0.5rem 1rem;
    }

    @include media-tablet-only {
      .item {
        width: 48%;
      }
      .item:nth-child(even) {
        margin-left: 1%;
        margin-right: 1%;
      }
    }

    @include media-desktop-up {
      .item {
        width: 32.6%;
      }

      .item:nth-child(3n + 2) {
        margin-left: 1%;
      }
    }
  }
}
</style>
