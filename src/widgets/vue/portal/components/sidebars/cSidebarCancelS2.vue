<template>
  <div
    :class="_buildModifiers('c-sidebarCancel', modifiers)"
    v-if="content && address"
  >
    <c-h
      class="c-sidebar__heading"
      tag="h1"
      level="1"
      :text="content.cancel_heading"
    />
    <c-p
      class="c-sidebarCancel__address"
      tag="address"
      level="1"
      v-html="
        _buildAddress({
          address: address,
          options: {
            hiddenFields: ['name', 'country', 'company'],
            provinceName: 'short',
            flatten: true
          }
        })
      "
    />
    <c-h
      class="c-sidebarCancel__meal-plan-heading"
      tag="h4"
      level="4"
      :text="content.cancel_meal_plan_heading_s2"
    />

    <div class="c-sidebarCancel__meal-plans">
      <c-orders-item
        v-for="(subscription, index) in subscriptions"
        :key="`${subscription.id}-${index}`"
        :content="subscription"
        :item="subscription"
      />
    </div>

    <!--     <div class="c-sidebarCancel__meal-plans">
      <div
        v-for="subscription in subscriptions"
        :key="subscription.id"
        class="c-sidebarCancel__meal-plan"
      >
        <div class="c-sidebarCancel__meal-row">
          <div class="c-sidebarCancel__meal-col">
            <img
              v-if="productImage(subscription.productId)"
              class="c-sidebarCancel__meal-image"
              :src="productImage(subscription.productId)"
              :alt="subscription.product_title"
            />
          </div>
          <div
            class="c-sidebarCancel__meal-col c-sidebarCancel__meal-col--flex"
          >
            <c-p
              class="c-sidebarCancel__meal-variant"
              tag="p"
              level="1"
              v-html="subscription.variantTitle"
            />
            <c-p
              class="c-sidebarCancel__meal-title"
              tag="p"
              level="1"
              v-html="subscription.product_title"
            />
          </div>
          <div class="c-sidebarCancel__meal-col">
            <c-p
              class="c-sidebarCancel__meal-quantity"
              tag="p"
              level="1"
              v-html="subscription.quantity"
            />
          </div>
        </div>
      </div>
    </div> -->

    <section class="c-sidebarCancel__radio-wrapper">
      <c-p
        class="c-sidebarCancel__radio-heading"
        tag="p"
        level="1"
        v-html="content.cancel_reason_heading"
      />
      <c-cancelRadios
        class="c-sidebarCancel__radios"
        v-model="cancelModel"
        :content="{
          reason_1: content.cancel_reason_1,
          reason_2: content.cancel_reason_2,
          reason_3: content.cancel_reason_3,
          reason_4: content.cancel_reason_4,
          reason_5: content.cancel_reason_5,
          reason_6: content.cancel_reason_6,
          reason_7: content.cancel_reason_7,
          reason_8: content.cancel_reason_8,
          reason_9: content.cancel_reason_9,
          reason_10: content.cancel_reason_10,
          reason_other: content.cancel_reason_other,
          specific_reason_heading: content.cancel_specific_reason_heading,
          specific_reasons: content.cancel_reason_specific
        }"
        @select="handleRadioSelect"
      />
    </section>

    <button class="c-sidebarCancel__nevermind" @click="UI_CLOSE_SIDEBAR">
      {{ content.cancel_nevermind_button_s2 }}
    </button>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
import { _sortItemsByCharge } from '@vue/portal/utils'
import { handleize } from '@shared/utils'
import cP from '@shared/components/core/cP.vue'
import cCancelRadios from '../parts/cCancelRadios.vue'
import cH from '@shared/components/core/cH.vue'
import cOrdersItem from '../orders/cOrdersItem.vue'

export default {
  name: 'SidebarCancelS2',
  props: {
    content: {
      type: Object,
      required: true
    },
    settings: {
      type: Object,
      required: true
    },
    modifiers: {
      type: Array,
      default: () => []
    }
  },
  components: {
    cP,
    cH,
    cCancelRadios,
    cOrdersItem
  },
  data: () => ({
    cancelModel: false,
    cancelReason2: false
  }),
  computed: {
    subscriptions() {
      return this.$store.getters['customer/customerSubscriptionsByAddress'](
        this.settings.addressId
      )
    },
    address() {
      return this.$store.getters['customer/customerAddressById'](
        this.settings.addressId
      )
    },
    subscriptionIds() {
      return this.subscriptions.id
    }
  },
  methods: {
    ...mapMutations('ui', ['UI_SET_SIDEBAR', 'UI_CLOSE_SIDEBAR']),
    productImage(pid) {
      return this.$store.getters['products/productById'](pid)?.images[0]
    },
    handleRadioSelect(value) {
      //this.cancelModel = value
      this.cancelReason2 = value
      this.UI_SET_SIDEBAR({
        component: 'cSidebarCancelS3',
        content: this.content,
        // settings: { ...this.settings, cancelModel: this.cancelModel }
        settings: {
          ...this.settings,
          cancelReason1: this.cancelModel,
          cancelReason2: this.cancelReason2
        }
      })
    }
  }
}
</script>

<style lang="scss">
.c-sidebarCancel__meal-plan-heading {
  font-size: 16px;
  font-weight: 700;
  letter-spacing: -0.02em;
  margin-top: 30px;
  margin-bottom: 18px;
}

.c-sidebarCancel__meal-plans {
  margin-bottom: 25px;
  display: flex;
  flex-direction: column;
  gap: 1rem;

  .c-lineItem {
    padding: 12px;

    @include media-tablet-up {
      width: 84%;
    }
  }
}

/*.c-sidebarCancel__meal-plan {
  background-color: $color-ecru;
  border: 1px solid $color-paleo;
  border-radius: 5px;
  padding: 10px 34px 10px 14px;
  max-width: 338px;

  &:not(:last-child) {
    margin-bottom: 20px;
  }
}*/

/*.c-sidebarCancel__meal-row {
  display: flex;
  margin-left: -8px;
  margin-right: -8px;
}

.c-sidebarCancel__meal-col {
  padding-left: 8px;
  padding-right: 8px;
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;

  &--flex {
    flex: 1;
  }
}

.c-sidebarCancel__meal-image {
  display: block;
  width: 100%;
  max-width: 80px;
}

.c-sidebarCancel__meal-variant {
  margin-bottom: 0;
  color: $color-broccoli;
  text-transform: uppercase;
  font-weight: 800;
  font-size: 10px;
  letter-spacing: 0.05em;
  font-family: $font-body;
}

.c-sidebarCancel__meal-title {
  color: $color-off-black;
  font-weight: 700;
  font-size: 14px;
  margin-bottom: 0;
  font-family: $font-heading;
  line-height: 1.4;
}*/

/*.c-sidebarCancel__meal-quantity {
  width: 35px;
  height: 35px;
  line-height: 38px;
  border-radius: 50%;
  font-size: 16px;
  font-weight: 700;
  font-family: $font-body;
  text-align: center;
  color: $color-smooth-white;
  background-color: $color-broccoli;
  margin-bottom: 0;
}*/

.c-sidebarCancel__radio-heading {
  color: $color-broccoli;
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 12px;
  line-height: 1.2;
}

.c-sidebarCancel__radio-wrapper {
  margin-bottom: 26px;
}

.c-sidebarCancel__nevermind {
  font-size: 13px;
  font-weight: 800;
  text-transform: uppercase;
  color: $color-broccoli;
  border: 0;
  padding: 0;
  border-bottom: 1px solid $color-broccoli;
  outline: 0;
  background: none;
  cursor: pointer;
}
</style>
