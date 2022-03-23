<template>
  <div class="meal-cart">
    <div
      :class="{ show: showCartMobile }"
      class="meal-cart__info"
    >
      <meal-cart-header
        :type-class="typeClass"
        :have-products-class="haveProductsClass"
        :size-selected="getSizeSelected"
        :cart-length="cartLength"
        @changecartmobile="changeCartMobile"
      />
      <meal-cart-body
        :type-class="typeClass"
        :have-products-class="haveProductsClass"
        :size-selected="getSizeSelected"
      />
    </div>
    <meal-cart-footer
      :subtotal="cartSubTotal"
      :size-selected="getSizeSelected"
      :cart-length="cartLength"
      :cart-add-ons="cartAddOns"
      :type-class="typeClass"
      class="meal-cart__bottom"
    />
  </div>
</template>

<script>
import MealCartHeader from './MealCartHeader.vue'
import MealCartBody from './MealCartBody.vue'
import MealCartFooter from './MealCartFooter.vue'

import { mapState, mapGetters } from 'vuex'
import { CHANGE_SIZE_SELECTED, CLEAN_CART_ITEMS } from '../../store/_mutations-type'

import { changeRouter } from '../../utils'


export default {
  components: {
    MealCartHeader,
    MealCartBody,
    MealCartFooter
  },
  data() {
    return {
      showCartMobile: false
    }
  },
  computed: {
    ...mapState([
      'cart'
    ]),
    ...mapGetters([
      'getSizeSelected'
    ]),
    haveProductsClass() {
      return this.cart.items.length ? 'with-products' : 'without-products'
    },
    typeClass() {
      const orderType = this.$route.params.box || this.getSizeSelected.order_type
      return orderType
    },
    cartLength() {
      let length = 0
      this.cart.items.forEach(item => {
        length += item.quantity
      })
      return length
    },
    cartSubTotal() {
      let subtotal = 0
      this.cart.items.forEach(item => {
        subtotal += item.price * item.quantity
      })
      return subtotal
    },
    cartAddOns() {
      let total = 0
      this.cart.addons.forEach(addon => {
        total += addon.price * addon.quantity
      })
      return total
    }
  },
  created() {
    // watch the params of the route to fetch the data again
    this.$watch(
      () => this.$route.params,
      () => {
        this.setSizeSelected()
      },
      // fetch the data when the view is created and the data is
      // already being observed
      { immediate: true }
    )
  },
  methods: {
    setSizeSelected() {
      const orderType = this.getSizeSelected.order_type
      const box = this.$route.params.box
      console.log('box',box)

      // this is for '/'
      if(box === undefined) {
        // set option for sizeSelected
        console.log('entro al if del /')
        changeRouter(orderType)
        return
      }

      // this is for '/onetime'
      if(box === 'onetime' && orderType !== 'onetime') {
        console.log('entro al if del /onetime')
        this.$store.commit( CHANGE_SIZE_SELECTED, { val: 'onetime' } )
        this.$store.commit( CLEAN_CART_ITEMS )
        return
      }

      // this is for '/subscription'
      if(box === 'subscription' && orderType !== 'subscription') {
        console.log('entro al if del /subscription')
        this.$store.commit( CHANGE_SIZE_SELECTED, { val: '12items' } )
        this.$store.commit( CLEAN_CART_ITEMS )
        return
      }

    },
    changeCartMobile(val) {
      this.showCartMobile = val
    }
  }
}
</script>

<style lang="scss">

$height-footer: 115px;
$height-header-title: 59px;
$translateY: calc(100% - $height-header-title);

.meal-cart {

  @include media-tablet-up {
    width: 27%;
    height: 90vh;
    max-height: 750px;
  }

  &__info {
    position: fixed;
    bottom: $height-footer;
    left: 0;
    width: 100%;
    background-color: $color-white;
    height: calc(89vh - $height-footer);
    z-index: 100;
    filter: drop-shadow(0px -4px 34px rgba(0, 0, 0, 0.1));
    border-radius: 20px 20px 0px 0px;
    transform: translateY($translateY);
    transition: all .3s ease-out;

    @include media-tablet-up {
      position: relative;
      bottom: 0;
      transform: translateY(0);
      height: calc(100% - $height-footer);
      z-index: 1;
    }
  }
  &__info.show {
    transform: translateY(1px);
  }

  &__bottom {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: $height-footer;
    background-color: $color-white;
    z-index: 101;

    @include media-tablet-up {
      position: relative;
      z-index: 1;
    }
  }

}

</style>