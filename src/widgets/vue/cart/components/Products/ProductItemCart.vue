<template>
  <div
    :class="[typeClass]"
    class="pitemcart"
  >
    <div class="pitemcart__body">
      <div class="pitemcart__figure">
        <img
          class="pitemcart__figure--img"
          :src="imageUrl"
          :alt="product.title"
        />
      </div>
      <div class="pitemcart__info">
        <div class="pitemcart__info--title">
          {{ product.title }}
        </div>
        <div class="pitemcart__info--description">
          with dasljdal adsajdla
        </div>
        <div class="pitemcart__info--price">
          {{ finalPrice }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { formatPrice } from '@shared/utils'

export default {
  props: {
    product: {
      type: Object,
      required: true
    },
    typeClass: {
      type: String,
      default: 'subscription'
    }
  },
  computed: {
    imageUrl() {
      const imgFound = this.product.media.find(item => item.position === 1)
      const urlFinal = imgFound.src.replace('.jpg','_150x150.jpg').replace('.png','_150x150.png')
      return urlFinal
    },
    finalPrice() {
      // const discount = this.getSizeSelected.discount / 100
      // const price = this.where === 'addons' ? this.product.price : this.product.price * (1 - discount)
      const price = this.product.price
      return formatPrice(price)
    }
  },
}
</script>

<style lang="scss" scoped>

.pitemcart {
  @include flex($justify: space-between);
  margin-top: 1.2rem;

  &__body {
    @include flex($justify: space-between);
    width: 70%;
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
      @include flex($justify: center)
    }
  }

  &__info {
    width: 70%;

    &--title {
      font-family: $font-heading;
      font-size: 1.5rem;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      text-transform: capitalize;
    }

    &--description {
      color: #7B7979;
      font-size: .9rem;
    }

    &--price {
      margin-top: 0.7rem;
      font-size: 1rem;
      font-weight: 500;
    }
  }

  &__add-to-cart {
    width: 26%;
    font-size: 1.5rem;
    border-radius: 20px;
    padding: 0.2rem;
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