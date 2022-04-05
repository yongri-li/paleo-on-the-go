<template>
  <div class="meal-cart__footer">
    <div class="meal-cart__box-total">
      <div class="meal-cart__box-total--title">
        BOX TOTAL
      </div>
      <div class="meal-cart__box-total--amounts">
        <div v-if="subtotal > 0"
          class="meal-cart__box-total--sub">
          {{ subtotalFormat }}
        </div>
        <div class="meal-cart__box-total--final">
          {{ final }}
        </div>
      </div>
    </div>
    <div
      :class="{ disable: notContinue }"
      class="meal-cart__btn-next"
      @click="nextStep"
    >
      {{ ctabtn }}
    </div>
  </div>
</template>

<script>
import { formatPrice } from '@shared/utils'

export default {
  props: {
    subtotal: {
      type: Number,
      required: true
    },
    sizeSelected: {
      type: Object,
      required: true
    },
    cartLength: {
      type: Number,
      required: true
    },
    cartAddOns: {
      type: Number,
      required: true
    },
    typeClass: {
      type: String,
      default: 'subscription'
    },
  },
  data() {
    return {
      notContinue: false
    }
  },
  computed: {
    final() {
      const discount = this.sizeSelected.discount / 100
      const total = this.subtotal * (1 - discount) + this.cartAddOns
      return total === 0 ? '$0.00' : formatPrice(total)
    },
    subtotalFormat() {
      return formatPrice(this.subtotal + this.cartAddOns)
    },
    ctabtn() {
      if(this.cartLength === 0) {
        this.notContinue = true
        return 'Add items to Continue'
      }

      const diff = this.cartLength - this.sizeSelected.number_size
      if(diff > 0) {
        this.notContinue = true
        return `Remove ${diff} items to Continue`
      }

      if(diff < 0) {
        this.notContinue = true
        return `Add ${diff * -1} items to Continue`
      }

      if(this.cartAddOns === 0 && this.typeClass === 'addons') {
        this.notContinue = false
        return `No Thanks Continue to Checkout`
      }

      if(this.typeClass === 'subscription') {
        this.notContinue = false
        return 'Continue'
      }

      this.notContinue = false
      return 'Checkout'
    }
  },
  methods: {
    nextStep() {
      console.log('funciona el click')
      const param = this.$route.params.box
      console.log('param', param)
      if(param === 'subscription') {
        console.log('hay que ir a addons')
        this.$router.push('/addons')
      }
      else {
        console.log('hay que ir al checkout')
        // maybe add a loading
        window.location = '/cart'
      }
    }
  }
}
</script>

<style lang="scss" scoped>

.meal-cart {

  &__footer {
    box-shadow: 0px 4px 34px rgba(0, 0, 0, 0.1);
    padding: .8rem 1rem;

    @include media-tablet-up {
      padding: 0;
    }
  }

  &__box-total {
    @include flex($align: flex-end, $justify: space-between);

    @include media-tablet-up {
      padding: .6rem .6rem 0;
    }

    &--title {
      font-family: $font-heading;
      text-transform: uppercase;
      font-size: 1.5rem;

      @include media-tablet-up {
        font-size: 2rem;
        line-height: 1.8rem;
      }
    }

    &--amounts {
      @include flex($align: flex-end);
    }

    &--sub {
      color: #A7A5A6;
      font-size: 1.1rem;
      margin-right: 0.3rem;
      text-decoration: line-through;

      @include media-tablet-up {
        font-size: 1.3rem;
      }
    }

    &--final {
      font-size: 1.2rem;
      font-weight: 500;

      @include media-tablet-up {
        font-size: 1.6rem;
      }
    }
  }

  &__btn-next {
    cursor: pointer;
    background: $color-primary;
    padding: 1rem 0;
    margin-top: 0.5rem;
    font-weight: 600;
    @include flex($justify: center);

    @include media-tablet-up {
      padding: 1.5rem 0;
      font-size: 1.3rem;
      font-weight: 500;
    }
  }

  .disable {
    pointer-events: none;
    opacity: .6;
  }

}

</style>