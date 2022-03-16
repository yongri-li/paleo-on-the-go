<template>
  <div class="meal-cart">
    <div class="meal-cart__info">
      <meal-cart-header
        :typeClass="typeClass"
        :haveProductsClass="haveProductsClass"
        :sizeSelected="getSizeSelected"
        :cartLength="cartLength"
      />
      <meal-cart-body
        :haveProductsClass="haveProductsClass"
      />
    </div>
    <div class="meal-cart__footer">
      <div class="meal-cart__box-total">
        <div class="meal-cart__box-total--title">
          BOX TOTAL
        </div>
        <div class="meal-cart__box-total--amounts">
          <!-- <div class="meal-cart__box-total--sub">
            $107.97
          </div> -->
          <div class="meal-cart__box-total--final">
            $0.00
          </div>
        </div>
      </div>
      <div class="meal-cart__btn-next">
        Continue
      </div>
    </div>
  </div>
</template>

<script>
import MealCartHeader from './MealCartHeader.vue'
import MealCartBody from './MealCartBody.vue'

import { mapState, mapGetters } from 'vuex'

export default {
  components: {
    MealCartHeader,
    MealCartBody
  },
  computed: {
    ...mapState([
      'cart'
    ]),
    ...mapGetters([
      'getSizeSelected'
    ]),
    haveProductsClass() {
      return this.cart.items.length ? 'with-products' : 'without-products'
    },
    typeClass() {
      const orderType = this.$route.params.box || this.getSizeSelected.order_type
      return orderType
    },
    cartLength() {
      let length = 0
      this.cart.items.forEach(item => {
        length += item.quantity
      })
      return length
    }
  }
}
</script>

<style lang="scss" scoped>

.meal-cart {
  position: fixed;
  left: 0;
  bottom: 0;
  z-index: 100;
  width: 100%;
  height: 90vh;
  background-color: #FEFEFE;
  color: #231F20;
  filter: drop-shadow(0px -4px 34px rgba(0, 0, 0, 0.1));
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border-radius: 20px 20px 0px 0px;

  &__footer {
    box-shadow: 0px 4px 34px rgba(0, 0, 0, 0.1);
    padding: .8rem 1rem;

    @media screen and (min-width: 769px) {
      padding: 0;
    }
  }

  &__box-total {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;

    &--title {
      font-family: 'Knockout';
      text-transform: uppercase;
      font-size: 1.5rem;

      @media screen and (min-width: 769px) {
        font-size: 2rem;
      }
    }

    &--final {
      font-size: 1.2rem;
      font-weight: 500;

      @media screen and (min-width: 769px) {
        font-size: 1.6rem;
      }
    }

    @media screen and (min-width: 769px) {
      padding: .6rem .6rem 0;
    }
  }

  &__btn-next {
    background: #FCD32B;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem 0;
    margin-top: 0.5rem;
    font-weight: 600;

    @media screen and (min-width: 769px) {
      padding: 1.5rem 0;
      font-size: 1.3rem;
      font-weight: 500;
    }
  }

  @media screen and (min-width: 769px) {
    position: relative;
    width: 27%;
    z-index: 0;
    border-radius: 0;
    max-height: 750px;
  }

}

</style>