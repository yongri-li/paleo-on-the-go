<template>
  <div :class="[`c-lineItem c-lineItem--${productTypeHandle}`, {
    'c-lineItem--review': review,
    'c-lineItem--addOn': isAddOn
  }]">
    <div>
      <div class="c-lineItem__image-wrapper">
        <img :src="product.images[0]" class="c-lineItem__image eqwd" />
      </div>
    </div>
    <div class="c-lineItem__details">
      <div>
        <div class="c-lineItem__details-grid">
          <div class="c-lineItem__details-inner">
            <span class="c-lineItem__collection u-smallCaps">
              {{ pType }}
            </span>
            <h4 class="c-lineItem__title c-h4">
              {{ title }}
            </h4>
            <div v-if="isAddOn && !review">
              {{ price }}
            </div>
            <div v-if="review" class="u-colorGrey">
              <span v-if="isAddOn">Add-Ons</span>
              <span v-else-if="selectedPlan.subscription">Every Week</span>
              <span v-else>A La Carte</span>
            </div>
            <button v-if="!preventEdit && !review" class="c-lineItem__remove" @click="$emit('remove')">Remove</button>
          </div>
          <div class="c-lineItem__controls">
            <div v-if="review" class="c-lineItem__qty">
              <span class="c-lineItem__number">{{ product.quantity }}</span>
              <span v-if="isAddOn" class="c-lineItem__upsell-price">
                + {{ price }}
              </span>
            </div>
            <ul v-else :class="['c-qtyControls', {
              'c-qtyControls--prevent-edit': preventEdit
            }]">
              <li class="c-qtyControls__control-wrapper">
                <button class="c-qtyControls__control" @click="$emit('qtyDecrease')">–</button>
              </li>
              <li class="c-qtyControls__qty">
                {{ quantity }}
              </li>
              <li class="c-qtyControls__control-wrapper">
                <button class="c-qtyControls__control" @click="$emit('qtyIncrease')">+</button>
              </li>
            </ul>
          </div>
        </div>
        <div v-if="product.variants.length > 1 && showUpsell" class="c-lineItem__checkbox">
          <div :class="['c-checkbox', {
            'c-checkbox--checked': upsellSelected
          }]" @click="handleUpsell">
            <div class="c-checkbox__box c-checkbox__box--inverse">
              <c-icon icon="checkmark" />
            </div>
          </div>
          {{ upsellText }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapState } from 'vuex';
  import { formatPrice, handleize } from '../../utils';
  import cCheckbox from './cCheckbox.vue';
  import cIcon from "@shared/components/core/cIcon.vue";
  
  export default {
    name: "cLineItem",
    props: {
      product: {
        type: Object
      },
      quantity: {
        type: Number
      },
      review: {
        type: Boolean
      },
      isAddOn: {
        type: Boolean
      },
      preventEdit: {
        type: Boolean
      },
      showUpsell: {
        type: Boolean
      }
    },
    computed: {
      ...mapState([
        'selectedPlan'
      ]),
      productTypeHandle() {
        return handleize(this.product.type)
      },
      pType() {
        return this.product.type.replace('Plus','+');
      },
      title() {
        return this.product.title.split('with')[0];
      },
      price() {
        return formatPrice(this.product.price);
      },
      upsellText() {
        return `Add ${this.product.variants[1].title} (+${this.getUpsellDifference(this.product.variants[1].price)})`;
      },
      upsellSelected() {
        return this.product.upsellId === this.product.variants[1].id;
      }
    },
    methods: {
      getUpsellDifference(price) {
        return formatPrice(price - this.product.price);
      },
      handleUpsell() {
        if (this.upsellSelected) {
          this.$emit('upsellOptOut')
        } else {
          this.$emit('upsellOptIn', this.product.variants[1].id)
        }
      }
    },
    components: {
      cCheckbox,
      cIcon
    }
  };
</script>

<!-- <style lang="scss">
</style> -->

<docs>
  ```jsx
  <div class="u-bgEcru" style="width: 380px;">
    <cLineItem
      :product="1"
    />
  </div>
  ```
  
  ```jsx
  <div class="u-bgEcru" style="width: 380px;">
    <cLineItem
      :review="true"
    />
  </div>
  ```
  
  ```jsx
  <div class="u-bgEcru" style="width: 380px;">
    <cLineItem
      :review="true"
      :isAddOn="true"
    />
  </div>
  ```
</docs>
