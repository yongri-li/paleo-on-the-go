<template>
  <div class="meal-cart">
    <div :class="{ show: showCartMobile }" class="meal-cart__info">
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
        :from-portal="fromPortal"
      />
    </div>
    <meal-cart-footer
      :cart="cart"
      :subtotal="cartSubTotal"
      :subtotalWithDiscount="cartSubTotalWithDiscount"
      :size-selected="getSizeSelected"
      :cart-length="cartLength"
      :cart-add-ons="cartAddOns"
      :addons="addOnsUpdates"
      :addressId="addressId"
      :subs="subscriptionUpdates"
      :type-class="typeClass"
      :from-portal="fromPortal"
      class="meal-cart__bottom"
    />
  </div>
</template>

<script>
import MealCartHeader from "./MealCartHeader.vue";
import MealCartBody from "./MealCartBody.vue";
import MealCartFooter from "./MealCartFooter.vue";

import { mapState, mapGetters } from "vuex";
import { CHANGE_SIZE_SELECTED } from "../../store/modules/mealcart/_mutations-type";
import { CLEAN_ALL_CART } from "@shared/store/modules/babcart/_mutations-type";

import { changeRouter } from "../../utils";

export default {
  components: {
    MealCartHeader,
    MealCartBody,
    MealCartFooter,
  },
  data() {
    return {
      showCartMobile: false,
      fromPortal: !!sessionStorage.getItem("fromPortal"),
      addressId: null,
      nextChargeDate: null,
    };
  },
  computed: {
    ...mapState("babcart", ["cart"]),
    ...mapGetters("mealcart", ["getSizeSelected"]),
    haveProductsClass() {
      return this.cart.items.length ? "with-products" : "without-products";
    },
    typeClass() {
      const orderType =
        this.$route.params.box || this.getSizeSelected.order_type;
      return orderType;
    },
    cartLength() {
      let length = 0;
      this.cart.items.forEach((item) => {
        length += item.quantity;
      });
      return length;
    },
    cartSubTotal() {
      let subtotal = 0;
      this.cart.items.forEach((item) => {
        subtotal += item.price * item.quantity;
      });
      return subtotal;
    },
    cartSubTotalWithDiscount() {
      let sub = 0;
      let final = 0;
      const discount = (100 - this.getSizeSelected.discount) / 100;
      this.cart.items.forEach((item) => {
        sub += item.price * item.quantity;
        let price = +(
          Math.round((item.price * discount) / 100 + "e+2") + "e-2"
        );
        final += price * item.quantity;
      });
      return final;
    },
    cartAddOns() {
      let total = 0;
      this.cart.addons.forEach((addon) => {
        total += addon.price * addon.quantity;
      });
      return total;
    },
    isCustomer() {
      return customer.email && customer.shopify_id ? true : false;
    },
    addOnsUpdates() {
      return this.cart?.addons?.map((addOn) => {
        return {
          addressId: this.addressId,
          next_charge_scheduled_at: this.nextChargeDate,
          price: (addOn.variants[0].price / 100).toFixed(2),
          product_title: addOn.title,
          product_type: addOn.type,
          quantity: addOn.quantity,
          shopify_product_id: addOn.id,
          shopify_variant_id: addOn.variants[0]?.id,
          properties: {
            _addOn: true,
          },
        };
      });
    },
    subscriptionUpdates() {
      return this.cart?.items.map((child) => {
        return {
          address_id: this.addressId,
          charge_interval_frequency: 1,
          next_charge_scheduled_at: this.nextChargeDate,
          order_interval_frequency: 1,
          order_interval_unit: "week",
          price: (child.variants[0].price / 100).toFixed(2),
          hash: child.price_hashes,
          tags: child.tags,
          shopify_variant_id: child.variants[0].id,
          quantity: child.quantity,
        };
      });
    },
  },
  mounted() {
    const addressId = sessionStorage.getItem("addressId");
    const nextChargeDate = sessionStorage.getItem("nextChargeDate");
    this.addressId = addressId;
    this.nextChargeDate = nextChargeDate;
    // watch the params of the route to fetch the data again
    this.$watch(
      () => this.$route.params,
      () => {
        this.setSizeSelected();
      },
      // fetch the data when the view is created and the data is
      // already being observed
      { immediate: true }
    );
  },
  methods: {
    setSizeSelected() {
      const boxSize = sessionStorage.getItem("boxSize");
      const fromStartBtn = sessionStorage.getItem("startBtnClk");
      const referrerPage = document.referrer;
      const orderType = this.getSizeSelected.order_type;
      const box = this.$route.params.box;

      if (this.fromPortal) {
        if (box) {
          this.$store.commit(`mealcart/${CHANGE_SIZE_SELECTED}`, {
            val: `${boxSize}items`,
          });
        }
        return;
      }

      if (fromStartBtn)
        this.$store.commit(`mealcart/${CHANGE_SIZE_SELECTED}`, {
          val: `${boxSize}items`,
        });
      sessionStorage.removeItem("startBtnClk");

      // this is for '/'
      if (box === undefined && !referrerPage.includes("/account")) {
        // set option for sizeSelected
        console.log("entro al if del /");
        changeRouter(orderType);
        return;
      }

      // this is for '/onetime'
      if (box === "onetime" && orderType !== "onetime") {
        console.log("entro al if del /onetime");
        this.$store.commit(`mealcart/${CHANGE_SIZE_SELECTED}`, {
          val: "onetime",
        });
        this.$store.commit(`babcart/${CLEAN_ALL_CART}`);
        return;
      }

      // this is for '/subscription'
      if (box === "subscription" && orderType !== "subscription") {
        console.log("entro al if del /subscription");
        this.$store.commit(`mealcart/${CHANGE_SIZE_SELECTED}`, {
          val: "12items",
        });
        this.$store.commit(`babcart/${CLEAN_ALL_CART}`);
        return;
      }
    },
    changeCartMobile(val) {
      this.showCartMobile = val;
    },
  },
};
</script>

<style lang="scss">
$height-footer: 115px;
$height-header-title: 59px;
$translateY: calc(100% - $height-header-title);

.meal-cart {
  @include media-tablet-up {
    width: 27%;
    min-height: 700px;
    display: flex;
    flex-direction: column;
  }

  &__info {
    position: fixed;
    bottom: $height-footer;
    left: 0;
    width: 100%;
    background-color: $color-white;
    height: calc(96vh - $height-footer);
    z-index: 100;
    filter: drop-shadow(0px -4px 34px rgba(0, 0, 0, 0.1));
    border-radius: 20px 20px 0px 0px;
    transform: translateY($translateY);
    transition: all 0.3s ease-out;

    @include media-tablet-up {
      position: relative;
      bottom: 0;
      transform: translateY(0);
      height: calc(100% - $height-footer);
      z-index: 1;
      border-radius: 0;
      flex-grow: 1;
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
      height: auto;
    }
  }
}
</style>
