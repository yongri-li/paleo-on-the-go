<template>
  <div class="pitemaddons">
    <div class="pitemaddons__colum product">
      <div class="pitemaddons__figure">
        <img
          class="pitemaddons__figure--img"
          :src="imageUrl"
          :alt="product.title"
        />
      </div>
      <div class="pitemaddons__info">
        <div class="pitemaddons__info--title">
          {{ product.title }}
        </div>
        <div class="pitemaddons__info--subtitle">
          {{ product.subtitle }}
        </div>
        <div class="pitemaddons__price u-hideTabletUp">
          {{ finalPrice }}
        </div>
        <div class="pitemaddons__qt u-hideTabletUp">
          QTY: {{ product.quantity }}
        </div>
      </div>
    </div>
    <div class="pitemaddons__qt u-hideMobileDown">
      {{ product.quantity }}
    </div>
    <div class="pitemaddons__price u-hideMobileDown">
      {{ finalPrice }}
    </div>
  </div>
</template>

<script>
import { formatPrice } from "@shared/utils";

export default {
  props: {
    product: {
      type: Object,
      required: true,
    },
  },
  computed: {
    imageUrl() {
      const imgFound = this.product.media.find((item) => item.position === 1);
      const urlFinal = imgFound.src
        .replace(".jpg", "_150x150.jpg")
        .replace(".png", "_150x150.png");
      return urlFinal;
    },
    finalPrice() {
      return formatPrice(this.product.price * this.product.quantity);
    },
  },
};
</script>

<style lang="scss" scoped>
.pitemaddons {
  @include media-tablet-up {
    @include flex($align: center);
  }

  &__colum.product {
    @include flex($align: flex-start);

    @include media-tablet-up {
      width: 55%;
      align-items: center;
    }
  }

  &__figure {
    width: 30%;
    margin-right: 5%;

    &--img {
      display: block;
    }

    @include media-tablet-up {
      width: 20%;
    }
  }

  &__info {
    width: 65%;

    &--title {
      font-family: $font-product-title;
      font-size: 1.25rem;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      text-transform: capitalize;
    }

    &--subtitle {
      color: #7b7979;
      font-size: 0.88rem;
    }
  }

  &__price {
    font-size: 1rem;
    margin: 0.5rem 0;

    @include media-tablet-up {
      width: 23%;
      text-align: right;
      margin: 0;
    }
  }

  &__qt {
    font-size: 0.9rem;

    @include media-tablet-up {
      width: 10%;
      font-size: 1rem;
      text-align: center;
    }
  }
}
</style>
