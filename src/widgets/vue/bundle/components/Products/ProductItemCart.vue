<template>
  <div :class="[typeClass]" class="pitemcart">
    <div class="pitemcart__body">
      <div class="pitemcart__figure">
        <div class="pitemcart__figure--remove" @click="removeProductToCart">x</div>
        <img class="pitemcart__figure--img" :src="imageUrl" :alt="product.title" />
      </div>
      <div class="pitemcart__info">
        <div class="pitemcart__info--title">
          {{ product.title }}
        </div>
        <div class="pitemcart__info--description">
          {{ product.subtitle }}
          <span v-if="product.varTitle">/ {{ product.varTitle }}</span>
        </div>
        <div class="pitemcart__info--price">
          {{ finalPrice }}
        </div>
      </div>
    </div>
    <product-btn-add-to-cart
      class="pitemcart__add-to-cart"
      :product="product"
      :qt-product="product.quantity"
      :where="where"
    />
  </div>
</template>

<script>
import ProductBtnAddToCart from './ProductBtnAddToCart.vue'
import { mapGetters } from 'vuex'
import { formatPriceDollars } from '@shared/utils'
import { REMOVE_PRODUCT_TO_CART } from '@shared/store/modules/babcart/_mutations-type'

export default {
  components: {
    ProductBtnAddToCart
  },
  props: {
    product: {
      type: Object,
      required: true
    },
    typeClass: {
      type: String,
      default: 'subscription'
    },
    where: {
      type: String,
      required: true
    },
    fromPortal: {
      type: Boolean
    }
  },
  computed: {
    ...mapGetters('mealcart', ['getSizeSelected']),
    imageUrl() {
      const imgFound = this.product.media.find(item => item.position === 1)
      const urlFinal = imgFound.src.replace('.jpg', '_150x150.jpg').replace('.png', '_150x150.png')
      return urlFinal
    },
    finalPrice() {
      const discount = (100 - this.getSizeSelected.discount) / 100
      // const price = this.where === 'items' ? (this.product.price * discount) / 100 : this.product.price / 100
      let price
      if (this.where === 'items') price = (this.product.price * discount) / 100
      if (this.where === 'addons') price = this.product.price / 100
      if (this.where === 'general') price = this.product.varPrice / 100
      return formatPriceDollars(price)
    }
  },
  methods: {
    removeProductToCart() {
      this.$store.commit(`babcart/${REMOVE_PRODUCT_TO_CART}`, {
        idProduct: this.product.id,
        where: this.where
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.pitemcart {
  @include flex($justify: space-between);
  margin-top: 1.2rem;

  @include media-desktop-up {
    @include flex($justify: space-between, $wrap: nowrap);
  }

  &:last-child {
    margin-bottom: 1.2rem;
  }

  &__body {
    @include flex($justify: space-between);
    width: 70%;
    @include media-tablet-only {
      width: 100%;
    }
  }

  &__figure {
    position: relative;
    width: 25%;
    display: flex;

    &--img {
      border-radius: 100%;
    }

    &--remove {
      cursor: pointer;
      font-family: $font-heading;
      position: absolute;
      right: -3px;
      top: -6px;
      background-color: $color-black;
      color: $color-white;
      box-shadow: 2px 4px 5px rgb(0 0 0 / 25%);
      border-radius: 100%;
      width: 25px;
      height: 25px;
      @include flex($justify: center);
    }
  }

  &__info {
    width: 70%;

    &--title {
      font-family: $font-product-title;
      font-size: 1rem;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      text-transform: capitalize;
    }

    &--description {
      color: #7b7979;
      font-size: 0.75rem;
    }

    &--price {
      margin-top: 0.38rem;
      font-size: 0.88rem;
      font-weight: 700;
    }
  }

  &__add-to-cart {
    width: 90px;
    font-size: 1.13rem;
    border-radius: 20px;
    padding: 0.2rem;

    @include media-tablet-up {
      margin: 0.5rem 0;
    }

    @include media-tablet-only {
      margin-left: auto;
      margin-right: auto;
    }

    &::v-deep .pbtn__add-to-cart--opc {
      width: 26px;
      height: 26px;
      line-height: 26px;
    }
  }
}

.addons.pitemcart {
  .pitemcart {
    &__body {
      width: 100%;
    }

    &__figure {
      &--remove {
        display: none;
      }
    }

    &__add-to-cart {
      display: none;
    }
  }
}
</style>
