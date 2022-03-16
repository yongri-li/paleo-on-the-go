<template>
  <div v-if="product"
    :class="{ active: isItemInCart }"
    class="pcard"
  >
    <div class="pcard__header">
      <div class="pcard__header--figure">
        <img
          class="pcard__header--img"
          :src="imageUrl"
          :alt="product.title"
        />
      </div>
      <div class="pcard__info">
        <div class="pcard__info--title">
          {{ product.title }}
        </div>
        <div class="pcard__info--subtitle">
          this is for metafields subtitles
        </div>
        <div class="pcard__add-to-cart">
          <div v-if="isItemInCart"
            class="pcard__add-to-cart--open"
          >
            <span class="pcard__add-to-cart--btn"
              @click="reduceToCart(product.id)"
            >
              -
            </span>
            <span class="pcard__add-to-cart--qt">
              {{ qtItem }}
            </span>
            <span class="pcard__add-to-cart--btn"
              @click="addToCart({
                idCollection: product.collection.id,
                idProduct: product.id
              })"
            >
              +
            </span>
          </div>
          <div v-else
            class="pcard__add-to-cart--first"
            @click="addToCart({
              idCollection: product.collection.id,
              idProduct: product.id
            })"
          >
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
      <div
        v-for="box in boxesPricingScale"
        :key="box.val"
        :class="{ selected: box.selected }"
        class="pcard__price">
        <div class="pcard__price--title pcard__price--data">
          {{ box.title }}
        </div>
        <div class="pcard__price--number pcard__price--data">
          {{ box.price }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import { formatPrice } from '../../utils'

export default {
  name: 'ProductCard',
  props: {
    product: {
      type: Object,
      default: null
    },
    addToCartOpen: {
      type: Boolean,
      default: false
    },
  },
  computed: {
    ...mapState([
      'sizes'
    ]),
    ...mapGetters([
      'getItemFromCartByID',
      'getSizeSelected'
    ]),
    imageUrl() {
      const imgFound = this.product.media.find(item => item.position === 1)
      const urlFinal = imgFound.src.replace('.jpg','_450x450.jpg').replace('.png','_450x450.png')
      return urlFinal
    },
    boxesPricingScale() {
      return this.sizes.map(size => {
        const selected = this.getSizeSelected.val === size.val
        const discount = size.discount / 100
        const price = this.product.price * (1 - discount)

        return {
          title: size.title,
          price: formatPrice(price),
          val: size.val,
          selected: selected
        }
      })
    },
    itemInCart() {
      return this.getItemFromCartByID(this.product.id)
    },
    isItemInCart() {
      return !!this.itemInCart
    },
    qtItem() {
      return this.itemInCart?.quantity || 0
    }
  },
  methods: {
    ...mapActions([
      'addToCart',
      'reduceToCart'
    ]),
  }
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
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;

      @media screen and (min-width: 769px){
        height: 53px;
      }
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
      -webkit-user-select: none;
      user-select: none;
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

  .pcard__price--data {
    background-color: $color-black;
    color: $color-white;
  }

}

</style>