<template>
  <div class="c-btnQty">
    <div class="c-btnQty--controls">
      <button class="c-btnQty__btn" @click="$emit('qtyDecrease')">–</button>
      <div class="c-btnQty__qty">
        {{ quantity }}
      </div>
      <button class="c-btnQty__btn" @click="$emit('qtyIncrease')">+</button>
    </div>
  </div>
</template>

<script>
import cIcon from '@shared/components/core/cIcon.vue'
export default {
  name: 'cBtnQty',
  props: {
    quantity: {
      type: Number
    }
  },
  methods: {
    handleQtyIncrease() {
      this.$emit('qtyIncrease')
    }
  },
  components: {
    cIcon
  }
}
</script>

<style lang="scss">
.c-btnQty {
  width: clamp(90px, 10rem, 240px);

  &--controls {
    display: inline-flex;
    height: 42px;
    background-color: transparent;
    border: 2px solid $color-black;
    cursor: pointer;
    text-align: center;
    line-height: 1;
    height: 2.85rem;
    width: 100%;
    max-width: 100%;
    border-radius: 3rem;
    font-weight: 600;
    transition: 200ms;
  }

  &__btn {
    appearance: unset;
    background: unset;
    border: unset;
    cursor: pointer;
    width: 40px;
    font-size: 1.5rem;
    font-weight: 900;
    line-height: 1;
  }

  &__qty {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
