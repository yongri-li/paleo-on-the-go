<template>
  <div :class="[`c-lineItem c-lineItem--order c-lineItem--${ productTypeHandle }`, {
    'c-lineItem--addOn': isAddOn
  }]">
    <div>
      <div class="c-lineItem__image-wrapper">
        <img :src="image" class="c-lineItem__image" />
      </div>
    </div>
    <div class="c-lineItem__details">
      <div>
        <div class="c-lineItem__details-grid">
          <div class="c-lineItem__details-inner">
            <span class="c-lineItem__collection u-smallCaps">

              {{ defaultActivate ? item.type : product.type }}              
           <!--    {{ item.type }}  -->
            </span>
            <h4 class="c-lineItem__title c-h4">
              {{ productTitle }}
            </h4>
            <div v-if="variantTitle !== 'Regular' && typeof variantTitle !== 'undefined'" class="u-colorGrey">
              {{ upsellText }}
            </div>
            <div v-if="isAddOn" class="u-colorGrey">
              {{ price }}
            </div>
          </div>
          <div class="c-lineItem__controls">
            <div class="c-lineItem__qty">
              <span class="c-lineItem__number">{{ item.quantity }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { handleize, formatPrice } from '@shared/utils'
import cImg from '@shared/components/core/cImg.vue'
import cH from '@shared/components/core/cH.vue'
import cP from '@shared/components/core/cP.vue'

export default {
  props: {
    item: {
      type: Object,
      required: true
    },
    isAddOn: {
      type: Boolean
    },
    defaultActivate: {
      type: Boolean
    },        
    discount: {
      type: Number
    },    
    content: {
      type: Object
    },
    modifiers: {
      type: Array,
      default: () => ([])
    }
  },
  components: { cImg, cH, cP },
  computed: {
    ...mapGetters('customize', ['customizeShop']),
    product() {
      return this.defaultActivate ? this.$store.getters['products/productById'](this.item.id) : this.$store.getters['products/productById'](this.item.productId) || this.$store.getters['products/productById'](this.item.shopify_product_id)
    },
    variant2(){
      return this.product.variants[1];
    },    
    productTypeHandle() {
      return this.defaultActivate ? handleize(this.item.type) : handleize(this.product.type);
    },
    image() {
      return this.product ? this.product.images[0] : false
    },
    alt() {
      return `${this.customizeShop.shop_name} ${this.item.productTitle}`
    },
    productTitle() {
      return this.product.title.split('with')[0];
    },
    variantTitle() {
      return this.defaultActivate && this.item.upsellId ? this.item.variants[1].public_title : this.item.variantTitle;
    },
    upsellText(){
      return `${this.variantTitle} (+$${this.getPriceDiff(this.variant2.subscriptionPrice)})`;
    },       
    // defaultPrice() {
    //   return this.variantTitle !== 'Regular' ? this.product.variants[1].price : this.product.defaultPrice;
    // },  
    // defaultPrice() {
    //   return this.product.defaultPrice - this.discount;
    // },            
    interval() {
      const { item, customizeShop, content } = this
      const { frequency, unit } = item
      const activeInterval = customizeShop.intervals.find(interval => {
        if(!frequency || !unit) return interval.frequency == 0
        else return interval.frequency == frequency
      })
      if(activeInterval) {
        let text = activeInterval.text
        if(frequency && unit && content.ships) text = `${content.ships} ${text}`
        return text
      }
    },
    price() {
      const currencySymbol = this.customizeShop.currency_symbol
      const price = this._formatMoney({ amount: this.item.price })
      return `${currencySymbol}${price}`
    },
  },
  methods: {
    getPriceDiff(price) {
      return (price - this.product.defaultSubscriptionPrice).toFixed(2);
    }
  }  
}
</script>

<style lang="scss">
  .c-lineItem--order {
    border: 1px solid $color-paleo;
    .c-lineItem__details-grid {
      grid-template-columns: auto 45px;
    }
  }
</style>