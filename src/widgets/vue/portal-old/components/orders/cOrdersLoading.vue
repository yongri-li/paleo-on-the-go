<template>
  <div :class="_buildModifiers('c-ordersLoading', modifiers)">
    <div class="c-ordersLoading__heading c-ordersLoading__blockBase" />
    <div class="c-ordersLoading__subheading c-ordersLoading__blockBase" />
    <c-ordersLoadingBox class="c-ordersLoading__box c-ordersLoading__box--isFirst" 
      :modifiers="['isOpen']"
    />
    <div class="c-ordersLoading__subheading c-ordersLoading__blockBase" />
    <c-ordersLoadingBox class="c-ordersLoading__box" 
      v-for="n in 5"
      :key="`order-box-${n}`"
      :modifiers="['isOpen']"
    />
  </div>
</template>

<script>
import cOrdersLoadingBox from './cOrdersLoadingBox.vue'
export default {
  props: {
    modifiers: {
      type: Array,
      default: () => ([])
    }
  },
  components: { cOrdersLoadingBox }
}
</script>

<style lang="scss">
  .c-ordersLoading__blockBase {
    @include gradient-shimmer;
  }
  .c-ordersLoading__heading {
    width: 420px;
    max-width: 100%;
    height: 44px;
    margin-bottom: 40px;
    border-radius: 3px;
  }
  .c-ordersLoading__subheading {
    width: 140px;
    max-width: 100%;
    height: 20px;
    margin-bottom: 10px;
    border-radius: 3px;
  }
  .c-ordersLoading__box {
    margin-bottom: 40px;
  }
  .c-ordersLoading__box--isFirst {
    margin-bottom: 60px;
  }
</style>