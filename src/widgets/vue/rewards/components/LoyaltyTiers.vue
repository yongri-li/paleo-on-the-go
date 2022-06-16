<template>
  <section>
    <c-title-highlight black-text="tiers" />
    <div data-lion-tier-overview></div>
  </section>
</template>

<script>
import cTitleHighlight from './cTitleHighlight.vue'

export default {
  components: {
    cTitleHighlight
  }
}
</script>

<style lang="scss">
#loyaltylion .lion-tier-overview {
  display: flex;
  justify-content: center;
  align-items: stretch;
  align-content: center;
  flex-direction: column;
  padding: 0;
  @include media-tablet-up {
    flex-direction: row;
  }

  .lion-tier-box {
    background-color: $color-ecru;
    border: none;
    flex: none;
    justify-content: flex-end;
    padding: 7px;
    position: relative;
    height: auto;
    min-height: 250px;
    margin: 10px;

    @include media-tablet-up {
      width: 24% !important;
      margin: 0 0.5%;
    }

    &::before {
      content: '';
      display: block;
      width: 70px;
      height: 70px;
      // border: 1px solid red;
      position: absolute;
      top: 25px;
      left: 50%;
      transform: translate(-50%, 0);
      /*      background-image: url('https://cdn.shopify.com/s/files/1/0088/3163/1415/files/icon-make-a-purchase_256x256_crop_center.png');*/
      background-repeat: no-repeat;
      background-position: center;
      background-size: cover;
    }

    &__header {
      padding: 10px;
      display: flex;
      flex-direction: column;
      justify-content: start;
      background-color: transparent;
    }

    &__position {
      display: none;
    }

    &__title {
      font-family: $font-heading;
      font-size: 2rem;
      text-transform: uppercase;
      padding: 0;
      color: $color-black;
    }

    &__sub-title {
      font-family: $font-body;
      font-weight: 500;
      font-size: 1.3rem;
      margin: 0.5rem 0;
    }

    &__benefits-list {
      flex: none;
      display: none;
    }

    &__purchase-rule {
      height: 50px;
      background-color: $color-white;
      @include flex($justify: center);
      font-family: $font-body;
      font-size: 1.3rem;
      font-weight: 500;
      text-transform: capitalize;
      color: $color-black;
      padding: 10px;
    }

    &__footer--current {
      display: none;
    }

    &--current {
      background-color: $color-primary;
    }
  }
}
</style>
