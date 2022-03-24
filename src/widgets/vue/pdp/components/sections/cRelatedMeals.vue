<template>
  <div class="c-relatedMeals__container">
    <h4 class="c-h4 c-relatedMeals__title">{{ this.labels.related }}</h4>
    <div class="c-relatedMeals__wrapper">
      <div v-for="(product, index) in relatedProducts" :key="index" class="c-relatedMeals__product">
        <c-product-card v-if="product.available" :product="product" />
      </div>
    </div>
  </div>
</template>
<script>
import cProductCard from './cProductCard.vue'

export default {
  props: {
    labels: {
      type: Object,
      required: true
    },
    products: {
      type: Array,
      required: true
    }
  },
  components: {
    cProductCard
  },
  computed: {
    relatedProducts() {
      const productsJson = this.products.filter(element => element.available)
      const additionalProductsJson = this.products.filter(element => element.nutritional_info)
      const productsData = productsJson.map((element, index) => ({
        ...element,
        url: additionalProductsJson[index].url.includes(element.handle)
          ? additionalProductsJson[index].url
          : `/proudcts/${element.handle}`,
        flag: additionalProductsJson[index].flag,
        nutritional_info: additionalProductsJson[index].nutritional_info,
        subtitle: additionalProductsJson[index].subtitle
      }))

      return productsData
    }
  }
}
</script>
<style lang="scss">
.c-relatedMeals__container {
  width: 100%;
  border-top: 1px solid $color-white;
  padding: 27px 0px;
  margin-top: 30px;

  @include media-desktop-up {
    padding: 40px 0px;
  }
}
.c-relatedMeals__title {
  font-size: 18px;
  text-align: center;
  letter-spacing: -0.02em;
  margin-bottom: 27px;

  @include media-tablet-up {
    font-size: 30px;
    margin-bottom: 40px;
  }
}
.c-relatedMeals__wrapper {
  display: flex;
  justify-content: space-between;
  flex-direction: column;

  @include media-desktop-up {
    flex-direction: row;
  }
}
.c-relatedMeals__product {
  margin-bottom: 10px;

  @include media-desktop-up {
    flex-basis: calc(100% / 4 - 32px);
    margin-bottom: 0;
  }

  &:last-child {
    margin-bottom: 0;
  }
}
</style>
