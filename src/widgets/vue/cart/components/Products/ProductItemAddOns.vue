<template>
  <div class="pitemaddons">
    <div class="pitemaddons__colum product">
      <div class="pitemaddons__figure">
        <img
          class="pitemaddons__figure--img"
          src="https://cdn.shopify.com/s/files/1/0088/3163/1415/products/BaconAppleChickenBurger1web_150x150.jpg?v=1575463357"
          alt="Product Title"
        />
      </div>
      <div class="pitemaddons__info">
        <div class="pitemaddons__info--title">
          Product Title
        </div>
        <div class="pitemaddons__info--subtitle">
          with dasljdal adsajdla
        </div>
        <div class="pitemaddons__price u-hideTabletUp">
          $40.95
        </div>
        <div class="pitemaddons__qt u-hideTabletUp">
          QTY: 1
        </div>
      </div>
    </div>
    <div class="pitemaddons__qt u-hideMobileDown">
      1
    </div>
    <div class="pitemaddons__price u-hideMobileDown">
      $40.95
    </div>
  </div>
</template>

<style lang="scss" scoped>
.pitemaddons {

  &__colum.product {
    @include flex($align: flex-start);

    @include media-tablet-up {
      width: 55%;
    }
  }

  &__figure {
    width: 30%;
    margin-right: 5%;

    @include media-tablet-up {
      width: 20%;
    }
  }

  &__info {
    &--title {
      font-family: Knockout,sans-serif;
      font-size: 1.5rem;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      text-transform: capitalize;

      @include media-tablet-up {
        margin-top: .5rem;
      }
    }

    &--subtitle {
      color: #7b7979;
      font-size: .9rem;
    }
  }

  &__price {
    font-size: 1.2rem;
    margin: .5rem 0;

    @include media-tablet-up {
      width: 23%;
      text-align: right;
      margin: 0;
    }
  }

  &__qt {
    font-size: .9rem;

    @include media-tablet-up {
      width: 10%;
      font-size: 1rem;
      text-align: center;
    }
  }
}
</style>