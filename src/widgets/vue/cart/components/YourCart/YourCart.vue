<template>
  <div class="your-cart">
    <div class="your-cart__title">
      {{ settings.title_cart }}
    </div>
    <div class="your-cart__content">
      <div class="your-cart__content-header">
        <div class="your-cart__content-column product">
          Product
        </div>
        <div class="your-cart__content-column qty u-hideMobileDown">
          QTY
        </div>
        <div class="your-cart__content-column price u-hideMobileDown">
          Price
        </div>
      </div>
      <your-cart-body class="your-cart__content-body"/>
    </div>
  </div>
</template>

<script>
import YourCartBody from './YourCartBody.vue'
import { mapState } from 'vuex'

export default {
  components: {
    YourCartBody
  },
  computed: {
    ...mapState('ui', [
      'settings'
    ])
  }
}
</script>

<style lang="scss" scoped>
.your-cart {

  margin-bottom: 2rem;

  &__title {
    font-family: $font-heading;
    font-size: 3rem;
    text-transform: uppercase;
    margin-bottom: 1rem;
  }

  &__content {
    @include media-tablet-up {
      &-column.product{
        width: 55%;
      }

      &-column.qty{
        width: 10%;
        text-align: center;
      }

      &-column.price{
        width: 22%;
        text-align: right;
      }
    }
  }

  &__content-header {
    text-transform: uppercase;
    font-weight: 500;
    font-size: 1.2rem;
    letter-spacing: 0.06em;

    @include media-tablet-up {
      font-size: 1rem;
      padding: 0 .4rem;
      @include flex();

      &-column.product{
        width: 60%;
      }

      &-column.qty{
        width: 10%;
      }

      &-column.price{
        width: 15%;
        text-align: right;
      }
    }
  }

  &__content-body {
    border: 1px solid #EFEDE6;
    padding: .4rem;
    margin-top: 1rem;
    background-color: #efede6;

    @include media-tablet-up {
      margin-top: 0;
    }
  }
}
</style>