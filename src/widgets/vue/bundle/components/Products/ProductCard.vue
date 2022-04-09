<template>
  <div v-if="product" :class="{ active: isProductInCart }" class="pcard">
    <div class="pcard__header">
      <div class="pcard__header--figure" @click="openModal">
        <img class="pcard__header--img" :src="imageUrl" :alt="product.title" />
      </div>
      <div class="pcard__info">
        <div class="pcard__info--title" @click="openModal">
          {{ product.title }}
        </div>
        <div class="pcard__info--subtitle">this is for metafields subtitles</div>
        <div class="pcard__add-to-cart">
          <product-btn-add-to-cart
            v-if="isProductInCart"
            :id-collection="product.collection.id"
            :id-product="product.id"
            :qt-product="qtProduct"
            :where="where"
            class="pcard__add-to-cart--open"
          />
          <div
            v-else
            class="pcard__add-to-cart--first"
            @click="
              addToCart({
                idCollection: product.collection.id,
                idProduct: product.id,
                where
              })
            "
          >
            <span> + </span>
            <span class="pcard__add-to-cart--txt"> Add </span>
          </div>
        </div>
      </div>
    </div>
    <div class="pcard__prices" @click="openModal">
      <div v-if="typeOrder === 'addons'" class="pcard__price--addons">
        <div class="pcard__price--number">
          {{ boxesPricingScale[0].price }}
        </div>
      </div>
      <div
        v-else
        v-for="box in boxesPricingScale"
        :key="box.val"
        :class="{ selected: box.selected }"
        class="pcard__price"
      >
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
import { MODAL_SETUP } from '@shared/cartdrawer/store/_mutations-type'
import { formatPrice } from '../../utils'
import ProductBtnAddToCart from './ProductBtnAddToCart.vue'

export default {
  name: 'ProductCard',
  components: {
    ProductBtnAddToCart
  },
  props: {
    product: {
      type: Object,
      default: null,
      required: true
    },
    addToCartOpen: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapState(['sizes']),
    ...mapGetters(['getProductFromCartByID', 'getSizeSelected']),
    imageUrl() {
      const imgFound = this.product.media.find(item => item.position === 1)
      const urlFinal = imgFound.src.replace('.jpg', '_450x450.jpg').replace('.png', '_450x450.png')
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
    where() {
      const param = this.$route.params.box
      return param === 'addons' ? 'addons' : 'items'
    },
    productInCart() {
      return this.getProductFromCartByID({
        id: this.product.id,
        where: this.where
      })
    },
    isProductInCart() {
      return !!this.productInCart
    },
    qtProduct() {
      return this.productInCart?.quantity || 0
    },
    typeOrder() {
      return this.$route.params.box
    }
  },
  methods: {
    ...mapActions(['addToCart', 'reduceToCart']),
    openModal() {
      this.$store.commit(MODAL_SETUP, {
        component: 'ModalProduct',
        settings: {
          params: {
            product: this.product
          }
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.pcard {
  background-color: #fefefe;
  padding: 0.5rem;

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    &--figure {
      width: 40%;

      @media screen and (min-width: 769px) {
        width: 100%;
      }
    }

    @media screen and (min-width: 769px) {
      flex-direction: column;
    }
  }

  &__info {
    width: 55%;
    position: relative;

    &--title {
      color: #231f20;
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

      @media screen and (min-width: 769px) {
        height: 53px;
      }
    }

    &--subtitle {
      color: #7b7979;
      font-size: 0.8rem;
    }

    @media screen and (min-width: 769px) {
      width: 100%;
      padding: 0.3rem;
    }
  }

  &__add-to-cart {
    margin-top: 1rem;
    font-weight: bold;
    color: #231f20;

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
        width: 3.5rem;
        height: 3.5rem;
        border-radius: 100%;
        border: 1.5px solid #231f20;
      }
    }

    &--open {
      padding: 0.2rem;
      width: 60%;
      border-radius: 20px;
      font-size: 1.6rem;

      @include media-tablet-up {
        width: 50%;
        font-size: 2.2rem;
        border-radius: 30px;
      }
    }

    @include media-tablet-up {
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
    margin-top: 0.5rem;

    @media screen and (min-width: 769px) {
      padding: 0 0.3rem;
    }
  }

  &__price {
    display: flex;
    flex-direction: column;
    text-align: center;
    width: 25%;
    background-color: #fefefe;

    &--data {
      font-weight: bold;
      border: 1px solid #efede6;
      box-sizing: border-box;
      padding: 0.3rem 0;
    }

    &--title {
      color: #231f20;
      text-transform: uppercase;
      font-size: 0.8rem;
    }

    &--number {
      color: #4f4c4d;
      font-size: 1rem;
    }

    &--addons {
      font-weight: 500;

      @include media-tablet-up {
        padding: 0.8rem 0 1rem;
      }
    }
  }
}

.active {
  background-color: #231f20;

  .pcard {
    &__info {
      &--title {
        color: #fefefe;
      }

      &--subtitle {
        color: #fefefe;
      }
    }

    &__price--addons {
      .pcard__price--number {
        color: $color-white;
      }
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
