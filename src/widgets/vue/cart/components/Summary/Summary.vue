<template>
  <div class="summary">
    <summary-subtotal :class="{ 'cart-empty': cartEmpty }" :cartNote="note" />
    <summary-route v-if="!cartEmpty" />
    <section class="summary__cart-note">
      <label for="CartNote">Order Note:</label>
      <textarea
        name="note"
        id="CartNote"
        placeholder="Add special instructions or details..."
        v-model="note"
      ></textarea>
    </section>
  </div>
</template>

<script>
import SummarySubtotal from './SummarySubtotal.vue'
import SummaryRoute from './SummaryRoute.vue'

export default {
  components: {
    SummarySubtotal,
    SummaryRoute
  },
  props: {
    cartEmpty: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      note: ''
    }
  }
}
</script>

<style lang="scss" scoped>
.summary {
  border-bottom: 1px solid #efede6;
  margin-bottom: 2rem;
  padding-bottom: 1rem;

  &__cart-note {
    border-top: 1px solid #efede6;
    padding: 0.875rem 0.25rem;
    margin-top: 1.25rem;

    label {
      display: block;
      font-size: 1rem;
      margin: 0.25rem 0;
    }

    textarea {
      border-radius: 0;
      font-family: 'Roboto', sans-serif;
      width: 100%;
      min-height: 4.5rem;
      padding: 0.625rem;
    }
  }
}
</style>
