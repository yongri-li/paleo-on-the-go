<template>
  <div class="page o-containerLarge">
    <summary-component class="content-summary" :cart-empty="!hasVisibleCartItems"/>
    <div v-if="hasVisibleCartItems" class="content-box-cart">
      <your-box v-if="cartItems.box.length" />
      <your-cart v-if="visibleCartItems.length" />
    </div>
    <div v-else>
      <your-cart-empty />
    </div>
  </div>
</template>

<script>
import SummaryComponent from "./components/Summary/Summary.vue";
import YourBox from "./components/YourBox/YourBox.vue";
import YourCart from "./components/YourCart/YourCart.vue";
import YourCartEmpty from './components/YourCart/YourCartEmpty.vue'

import { mapState } from "vuex";

export default {
  components: {
    SummaryComponent,
    YourBox,
    YourCart,
    YourCartEmpty
  },
  computed: {
    ...mapState("cartdrawer", ["cartItems", "sizeSelected"]),
    ...mapState("ui", ["test"]),
    visibleCartItems() {
      return this.cartItems.general.filter((item) => item.hide !== true);
    },
    hasVisibleCartItems() {
      return this.visibleCartItems.length || this.cartItems.box.length;
    },
  },
};
</script>

<style lang="scss" scoped>
.page {
  margin-top: 1rem;

  @include media-tablet-up {
    max-width: 1400px;
    margin-top: 3rem;
    @include flex(
      $justify: space-between,
      $align: flex-start,
      $direction: row-reverse,
      $wrap: nowrap
    );

    .content-box-cart {
      padding-right: 1.25rem;
      width: 100%;
    }

    .content-summary {
      width: 280px;
      flex-shrink: 0;
    }
  }

  @include media-desktop-up {
    width: 80%;

    .content-box-cart {
      padding-right: 2.63rem;
    }

    .content-summary {
      width: 310px;
    }
  }
}
</style>
