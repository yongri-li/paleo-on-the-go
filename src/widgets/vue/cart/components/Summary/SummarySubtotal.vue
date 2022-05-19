<template>
  <div class="subtotal">
    <div class="subtotal__content">
      <div class="subtotal__title">Subtotal</div>
      <div class="subtotal__price">
        {{ finalSubtotal }}
      </div>
      <c-button
        class="c-cta subtotal__checkout"
        :class="{ 'not-agree': !agree }"
        @click="checkout"
        :loading="loading"
        text="Checkout"
        :modifiers="['isDefault', 'isPrimary', 'hideTextLoading']"
      />
      <div class="subtotal__msg">
        {{ settings.message_subtotal }}
      </div>
      <div class="subtotal__agree">
        <input
          type="checkbox"
          name="agreecheck"
          id="agreecheck"
          v-model="agree"
          class="subtotal__agree--check"
        />
        <label for="agreecheck" class="subtotal__agree--label" :class="{ agree: agree }">
          I agree with the
        </label>
        <a href="#" target="_blank" class="subtotal__agree--redirect"> Shipping Terms and Conditions </a>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import { formatPrice, formatPriceDollars } from '@shared/utils'
import cButton from '@shared/components/core/cButton.vue'

export default {
  components: {
    cButton
  },
  data() {
    return {
      agree: false,
      loading: false
    }
  },
  components: { cButton },
  computed: {
    ...mapState('ui', ['settings']),
    ...mapState('cartdrawer', ['cartItems', 'sizeSelected']),
    ...mapState('frequency', ['frequencySelected']),
    ...mapGetters('cartdrawer', ['getBoxPrices', 'getAddonPrices', 'getGeneralPrices']),
    finalSubtotal() {
      return formatPriceDollars(
        this.getBoxPrices.final + this.getAddonPrices / 100 + this.getGeneralPrices / 100
      )
    },
    items() {
      const box = this.getItemForCart('box')
      const general = this.getItemForCart('general')
      return [...box, ...general]
    }
  },
  methods: {
    getItemForCart(itemType) {
      const subsprops = {
        shipping_interval_frequency: this.frequencySelected.week,
        shipping_interval_unit_type: 'week'
      }

      return this.cartItems[itemType].map(item => {
        const isSubscription = item.order_type === 'subscription'
        const otherProps = isSubscription ? subsprops : {}

        const isRouteProtection = item.route_protection
        const routeOrderType = isRouteProtection ? item.route_order_type : null

        return {
          id: item.varId ? item.varId : item.variants[0].id,
          product_id: item.id,
          variant_id: item.variants[0].id,
          quantity: item.quantity,
          price: item.varPrice ? item.varPrice / 100 : item.price / 100,
          // price: item.price * (1 - discount),
          properties: {
            _onetime: item.order_type === 'onetime',
            _subscription: item.order_type === 'subscription',
            _addons: item.order_type === 'addons',
            _general: item.order_type === 'general',
            _subtitle: item.subtitle,
            _routeshipping: routeOrderType,
            ...otherProps
          }
        }
      })
    },
    buildCartData() {
      return {
        items: this.items,
        note_attributes: [],
        attributes: {},
        note: null,
        email: null
      }
    },
    async sendProductToCart(cartData) {
      // clean cart
      const clearRequest = await fetch('/cart/clear.js', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      // add product to cart
      const addRequest = await fetch('/cart/add.js', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(cartData)
      })

      return addRequest
    },
    async getTokenFromCart() {
      const tokenRequest = await fetch('/cart.js')
      const tokenJson = await tokenRequest.json()
      return tokenJson.token
    },
    async checkout() {
      this.loading = true
      // create cartData
      const cartData = this.buildCartData()

      // send data to cart (clear & add)
      const addRequest = await this.sendProductToCart(cartData)
      console.log(addRequest)
      if (addRequest.status !== 200) {
        // throw error
        // show error msj
        return
      }

      // get cart hash
      const hashRequest = await fetch('/cart?view=hash', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        }
      })
      const hashJson = await hashRequest.json()

      // get token
      const token = await this.getTokenFromCart()

      if (this.sizeSelected.order_type === 'subscription') {
        const appRequest = await fetch('https://paleo-custom-app.herokuapp.com/plan/checkout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-paleo-key': window.Scoutside.api.custom_app_key
          },
          body: JSON.stringify(hashJson)
        })
        const appResponse = await appRequest.json()
        const domain = 'paleo-on-the-go-sandbox.myshopify.com'
        window.location = `https://checkout.rechargeapps.com/r/checkout/${appResponse.token}?myshopify_domain=${domain}`
      } else window.location = '/checkout'
    }
  }
}
</script>

<style lang="scss" scoped>
.subtotal {
  background-color: #efede6;

  &__content {
    padding: 1rem 1.2rem;
  }

  &__title {
    text-align: center;
    font-size: 1.5rem;
    font-weight: 500;
  }

  &__price {
    font-family: $font-heading;
    text-align: center;
    font-size: 2.88rem;
    margin: 0.8rem 0;
  }

  &__checkout {
    width: 100%;
    max-width: 100%;
    font-size: 1.13rem;
    font-weight: 500;
    margin-bottom: 1.5rem;
  }
  &__checkout.not-agree {
    pointer-events: none;
    color: #4f4c4d;
    background-color: #feedaa;
    border-color: #feedaa;
  }

  &__msg {
    font-size: 0.88rem;
  }

  &__agree {
    font-size: 0.63rem;
    margin: 0.5rem 0;
    @include flex();

    &--check {
      display: none;
    }

    &--label {
      @include flex();

      &::before {
        content: '';
        display: inline-block;
        margin-right: 3px;
        width: 13px;
        height: 13px;
        background-color: $color-white;
        border: 1px solid $color-black;
        border-radius: 3px;
      }
    }
    &--label.agree {
      &::before {
        content: '✓';
        color: $color-primary;
        background-color: $color-black;
        border: 1px solid $color-black;
      }
    }

    &--redirect {
      font-weight: 700;
      text-decoration: underline;
      margin-left: 3px;
    }
  }
}

.cart-empty {
  .subtotal__agree--label {
    pointer-events: none;

    &::before {
      background-color: transparent;
    }
  }
}
</style>
