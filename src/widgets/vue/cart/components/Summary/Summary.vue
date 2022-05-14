<template>
  <div class="summary">
    <summary-subtotal :class="{ 'cart-empty':cartEmpty }"/>
    <summary-route v-if="!cartEmpty"/>
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
  props: {
    cartEmpty: {
      type: Boolean,
      required: true
    }
  }
};
</script>

<style lang="scss" scoped>
.summary {
  border-bottom: 1px solid #efede6;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
}
</style>
