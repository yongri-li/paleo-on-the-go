<template>
  <div class="meal-cart__footer">
    <div class="meal-cart__box-total">
      <div class="meal-cart__box-total--title">BOX TOTAL</div>
      <div class="meal-cart__box-total--amounts">
        <div v-if="typeClass !== 'onetime'" class="meal-cart__box-total--sub">
          {{ subtotalFormat }}
        </div>
        <div class="meal-cart__box-total--final">
          {{ final }}
        </div>
      </div>
    </div>

    <c-button
      class="c-cta meal-cart__btn-next"
      :class="{ disable: notContinue }"
      @click="nextStep"
      :loading="loading"
      :text="ctabtn"
      :modifiers="['isDefault', 'isPrimary', 'hideTextLoading']"
      :attributes="{ disable: notContinue }"
    />
  </div>
</template>

<script>
import { formatPrice } from "@shared/utils";
import { mapActions, mapState } from "vuex";
import cButton from "@shared/components/core/cButton.vue";
import { apiService } from "@shared/services";
import {
  stillProcessingWarningPopup,
  removeReloadWarning,
} from "@shared/utils";

export default {
  props: {
    cart: {
      type: Object,
      required: true,
    },
    subtotal: {
      type: Number,
      required: true,
    },
    subtotalWithDiscount: {
      type: Number,
      required: true,
    },
    sizeSelected: {
      type: Object,
      required: true,
    },
    cartLength: {
      type: Number,
      required: true,
    },
    cartAddOns: {
      type: Number,
      required: true,
    },
    addons: {
      type: Array,
    },
    subs: {
      type: Array,
    },
    fromPortal: {
      type: Boolean,
    },
    typeClass: {
      type: String,
      default: "subscription",
    },
    addressId: {
      type: [String, Number],
    },
  },
  data() {
    return {
      notContinue: false,
      loading: false,
      rechargeSubs: [],
      rechargeAddons: [],
      rechargeSubIds: [],
      rechargeAddonIds: [],
      rechargeAddonVarIds: [],
    };
  },
  components: {
    cButton,
  },
  computed: {
    ...mapState("cartdrawer", ["cartItems"]),
    priceAddOns() {
      return this.typeClass === "addons" ? this.cartAddOns : 0;
    },
    final() {
      const total = this.subtotalWithDiscount * 100 + this.priceAddOns;
      return total === 0 ? "$0.00" : formatPrice(total);
    },
    isCustomer() {
      return customer.email && customer.shopify_id ? true : false;
    },
    subtotalFormat() {
      return formatPrice(this.subtotal + this.priceAddOns);
    },
    ctabtn() {
      if (this.cartLength === 0) {
        this.notContinue = true;
        return "Add items to Continue";
      }

      const param = this.$route.params.box;
      if (param === "addons" && this.fromPortal && this.isCustomer)
        return "Save Changes";

      const diff = this.cartLength - this.sizeSelected.number_size;
      if (diff > 0 && this.typeClass === "subscription") {
        this.notContinue = true;
        return `Remove ${diff} items to Continue`;
      }

      if (diff < 0) {
        this.notContinue = true;
        return `Add ${diff * -1} items to Continue`;
      }

      if (this.cartAddOns === 0 && this.typeClass === "addons") {
        this.notContinue = false;
        const ctaAddonsButton =
          window.Scoutside.bundle.mealcart.content.cta_addons_button ||
          `No Thanks Continue to Checkout`;
        return ctaAddonsButton;
      }

      if (this.typeClass === "subscription") {
        this.notContinue = false;
        return "Continue";
      }

      this.notContinue = false;
      return "Checkout";
    },
    finalSubs() {
      const currentSubs = [...this.subs];
      const frequency = sessionStorage.getItem("frequency");
      return currentSubs.map((item) => {
        return {
          ...item,
          properties: {
            shipping_interval_frequency: +frequency,
            shipping_interval_unit_type: "week",
          },
        };
      });
    },
    hasNewAddons() {
      if (this.addons.length !== this.rechargeAddons.length) return true;

      const rcVarIdsSrt = this.rechargeAddonVarIds.sort();
      const curVarIdsSrt = this.addons
        .map((ad) => ad.shopify_variant_id)
        .sort();
      const rcQtysSrt = this.rechargeAddons.map((ad) => ad.quantity).sort();
      const curQtysSrt = this.addons.map((ad) => ad.quantity).sort();

      for (let i = 0; i < curVarIdsSrt?.length; i++) {
        if (curVarIdsSrt[i] !== rcVarIdsSrt[i]) return true;
      }
      for (let i = 0; i < curQtysSrt?.length; i++) {
        if (curQtysSrt[i] !== rcQtysSrt[i]) return true;
      }
      return false;
    },
  },
  methods: {
    ...mapActions("cartdrawer", [
      "setDataFromBox",
      "customerDeleteSubscriptions",
      "customerDeleteOnetimes",
      "customerCreateOnetimes",
      "customerUpdatePlan",
    ]),
    async updateAddonsAndSubs() {
      this.loading = true;
      stillProcessingWarningPopup();

      if (this.hasNewAddons) {
        await this.customerDeleteOnetimes({
          addressId: this.addressId,
          addOnsIds: this.rechargeAddonIds,
        });

        const subscriptions = await this.customerCreateOnetimes({
          addressId: this.addressId,
          creates: this.addons,
        });
      }

      await this.customerUpdatePlan({
        addressId: this.addressId,
        updates: [...this.finalSubs],
        deletes: this.rechargeSubs,
      });

      const update = await this.customerDeleteSubscriptions({
        addressId: this.addressId,
        ids: this.rechargeSubIds,
      });

      removeReloadWarning();
      if (update) window.location = "/account#/shipments";
    },
    async nextStep() {
      const param = this.$route.params.box;
      if (param === "subscription") {
        this.$router.push("/addons");
      } else if (this.fromPortal && this.isCustomer) {
        this.updateAddonsAndSubs();
      } else {
        this.loading = true;
        await this.setDataFromBox({
          items: this.cart.items,
          addons: this.cart.addons,
          sizeSelected: this.sizeSelected,
        });
        window.location = "/cart";
      }
    },
    async getRCdata() {
      const apiClient = new apiService();
      const { data } = await apiClient.get(
        "/v1/customer/resources?resources=subscriptions,onetimes"
      );
      console.log(data);
      const { subscriptions, onetimes } = data.resources;
      const curSubs = subscriptions.filter(
        (sub) => sub.addressId === this.addressId
      );
      const subIds = curSubs.map((sub) => sub.id);
      const curAddons = onetimes.filter(
        (addon) => addon.addressId === this.addressId
      );
      const addonIds = curAddons.map((addon) => addon.id);
      const addonVarIds = curAddons.map((addon) => addon.shopify_variant_id);
      this.rechargeAddons = curAddons;
      this.rechargeSubs = curSubs;
      this.rechargeSubIds = subIds;
      this.rechargeAddonIds = addonIds;
      this.rechargeAddonVarIds = addonVarIds;
    },
  },
  mounted() {
    this.getRCdata();
  },
};
</script>

<style lang="scss" scoped>
.meal-cart {
  &__footer {
    box-shadow: 0px 4px 34px rgba(0, 0, 0, 0.1);
    padding: 0.8rem 1rem;

    @include media-tablet-up {
      padding: 0;
    }
  }

  &__box-total {
    @include flex($align: flex-end, $justify: space-between);

    @include media-tablet-up {
      padding: 0.6rem 0.6rem 0;
    }

    &--title {
      font-family: $font-heading;
      text-transform: uppercase;
      font-size: 1.38rem;

      @include media-tablet-up {
        font-size: 1.75rem;
        line-height: 1;
      }
    }

    &--amounts {
      @include flex($align: flex-end);
    }

    &--sub {
      color: #a7a5a6;
      font-size: 1rem;
      margin-right: 0.3rem;
      text-decoration: line-through;

      @include media-tablet-up {
        font-size: 1.25rem;
      }
    }

    &--final {
      font-size: 1rem;
      font-weight: 500;

      @include media-tablet-up {
        font-size: 1.25rem;
      }
    }
  }

  &__btn-next {
    width: 100%;
    max-width: none;
    font-size: 1rem;
    padding: 0 2rem;
    margin-top: 0.5rem;
    height: 54px;

    @include media-tablet-up {
      padding: 0 1rem;
      font-size: 1.13rem;
      font-weight: 500;
      height: 64px;
    }
  }

  .disable {
    pointer-events: none;
    // opacity: 0.6;
    color: #4f4c4d;
    background-color: #feedaa;
    border-color: #feedaa;
  }
}
</style>
