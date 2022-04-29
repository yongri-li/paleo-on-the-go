<template>
  <div class="pbtn__add-to-cart">
    <span class="pbtn__add-to-cart--opc"
      @click="reduceToCart({
        idProduct: product.id,
        where
      })"
    >
      -
    </span>
    <span class="pbtn__add-to-cart--qt">
      {{ qtProduct }}
    </span>
    <span class="pbtn__add-to-cart--opc"
      @click="addToCart({
        product,
        where
      })"
    >
      +
    </span>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  props: {
    product: {
      type: Object,
      required: true
    },
    qtProduct: {
      type: Number,
      required: true
    },
    where: {
      type: String,
      required: true
    }
  },
  methods: {
    ...mapActions('babcart', [
      'addToCart',
      'reduceToCart'
    ]),
  }
}
</script>

<style lang="scss" scoped>

.pbtn__add-to-cart {
  @include flex($justify: space-between);
  background-color: $color-white;
  border: 1.5px solid $color-black;

  &--opc {
    cursor: pointer;
    background-color: $color-primary;
    border-radius: 100%;
    width: 30%;
    text-align: center;
    user-select: none;
    font-weight: 500;
  }

}

</style>