<template>
  <div class="subtotal">
    <div class="subtotal__content">
      <div class="subtotal__title">Subtotal</div>
      <div class="subtotal__price">
        {{ finalSubtotal }}
      </div>
      <div :class="{ agree: agree }" class="subtotal__checkout" @click="checkout">Checkout</div>
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
        <label for="agreecheck" class="subtotal__agree--label"> I agree with the </label>
        <a href="#" target="_blank" class="subtotal__agree--redirect"> Shipping Terms and Conditions </a>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import { formatPrice } from '@shared/utils'

export default {
  data() {
    return {
      agree: false
    }
  },
  computed: {
    ...mapState('ui', ['settings']),
    ...mapState('cartdrawer', ['cartItems', 'sizeSelected']),
    ...mapState('frequency', ['frequencySelected']),
    ...mapGetters('cartdrawer', ['getBoxPrices', 'getGeneralPrices']),
    finalSubtotal() {
      return formatPrice(this.getBoxPrices.final + this.getGeneralPrices)
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
        const discount = isSubscription ? this.sizeSelected.discount / 100 : 0

        return {
          id: item.variants[0].id,
          product_id: 1615890513975,
          variant_id: item.variants[0].id,
          quantity: item.quantity,
          price: item.price / 100,
          // price: item.price * (1 - discount),
          properties: {
            _onetime: item.order_type === 'onetime',
            _subscription: item.order_type === 'subscription',
            _addons: item.order_type === 'addons',
            _general: item.order_type === 'general',
            ...otherProps
          }
        }
      })
    },
    buildCartData() {
      return {
        // items: this.items.box?.length ? this.items.box : this.items,
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
    async sendPayloadToAPP({ token, payload }) {
      // get hash from cart
      // const hashRequest = await fetch('/cart?view=hash', {
      //   method: 'GET',
      //   headers: {
      //     'Content-Type': 'application/json'
      //   }
      // })
      // send payload to checkout in app
      // const appRequest = await fetch('https://paleo-custom-app.herokuapp.com/plan/checkout', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'x-fmp-key': 'sk_1x1_3ca18d3355b439e6c191d41754de54af8709dbf92aa1a0ef92fc2024b0db2f2e'
      //     // 'x-paleo-key': window.Scoutside.api.paleo_app_key
      //   },
      //   body: JSON.stringify(payload)
      // })
      // const appResponse = await appRequest.json()
      //return appResponse
    },
    async checkout() {
      // create cartData
      const cartData = this.buildCartData()
      console.log('cart data', cartData)

      // send data to cart (clear & add)
      const addRequest = await this.sendProductToCart(cartData)
      console.log(addRequest)
      if (addRequest.status !== 200) {
        // throw error
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

      // update payload object to send to checkout
      // payload.cart_token = token
      // payload.note = cartData.note

      if (this.sizeSelected.order_type === 'subscription') {
        const appRequest = await fetch('https://paleo-custom-app.herokuapp.com/plan/checkout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-fmp-key': 'sk_1x1_3ca18d3355b439e6c191d41754de54af8709dbf92aa1a0ef92fc2024b0db2f2e'
            // 'x-paleo-key': window.Scoutside.api.paleo_app_key
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
    font-size: 1.7rem;
    font-weight: 500;
  }

  &__price {
    font-family: $font-heading;
    text-align: center;
    font-size: 3.5rem;
    margin: 0.8rem 0;
  }

  &__checkout {
    background-color: $color-primary;
    text-align: center;
    padding: 1rem 0;
    font-size: 1.3rem;
    font-weight: 500;
    margin-bottom: 1.5rem;
    opacity: 0.5;
    pointer-events: none;
  }
  &__checkout.agree {
    opacity: 1;
    pointer-events: initial;
    cursor: pointer;
  }

  &__msg {
    font-size: 1.1rem;
  }

  &__agree {
    font-size: 0.8rem;
    margin: 0.5rem 0;
    @include flex();

    &--check {
      margin-right: 3px;
    }

    &--redirect {
      font-weight: 700;
      text-decoration: underline;
      margin-left: 3px;
    }
  }
}
</style>
