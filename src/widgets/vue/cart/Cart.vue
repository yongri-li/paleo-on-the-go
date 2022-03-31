<template>
  <div class="page o-containerLarge">
    <summary-component class="content-summary" />
    <div class="content-box-cart">
      <your-box />
    </div>
  </div>
</template>

<script>
import SummaryComponent from './components/Summary/Summary.vue'
import YourBox from './components/YourBox/YourBox.vue'

export default {
  components: {
    SummaryComponent,
    YourBox
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
