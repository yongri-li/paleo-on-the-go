<template>
  <div :class="_buildModifiers('c-ordersItem', modifiers)" v-if="item && content">
    <span class="c-lineItem__qty">{{ item.quantity }}</span>
    <c-img class="c-ordersItem__image" :src="image" :alt="alt" />
    <div class="c-ordersItem__details">
      <c-h class="c-ordersItem__title" v-if="item.productTitle" tag="h4" level="4" :text="productTitle[0]" />

      <!-- Has second have of title, after the word "with" -->
      <!-- <c-p tag="p" v-if="productTitle[1]" :text="productTitle[1]" /> -->

      <!-- <c-p class="c-ordersItem__interval" v-if="interval" tag="p" level="4" :text="interval" /> -->
      <!--       <c-p
        class="c-ordersItem__variant"
        v-if="item.variantTitle"
        tag="p"
        level="4"
        :text="item.variantTitle.replace(/\//g, '•')"
      /> -->
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import cImg from '@shared/components/core/cImg.vue'
import cH from '@shared/components/core/cH.vue'
import cP from '@shared/components/core/cP.vue'

export default {
  props: {
    item: {
      type: Object,
      required: true
    },
    content: {
      type: Object,
      required: true
    },
    modifiers: {
      type: Array,
      default: () => []
    }
  },
  components: { cImg, cH, cP },
  computed: {
    ...mapGetters('customize', ['customizeShop']),
    alt() {
      return `${this.customizeShop.shop_name}  ${this.item.productTitle}`
    },
    products() {
      return this.$store.state.products
    },
    // product() {
    //   return (
    //     this.$store.getters['products/productById'](this.item.id) ||
    //     this.$store.getters['products/productById'](this.item.shopify_product_id)
    //   )
    // },
    product() {
      const prodArr = Object.values(this.products)
      return prodArr.find(prod => prod.id === this.item.productId)
    },
    productTitle() {
      const productTitle = this.item.productTitle
      let title, subtitle
      productTitle.includes('with')
        ? ((title = productTitle.split('with')[0]), (subtitle = 'with ' + productTitle.split('with')[1]))
        : (title = productTitle)

      return [title, subtitle]
    },
    image() {
      return this.product ? this.product.images[0] : false
    },
    interval() {
      // const { item, customizeShop } = this
      // const frequency = item.properties.find(prop => prop.name === 'shipping_interval_frequency')
      // const unit = item.properties.find(prop => prop.name === 'shipping_interval_unit')
      // const activeInterval = customizeShop.intervals.find(interval => {
      //   if(!frequency || !unit) return interval.frequency == 0
      //   else return interval.frequency == frequency
      // })
      // let text = activeInterval.text
      // if(frequency && unit && content.ships) text = `${content.ships} ${text}`
      // return text
      return 'test text'
    },
    price() {
      // const currencySymbol = this.customizeShop.currency_symbol
      // const price = this._formatMoney({ amount: this.item.price })
      // return `${currencySymbol}${price}`
      return 'test price'
    },
    quantityPrice() {
      //return `${this.item.quantity} x ${this.price}`
      return 'test qty price'
    }
  },
  methods: {
    // getProductObject(id) {
    //   return this.allProducts.find(product => product.id === id)
    // },
  }
}
</script>

<style lang="scss">
.c-ordersItem {
  position: relative;
  /*  padding: 1rem;*/
  @include flex($align: flex-start, $wrap: nowrap, $direction: column);

  .c-lineItem__qty {
    display: inline-block;
    position: absolute;
    top: -12px;
    right: -12px;
    width: 44px;
    height: 44px;
    border-radius: 100%;
    background-color: $color-primary;
    font-size: 16px;
    font-weight: 700;
    line-height: 44px;
    text-align: center;
  }
}
.c-ordersItem__image {
  background-color: $color-secondary;
}
.c-ordersItem__details {
  padding: 1rem 0 2rem;

  .c-h4 {
    font-size: 1.25rem;
  }

  p {
    font-size: 1rem;
    opacity: 0.9;
  }
}
.c-ordersItem__title,
.c-ordersItem__interval,
.c-ordersItem__variant,
.c-ordersItem__price {
  margin-bottom: 0;
}
</style>
