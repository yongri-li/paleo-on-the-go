<template>
  <div class="subtotal">
    <div class="subtotal__content">
      <div class="subtotal__title">
        Subtotal
      </div>
      <div class="subtotal__price">
        {{ finalSubtotal }}
      </div>
      <div
        :class="{ agree: agree }"
        class="subtotal__checkout"
        @click="checkout"
      >
        Checkout
      </div>
      <div class="subtotal__msg">
        Shipping & Taxes Calculated At Checkout
      </div>
      <div class="subtotal__agree">
        <input
          type="checkbox"
          name="agreecheck"
          id="agreecheck"
          v-model="agree"
          class="subtotal__agree--check"
        />
        <label
          for="agreecheck"
          class="subtotal__agree--label"
        >
          I agree with the
        </label>
        <a href="#" target="_blank"
          class="subtotal__agree--redirect"
        >
          Shipping Terms and Conditions
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import { formatPrice, getPriceWithDiscount } from '@shared/utils'

export default {
  data() {
    return {
      agree: false
    }
  },
  computed: {
    ...mapState([
      'cart'
    ]),
    ...mapGetters([
      'getSizeSelected',
      'getItemSubtotal',
      'getAddOnsSubtotal'
    ]),
    finalSubtotal() {
      const discount = this.getSizeSelected.discount / 100
      const total = this.getItemSubtotal * (1 - discount) + this.getAddOnsSubtotal
      return formatPrice(total)
    },
    items() {
      const box = this.getItemForCart('items')
      const addons = this.getItemForCart('addons')
      const pdp = this.getItemForCart('pdp')

      return [
        ...box,
        ...addons,
        ...pdp
      ]
    }
  },
  methods: {
    getItemForCart(itemType) {
      const subprops = {
        shipping_interval_frequency: 2,
        shipping_interval_unit_type: 'week'
      }
      const otherProps = itemType === 'pdp' ? {} : subprops
      const discount = itemType === 'addons' ? 0 : this.getSizeSelected.discount

      return this.cart[itemType].map(item => (
        {
          id: item.variants[0].id,
          quantity: item.quantity,
          price: getPriceWithDiscount({ price: item.price, discount }),
          properties: {
            _onetime: itemType === 'onetime',
            _subscription: itemType === 'items',
            _addons: itemType === 'addons',
            ...otherProps,
          }
        }
      ))
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
      await fetch('/cart/clear.js', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      // add product to cart
      const addRequest = await fetch('/cart/add.js', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(cartData)
      });

      return addRequest
    },
    async getTokenFromCart() {
      const tokenRequest = await fetch('/cart.js');
      const tokenJson = await tokenRequest.json();
      return tokenJson.token
    },
    async sendPayloadToAPP({token, cartData}) {
      // get hash from cart
      const hashRequest = await fetch('/cart?view=hash', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
      })
      const hashJson = await hashRequest.json();

      // create payload object to send to checkout
      const payload = {...hashJson}
      payload.cart_token = token;
      payload.note_attributes = cartData.note_attributes;
      payload.note = cartData.note;
      payload.email = cartData.email;

      // send payload to checkout in app
      const checkoutUrl = `${appUrl}/checkout` //change this
      const appRequest = await fetch(checkoutUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-paleo-key': window.Scoutside.api.paleo_app_key //change this
        },
        body: JSON.stringify(payload)
      });
      const appResponse = await appRequest.json();
      return appResponse
    },
    async checkout() {
      console.log('funciona el click')

      // create cartData
      const cartData = this.buildCartData()
      console.log(cartData)

      // send data to cart
      const addRequest = await this.sendProductToCart(cartData)
      console.log(addRequest)

      if (addRequest.status !== 200) {
        // throw error
        return
      }

      // know if is onetime or only have product add from pdp
      const isBox = this.cart.items.length
      const isOneTime = this.getSizeSelected.order_type === 'onetime'

      if((isBox && isOneTime) || !isBox) {
        window.location = '/checkout'
        return
      }

      // get token
      const token = await this.getTokenFromCart()
      console.log(token)

      // this is for send data to heroku app
      // const appResponse = this.sendPayloadToAPP({token, cartData})
      // console.log(appResponse)

      const domain = 'paleo-on-the-go-sandbox.myshopify.com'
      window.location = `https://checkout.rechargeapps.com/r/checkout?myshopify_domain=${domain}&cart_token=${token}`;
    }
  },
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
    margin: .8rem 0;
  }

  &__checkout {
    background-color: $color-primary;
    text-align: center;
    padding: 1rem 0;
    font-size: 1.3rem;
    font-weight: 500;
    margin-bottom: 1.5rem;
    opacity: .5;
    pointer-events: none;
  }
  &__checkout.agree {
    opacity: 1;
    pointer-events: initial;
  }

  &__msg {
    font-size: 1.1rem;
  }

  &__agree {
    font-size: .8rem;
    margin: .5rem 0;
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