<template>
  <div class="page o-containerLarge">
    <!-- <summary-component class="content-summary" />
    <div class="content-box-cart">
      <your-box v-if="cart.items.length"/>
    </div> -->
    Pruebaaa
  </div>
</template>

<script>
import SummaryComponent from './components/Summary/Summary.vue'
import YourBox from './components/YourBox/YourBox.vue'

import { mapState } from 'vuex'

export default {
  components: {
    SummaryComponent,
    YourBox
  },
  computed: {
    ...mapState('cartdrawer',[
      'cart',
      'sizes'
    ]),
    ...mapState('ui',[
      'test'
    ])
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
