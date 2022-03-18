<template>
  <div
    :class="[typeClass, haveProductsClass]"
    class="meal-cart__header"
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
      <div class="meal-cart__header--drop-down">
        v
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
      return diff > 0
    }
  }
}
</script>

<style lang="scss" scoped>

.meal-cart__header {
  @include flex($align: flex-end, $justify: space-between);
  padding: .8rem 1rem;
  border-bottom: 1px solid $color-black;

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
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 100%;
  }

  @include media-tablet-up {
    border-bottom: none;
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