<template>
  <div class="summary">
    <summary-subtotal />
  </div>
</template>

<script>
import SummarySubtotal from './SummarySubtotal.vue'

export default {
  components: {
    SummarySubtotal
  }
}
</script>

<style lang="scss" scoped>
.summary {
  border-bottom: 1px solid #EFEDE6;
  margin-bottom: 2rem;
  padding-bottom: 2rem;
}
</style>