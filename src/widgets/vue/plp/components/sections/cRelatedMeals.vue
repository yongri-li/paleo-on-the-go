<template>
  <div class="c-relatedMeals o-containerLarge">
    <h2 class="c-h2">
      <!-- <span class="u-highlightText--secondary">{{ heading[0] }}</span> {{ heading[1] }} -->
    </h2>
    <div class="c-relatedMeals__container">
      <div class="c-relatedMeals__control isPrev" data-menu-prev>
        <c-svg class="c-relatedMeals__control--icon" name="chevron" />
      </div>
      <div class="c-relatedMeals__control isNext" data-menu-next>
        <c-svg class="c-relatedMeals__control--icon" name="chevron" />
      </div>
    </div>
    <div class="c-relatedMeals__slider slider" data-menu-slider>
      <div v-for="(product, index) in products" :key="index" class="c-relatedMeals__product">
        <c-product-card v-if="product.available" :product="product" />
      </div>
      <!--       <div class="c-relatedMeals__slider__grid-item" v-for="product in wildcardz" :key="product.id">
        <c-product
          :product="product"
          :likable="account"
          :liked="favoritesIds.includes(product.id)"
          :quantity="getItemQuantity(product.id)"
          @qtyIncrease="() => handleQtyIncrease(product)"
          @qtyDecrease="() => handleQtyDecrease(product)"
          @toggleLiked="() => handleToggleFavorited(product)"
          @storeBundleState="setBundleItems"
        />
      </div> -->
      <!--  </div>  -->
    </div>
  </div>
</template>

<script>
import cProductCard from './cProductCard.vue'
import cSvg from '@shared/components/core/cSvg.vue'
import { tns } from 'tiny-slider/src/tiny-slider'

export default {
  props: {
    labels: {
      type: Object
    },
    products: {
      type: Array,
      required: true
    }
  },
  components: {
    cProductCard,
    cSvg
  },
  computed: {
    // heading() {
    //   const heading = this.labels.related?.split(' ')
    //   return [heading[0], heading[1]]
    // }
    // relatedProducts() {
    //   const productsJson = this.products.filter(element => element.available)
    //   const additionalProductsJson = this.products.filter(element => element.nutritional_info)
    //   const productsData = productsJson.map((element, index) => ({
    //     ...element,
    //     url: additionalProductsJson[index].url.includes(element.handle)
    //       ? additionalProductsJson[index].url
    //       : `/proudcts/${element.handle}`,
    //     flag: additionalProductsJson[index].flag,
    //     nutritional_info: additionalProductsJson[index].nutritional_info,
    //     subtitle: additionalProductsJson[index].subtitle
    //   }))
    //   return productsData
    // }
  },
  methods: {
    async runTns() {
      var slider = tns({
        container: '.slider',
        nextButton: '[data-menu-next]',
        prevButton: '[data-menu-prev]',
        items: 1,
        slideBy: 'page',
        nav: false,
        responsive: {
          900: {
            controls: true,
            items: 3
          },
          1200: {
            controls: true,
            items: 4
          }
        }
      })
    }
  },
  mounted() {
    this.$nextTick(() => setTimeout(() => this.runTns(), 250))
  }
}
</script>

<style lang="scss">
.c-relatedMeals {
  position: relative;

  @include media-tablet-up {
    margin-top: 4rem;
  }

  @include media-mobile-down {
    margin-top: 3.5rem;

    &__container {
      top: 0.25rem;
    }

    .u-highlightText--secondary {
      display: inline;
    }
  }

  &__container {
    position: absolute;
    display: flex;
    justify-content: space-between;
    top: 1.25rem;
    z-index: 1;
    width: 4.5rem;
    right: 0;

    .isNext {
      transform: rotate(180deg);
    }
  }

  &__control {
    position: relative;
    display: flex !important;
    align-items: center;
    justify-content: center;
    width: 30px;
    height: 30px;
    background-color: $color-ecru;
    border-radius: 50%;
    cursor: pointer;
    z-index: 1;

    &--icon {
      height: 1rem;
      width: 1rem;
    }
  }

  &__slider {
    display: flex;

    .tns-transparent {
      opacity: 1;
      visibility: visible;
    }

    @include media-tablet-up {
      gap: 10px;
    }
  }
}

/*
.c-relatedMeals .c-relatedMeals__container .c-relatedMeals__control:hover {
  background: #1f5940;
}

.c-relatedMeals .c-relatedMeals__container .c-relatedMeals__control svg path {
  stroke: #fffefa;
  fill: #fffefa;
}*/

/*@media only screen and (max-width: 767px) {
  .tns-controls [data-controls='prev'] {
    left: 10px;
  }

  .tns-controls [data-controls='next'] {
    right: 10px;
  }

  .c-basketPage.c-mealsStep > .o-containerLarge {
    overflow-y: auto;
    height: 100vh;
    padding-bottom: 300px;
    margin-top: 41px;
  }
}*/
</style>
