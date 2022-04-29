<template>
  <div
    :class="[typeClass, haveProductsClass]"
    class="meal-cart__header"
    @click="sendShowCartMobile"
  >
    <div class="meal-cart__header--title">
      MY BOX
    </div>
    <div class="meal-cart__header--items">
      <div class="meal-cart__header--items-qt">
        <span :class="{ warning: warning }">
          {{ cartLength }}
        </span>
        {{ itemsQt }}
      </div>
      <div class="meal-cart__header--items-info">
        {{ itemsInfo }}
      </div>
      <div
        :class="{ show: showCartMobile }"
        class="meal-cart__header--drop-down"
      >
        <svg width="14" height="8" viewBox="0 0 14 8" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M1.15976 1.14645C0.946747 1.34171 0.946747 1.65829 1.15976 1.85355L6.61431 6.85355C6.82732 7.04881 7.17268 7.04881 7.38569 6.85355L12.8402 1.85355C13.0533 1.65829 13.0533 1.34171 12.8402 1.14645C12.6272 0.951185 12.2819 0.951185 12.0689 1.14645L7 5.79289L1.93115 1.14645C1.71814 0.951185 1.37277 0.951184 1.15976 1.14645Z" fill="#231F20" stroke="#231F20" stroke-width="0.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    typeClass: {
      type: String,
      default: 'subscription'
    },
    haveProductsClass: {
      type: String,
      default: 'without-products'
    },
    sizeSelected: {
      type: Object
    },
    cartLength: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      showCartMobile: false
    }
  },
  computed: {
    itemsQt() {
      return  this.sizeSelected.order_type === 'onetime'
              ? ` items`
              : `/${this.sizeSelected.number_size} items`
    },
    itemsInfo() {
      return  this.sizeSelected.order_type === 'onetime'
              ? `${this.sizeSelected.number_size} item minimum`
              : `${this.sizeSelected.discount}% discount`
    },
    warning() {
      const diff = this.cartLength - this.sizeSelected.number_size
      return (diff > 0) && !(this.sizeSelected.order_type === 'onetime')
    }
  },
  methods: {
    sendShowCartMobile() {
      this.showCartMobile = !this.showCartMobile
      this.$emit('changecartmobile', this.showCartMobile)
    }
  }
}
</script>

<style lang="scss" scoped>

$height-header-title: 59px;

.meal-cart__header {
  @include flex($align: flex-end, $justify: space-between);
  padding: .8rem 1rem;
  border-bottom: 1px solid $color-black;
  height: $height-header-title;

  &--title {
    font-family: $font-heading;
    text-transform: uppercase;
    font-size: 2rem;
    line-height: 1.7rem;

    @include media-tablet-up {
      font-size: 3rem;
      padding: 1.5rem 0 1rem;
    }
  }

  &--items {
    @include flex($align: flex-end);

    &-qt {
      text-transform: uppercase;
      letter-spacing: .06em;
      margin-right: .5rem;
      font-weight: 500;
      font-size: 1.2rem;

      .warning {
        color: #EB2020;
      }
    }

    &-info {
      display: none;
    }

  }

  &--drop-down {
    border: 2px solid #231F20;
    box-sizing: border-box;
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 100%;
    transition: all .3s ease;

    svg {
      transform: scale(.5);
    }
  }
  &--drop-down.show {
    transform: rotate(180deg);
  }

  @include media-tablet-up {
    border-bottom: none;
    height: auto;
  }
}

.with-products {
  @include media-tablet-up {
    flex-direction: column;
    align-items: flex-start;
  }

  .meal-cart__header {

    &--title {
      @include media-tablet-up {
        font-family: $font-body;
        font-size: 1.3rem;
        padding: .5rem 0;
        font-weight: 500;
      }
    }

    &--items {
      @include media-tablet-up {
        &-qt {
          font-family: $font-heading;
          font-size: 2.8rem;
          line-height: 2.2rem;
          letter-spacing: initial;
        }

        &-info {
          display: block;
          text-transform: capitalize;
          font-size: 1.2rem;
        }
      }
    }

    &--drop-down {
      @include media-tablet-up {
        display: none;
      }
    }

  }

}

.without-products, .addons {

  .meal-cart__header {

    &--title {
      @include media-tablet-up {
        font-family: $font-heading;
        font-size: 3rem;
        padding: 1.5rem 0 1rem;
      }
    }

    &--items {
      @include media-tablet-up {
        display: none;
      }
    }

  }

}




</style>