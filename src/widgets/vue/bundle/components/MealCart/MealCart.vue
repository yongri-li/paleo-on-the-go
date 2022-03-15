<template>
  <div class="meal-cart">
    <div class="meal-cart__info">
      <div class="meal-cart__header">
        <div class="meal-cart__header--title">
          MY BOX
        </div>
        <div class="meal-cart__header--items">
          <div class="meal-cart__header--items-qt">
            0/12 ITEMS
          </div>
          <div class="meal-cart__icon-drop-down">
            v
          </div>
        </div>
      </div>
      <div class="meal-cart__body">
        <meal-cart-box-sizes />
        <meal-cart-pre-built />
      </div>
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
import MealCartBoxSizes from './MealCartBoxSizes.vue'
import MealCartPreBuilt from './MealCartPreBuilt.vue'

export default {
  components: {
    MealCartBoxSizes,
    MealCartPreBuilt
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

  &__header {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    padding: .8rem 1rem;
    border-bottom: 1px solid #231F20;

    &--title {
      font-family: 'Knockout';
      text-transform: uppercase;
      font-size: 2rem;
      line-height: 1.7rem;

      @media screen and (min-width: 769px) {
        font-size: 3rem;
        padding-top: 1.5rem;
      }
    }

    &--items {
      display: flex;
      align-items: flex-end;

      &-qt{
        text-transform: uppercase;
        letter-spacing: .06em;
        margin-right: .5rem;
        font-weight: 500;
        font-size: 1.2rem;
      }

      @media screen and (min-width: 769px) {
        display: none;
      }

    }

    @media screen and (min-width: 769px) {
      border-bottom: none;
    }
  }

  &__icon-drop-down {
    border: 2px solid #231F20;
    box-sizing: border-box;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 100%;
  }

  &__body {
    padding: .8rem;
  }

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