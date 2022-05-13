<template>
  <div class="summary">
    <summary-subtotal />
    <summary-route />
  </div>
</template>

<script>
import SummarySubtotal from "./SummarySubtotal.vue";
import SummaryRoute from "./SummaryRoute.vue";

export default {
  components: {
    SummarySubtotal,
    SummaryRoute,
  },
};
</script>

<style lang="scss" scoped>
.summary {
  border-bottom: 1px solid #efede6;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
}
</style>
