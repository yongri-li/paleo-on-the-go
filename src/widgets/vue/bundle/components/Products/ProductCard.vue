<template>
  <div class="pcard">
    <div class="pcard__header">
      <div class="pcard__header--figure">
        <img class="pcard__header--img" src="https://cdn.shopify.com/s/files/1/0088/3163/1415/products/Chicken-Breakfast-Sausage-Patties_101web_5000x.jpg?v=1575463358" alt="imagen test" />
      </div>
      <div class="pcard__info">
        <div class="pcard__info--title">
          Southern Style Braised Brisket
        </div>
        <div class="pcard__info--subtitle">
          with Cauliflower & Spinach
        </div>
        <div class="pcard__add-to-cart">
          <div v-if="addToCartOpen" class="pcard__add-to-cart--open">
            <span class="pcard__add-to-cart--btn">
              -
            </span>
            <span class="pcard__add-to-cart--qt">
              1
            </span>
            <span class="pcard__add-to-cart--btn">
              +
            </span>
          </div>
          <div v-else class="pcard__add-to-cart--first">
            <span>
              +
            </span>
            <span class="pcard__add-to-cart--txt">
              Add
            </span>
          </div>
        </div>
      </div>
    </div>
    <div class="pcard__prices">
      <div class="pcard__price">
        <div class="pcard__price--title pcard__price--data">
          One Time
        </div>
        <div class="pcard__price--number pcard__price--data">
          $19.95
        </div>
      </div>
      <div class="pcard__price">
        <div class="pcard__price--title pcard__price--data">
          8 Items
        </div>
        <div class="pcard__price--number pcard__price--data">
          $18.68
        </div>
      </div>
      <div class="pcard__price selected">
        <div class="pcard__price--title pcard__price--data">
          10 Items
        </div>
        <div class="pcard__price--number pcard__price--data">
          $17.73
        </div>
      </div>
      <div class="pcard__price">
        <div class="pcard__price--title pcard__price--data">
          12 Items
        </div>
        <div class="pcard__price--number pcard__price--data">
          $14.87
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Product Card',
  props: {
    addToCartOpen: {
      type: Boolean,
      default: false
    }
  },
}
</script>

<style lang="scss" scoped>

.pcard {
  background-color: #FEFEFE;
  padding: .5rem;

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    &--figure {
      width: 40%;

      @media screen and (min-width: 769px){
        width: 100%;
      }
    }

    @media screen and (min-width: 769px){
      flex-direction: column;
    }

  }

  &__info {
    width: 55%;
    position: relative;

    &--title {
      color: #231F20;
      font-family: 'Knockout', sans-serif;
      font-size: 1.5rem;
      line-height: 110%;
      letter-spacing: -0.02em;
      text-transform: capitalize;
    }

    &--subtitle {
      color: #7B7979;
      font-size: .8rem;
    }

    @media screen and (min-width: 769px){
      width: 100%;
      padding: .3rem;
    }

  }

  &__add-to-cart {
    margin-top: 1rem;
    font-weight: bold;
    color: #231F20;

    &--first {
      cursor: pointer;
      background-color: #fcd32b;
      padding: 0.5rem 1rem;
      width: 48%;
      border-radius: 20px;
      display: flex;
      align-items: center;
      justify-content: space-evenly;

      @media screen and (min-width: 769px) {

        background-color: #fefefe;
        padding: 0;
        width: 17%;
        border-radius: 100%;
        border: 1.5px solid #231f20;

      }

    }

    &--open {
      background-color: #FEFEFE;
      padding: .2rem;
      width: 60%;
      border-radius: 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 1.6rem;

      @media screen and (min-width: 769px) {

        padding: .2rem;
        border: 1.5px solid #231f20;
        border-radius: 30px;
        font-size: 2.2rem;

      }
    }

    &--btn {
      background-color: #fcd32b;
      border-radius: 100%;
      width: 25%;
      text-align: center;
      cursor: pointer;
    }

    @media screen and (min-width: 769px) {

      margin: 0;
      position: absolute;
      left: 0;
      top: -85%;
      width: 100%;
      display: flex;
      justify-content: center;
      font-size: 2.5rem;

      &--txt {
        display: none;
      }

      &--qt {
        font-size: 1.8rem;
      }

    }
  }

  &__prices {
    display: flex;
    justify-content: flex-start;
    width: 100%;
    margin-top: .5rem;
    background-color: #FEFEFE;

    @media screen and (min-width: 769px){
      padding: 0 .3rem;
    }
  }

  &__price {
    display: flex;
    flex-direction: column;
    text-align: center;
    width: 25%;

    &--data {
      font-weight: bold;
      border: 1px solid #EFEDE6;
      box-sizing: border-box;
      padding: .3rem 0;
    }

    &--title {
      color: #231F20;
      text-transform: uppercase;
      font-size: .8rem;
    }

    &--number {
      color: #4F4C4D;
      font-size: 1rem;
    }
  }

}

.active {
  background-color: #231F20;

  .pcard__info {

    &--title {
      color: #FEFEFE;
    }

    &--subtitle {
      color: #FEFEFE;
    }

  }

}

.selected {

  background-color: #231F20;

  .pcard__price {

    &--data {
      color: #FEFEFE;
    }

  }
}

</style>