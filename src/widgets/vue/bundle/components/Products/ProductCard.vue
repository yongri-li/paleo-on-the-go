<template>
  <div v-if="product" :class="{ active: isProductInCart, 'out-of-stock': outOfStock }" class="pcard">
    <div class="pcard__header">
      <div class="pcard__header--figure" @click="openModal">
        <span v-if="flag" :class="`pcard__header--flag pcard__header--flag--${flagHandle}`">
          {{ flag }}
        </span>
        <img class="pcard__header--img" :src="imageUrl" :alt="product.title" />
      </div>
      <div class="pcard__info">
        <div class="pcard__info--title" @click="openModal">
          {{ product.title }}
        </div>
        <div class="pcard__info--subtitle">
          {{ product.subtitle }}
        </div>
        <div class="pcard__add-to-cart">
          <product-btn-add-to-cart
            v-if="isProductInCart"
            :product="product"
            :qt-product="qtProduct"
            :where="where"
            class="pcard__add-to-cart--open"
          />
          <div v-else class="pcard__add-to-cart--first" @click="addItemFunc({ product, where })">
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
import { MODAL_SETUP } from '../../store/modules/modals/_mutations-type'
import { formatPrice, handleize, getOutOfStock, formatPriceDollars } from '@shared/utils'
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
    ...mapState('mealcart', ['sizes']),
    ...mapGetters('mealcart', ['getSizeSelected']),
    ...mapGetters('babcart', ['getProductFromCartByID']),
    imageUrl() {
      const imgFound = this.product.media.find(item => item.position === 1)
      const urlFinal = imgFound.src.replace('.jpg', '_450x450.jpg').replace('.png', '_450x450.png')
      return urlFinal
    },
    boxesPricingScale() {
      return this.sizes.map(size => {
        const selected = this.getSizeSelected.val === size.val
        const discount = (100 - size.discount) / 100
        const price = (this.product.price * discount) / 100

        return {
          title: size.title,
          price: formatPriceDollars(price),
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
    },
    outOfStock() {
      const inventoryData = this.product.inventory[0]
      const tags = this.product.tags

      return getOutOfStock({ tags, inventoryData })
    },
    flag() {
      return this.outOfStock ? 'Out Of Stock' : this.product.flag
    },
    flagHandle() {
      return this.flag ? handleize(this.flag) : null
    },
    isSwag() {
      return this.product.tags.includes('swag') || this.product.type === 'Shirts'
    }
  },
  methods: {
    ...mapActions('babcart', ['addToCart']),
    openModal() {
      this.$store.commit(`modals/${MODAL_SETUP}`, {
        component: 'ModalProduct',
        settings: {
          params: {
            product: this.product,
            outOfStock: this.outOfStock
          }
        }
      })
    },
    addItemFunc({ product, where }) {
      if (this.isSwag) {
        this.openModal()
      } else {
        this.addToCart({ product, where })
      }
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
      position: relative;

      @include media-tablet-up {
        width: 100%;
      }

      img {
        display: block;
      }
    }

    &--flag {
      position: absolute;
      background-color: $color-black;
      color: $color-primary;
      font-size: 0.75rem;
      font-weight: 500;
      padding: 0.5rem 0.94rem;
      // z-index: 9;
      min-width: 100px;
      @include flex($justify: center);
    }

    &--flag--seasonal-item {
      background-color: $color-primary;
      color: $color-black;
    }

    &--flag--most-popular {
      background-color: $color-secondary;
      color: $color-black;
    }

    &--flag--out-of-stock {
      background-color: #c63636;
      color: #fefefe;
      text-transform: uppercase;
    }

    @include media-tablet-up {
      font-size: 0.88rem;
      flex-direction: column;
    }
  }

  &__info {
    width: 55%;
    position: relative;

    @include media-tablet-up {
      height: 84px;
      margin-bottom: 1rem;
    }

    &--title {
      color: #231f20;
      font-family: $font-product-title;
      font-size: 1rem;
      line-height: 110%;
      letter-spacing: -0.02em;
      text-transform: capitalize;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      margin-top: 0.75rem;
      margin-bottom: 0.2rem;

      @include media-tablet-up {
        /*height: 1.38rem;*/
        font-size: 1.25rem;
        -webkit-line-clamp: 2;
      }
    }

    &--subtitle {
      color: #7b7979;
      font-size: 0.75rem;
      line-height: 135%;
      @include media-tablet-up {
        font-size: 0.88rem;
      }
    }

    @include media-tablet-up {
      width: 100%;
      padding: 0.3rem;
    }
  }

  &__add-to-cart {
    margin-top: 1rem;
    font-weight: bold;
    color: #231f20;

    &::v-deep .pbtn__add-to-cart--opc {
      width: 26px;
      height: 26px;
      line-height: 26px;
      @include media-tablet-up {
        width: 40px;
        height: 40px;
        line-height: 40px;
      }
    }

    &--first {
      cursor: pointer;
      background-color: #fcd32b;
      padding: 0.5rem 1rem;
      width: 80px;
      border-radius: 20px;
      display: flex;
      align-items: center;
      justify-content: space-evenly;
      font-size: 1rem;

      @include media-tablet-up {
        background-color: #fefefe;
        padding: 0;
        width: 3.25rem;
        height: 3.25rem;
        border-radius: 100%;
        border: 1.5px solid #231f20;
        font-size: 2rem;
      }
    }

    &--open {
      padding: 0.2rem;
      width: 90px;
      border-radius: 20px;
      font-size: 1.13rem;

      @include media-tablet-up {
        width: 180px;
        font-size: 1.5rem;
        border-radius: 30px;
      }
    }

    @include media-tablet-up {
      margin: 0;
      position: absolute;
      left: 0;
      top: -60px;
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

    @include media-tablet-up {
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
      font-size: 0.75rem;
      overflow: hidden;
      white-space: nowrap;
    }

    &--number {
      color: #4f4c4d;
      font-size: 0.94rem;
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

.out-of-stock {
  .pcard {
    &__info {
      opacity: 0.5;
    }
    &__add-to-cart {
      display: none;
    }
  }
}
</style>
