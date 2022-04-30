<template>
  <div class="page o-containerLarge">
    <summary-component class="content-summary" />
    <div v-if="hasVisibleCartItems" class="content-box-cart">
      <your-box v-if="cartItems.box.length"/>
      <your-cart v-if="visibleCartItems.length"/>
    </div>
    <div v-else>
      Cart is Empty
    </div>
  </div>
</template>

<script>
import SummaryComponent from './components/Summary/Summary.vue'
import YourBox from './components/YourBox/YourBox.vue'
import YourCart from './components/YourCart/YourCart.vue'

import { mapState } from 'vuex'

export default {
  components: {
    SummaryComponent,
    YourBox,
    YourCart
  },
  computed: {
    ...mapState('cartdrawer',[
      'cartItems',
      'sizeSelected'
    ]),
    ...mapState('ui',[
      'test'
    ]),
    visibleCartItems() {
      return this.cartItems.general.filter(item => item.hide !== true)
    },
    hasVisibleCartItems() {
      return this.visibleCartItems.length || this.cartItems.box.length
    }
  }
}
</script>

<style lang="scss" scoped>
.page {
  margin-top: 1rem;

  @include media-tablet-up {
    width: 80%;
    max-width: 1400px;
    margin-top: 3rem;
    @include flex($justify: space-between, $align: flex-start, $direction: row-reverse);

    .content-box-cart {
      width: 68%;
    }

    .content-summary {
      width: 28%;
    }
  }
}
</style>
