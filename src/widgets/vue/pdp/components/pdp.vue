<template>
  <div class="pdp__container">
    <div class="pdp__sub-nav"></div>

    <div class="pdp__main">
      <c-product-gallery class="main__column" :autoplay="gallery_autoplay" :images="product.images" />
      <c-product-form
        class="main__column"
        :blurbContent="blurbContent"
        :isFullPage="isFullPage"
        :labels="labels"
        :product="product"
        :productDetails="product_details"
        :productNutrition="nutritional_info"
      />
    </div>

    <div class="pdp__bodyMobile u-hideTabletUp">
      <span class="c-eyebrow pdp__mobileEyebrow">mobile sub header</span>
      <h4 class="c-h4 pdp__mobileDescription">{{ this.product_details.mobile_description }}</h4>
      <c-product-blurb :content="blurbContent" />

      <span class="c-eyebrow pdp__mobileEyebrow">{{ this.labels.nutriMobile }}</span>
      <c-nutrition-counter :content="nutritional_info" />
    </div>

    <div v-if="isFullPage" class="pdp__bodyLower">
      <span class="c-eyebrow pdp__bodyLowerEyebrow u-hideMobileDown">{{ this.labels.nutriDesktop }}</span>

      <div class="bodyLower__column">
        <c-nutrition-ingredients
          :isMobile="isMobile"
          :labels="labels"
          :highlightedIngredients="product_details.ingredients_highlighted"
          :otherIngredients="product_details.other_ingredients"
        />
        <c-nutrition-prepare :labels="labels" :content="product_details.how_to_prepare" />
      </div>

      <!-- <c-related-meals :products="related_products" :labels="labels" /> -->
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import cProductGallery from './sections/cProductGallery.vue'
import cProductForm from './sections/cProductForm.vue'
import cProductBlurb from './sections/cProductBlurb.vue'
import cNutritionCounter from './sections/cNutritionCounter.vue'
import cNutritionIngredients from './sections/cNutritionIngredients.vue'
import cNutritionPrepare from './sections/cNutritionPrepare.vue'
import cRelatedMeals from './sections/cRelatedMeals.vue'
// import cSvg from '@shared/components/core/cSvg.vue'

export default {
  name: 'Pdp',
  data: () => ({
    ...window.Scoutside.pdp,
    controllerData: [],
    isFullPage: false,
    isMobile: false
  }),
  components: {
    cProductGallery,
    cProductForm,
    cProductBlurb,
    cNutritionCounter,
    cNutritionIngredients,
    cNutritionPrepare,
    cRelatedMeals
  },
  computed: {
    labels() {
      let arr = {}
      Object.entries(this.$data).forEach(([key, value]) => {
        if (key.includes('label_')) {
          const label = key.replace('label_', '')
          arr[label] = value
        }
      })
      return arr
    },
    blurbContent() {
      return {
        fresh_text: this.fresh_text,
        fresh_icon: this.fresh_icon,
        regular_text: this.regular_text,
        regular_icon: this.regular_icon
      }
    },
    productSubTitle() {
      const product_title = this.product.title.toLowerCase()
      if (product_title.includes('with')) {
        return `with${product_title.split('with')[1]}`
      } else {
        return false
      }
    },
    productTitle() {
      const product_title = this.product.title.toLowerCase()
      if (product_title.includes('with')) {
        return `${product_title.split('with')[0]}`
      } else {
        return this.product.title
      }
    },
    productTitles() {
      return {
        title: this.product.title,
        subtitle: this.product_details.subtitle
      }
    },
    subNavLink() {
      const bundleLnk = sessionStorage.getItem('bundle_url')
      const lastPg = document.referrer
      return bundleLnk ? bundleLnk : lastPg
    },
    isCustomer() {
      return customer.email && customer.shopify_id ? true : false
    },
    ...mapState([
      'account',
      'children',
      'bundle',
      'navigation',
      'plans',
      'selectedPlan',
      'types',
      'sortOptionsNewCustomer',
      'sortOptionsExistingCustomer',
      'customer',
      'activeStep',
      'masterCollections'
    ])
  },
  methods: {
    onResize() {
      this.isMobile = window.innerWidth < 768
    },
    showFullPageIfCustomer() {
      if (this.isCustomer) this.isFullPage = true
    },
    useRefPathToSetFullPage() {
      const prevPath = document.referrer
      if (prevPath.includes('/collections/')) {
        this.isFullPage = true
      }
    },
    checkForParams() {
      const queryString = window.location.search
      const urlParams = new URLSearchParams(queryString)
      if (urlParams.has('quickview')) {
        const isQuickview = urlParams.get('quickview')
        if (isQuickview) {
          this.controllerData.includes('fullPage') ? '' : this.controllerData.push('fullPage')
        }
      }
    },
    hideMainNavonFullPage() {
      const fullPgClass = document.querySelector('.pdp__fullpage')
      const mainNav = document.querySelector('.c-headerMain__wrapper')
      const mainNavLf = document.querySelector('.c-headerMain__primary')
      const mainNavRt = document.querySelector('.c-headerMain__secondary')
      if (fullPgClass) {
        mainNav.style.justifyContent = 'center'
        mainNavLf.style.display = 'none'
        mainNavRt.style.display = 'none'
      }
    },
    backToMeals() {
      sessionStorage.setItem('from_pdp', 'true')
    }
  },
  beforeDestroy() {
    if (typeof window !== 'undefined') {
      window.removeEventListener('resize', this.onResize, { passive: true })
    }
  },
  beforeMount() {
    this.checkForParams()
    this.onResize()
    this.useRefPathToSetFullPage()
    window.addEventListener('resize', this.onResize, { passive: true })
  },
  mounted() {
    this.hideMainNavonFullPage()
    this.showFullPageIfCustomer()
  }
}
</script>

<style lang="scss">
.pdp__control {
  border: 2px solid red;
  position: fixed;
  bottom: 0;
  left: 0;
  height: 70px;
  width: 400px;
  background: #fff;
  z-index: 999;
}
.pdp__container {
  padding: 40px 15px 20px;
  position: relative;

  @include media-tablet-up {
    padding: 0px 15px 45px;
  }

  @include media-desktop-up {
    padding: 0px 80px 64px;
  }
}
.pdp__sub-nav {
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  border-bottom: 1px solid $color-white;
  background: $color-white;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  font-weight: 600;

  @include media-tablet-up {
    position: relative;
    height: 68px;
    border-color: transparent;
    background: transparent;
    cursor: auto;
  }

  @include media-tablet-down {
    padding-left: 10px;
  }
}
.sub-nav__link {
  display: grid;
  grid-column-gap: 8px;
  grid-template-rows: 1fr;
  font-size: 14px;
  color: $color-grey;
  letter-spacing: 0.01em;
  margin-bottom: 0px;
  height: 100%;
  width: 100%;
  justify-content: flex-start;
  align-items: center;
  cursor: pointer;

  @include media-tablet-up {
    height: auto;
    width: auto;
  }

  svg {
    position: relative;
    top: -1px;
  }
  > span {
    font-weight: 600;
    grid-row: 1;
  }
}
.pdp__main {
  display: flex;
  flex-flow: column-reverse;
  padding-bottom: 35px;
  padding-top: 38px;

  @include media-tablet-up {
    display: flex;
    flex-flow: row;
    padding-top: 0px;
  }
  .main__column {
    flex: 1;
  }
}

.pdp__bodyMobile {
  text-align: center;
  display: flex;
  flex-flow: column;
  justify-content: center;
  padding-top: 35px;
  border-top: 1px solid $color-white;
}

.pdp__mobileEyebrow {
  padding-bottom: 20px;

  @include media-tablet-up {
    padding-bottom: 10px;
  }
}

.pdp__mobileDescription {
  font-size: 18px;
  line-height: 27px;
  letter-spacing: -0.02em;
  text-align: center;
}

.pdp__bodyLower {
  width: 100%;
  display: flex;
  flex-flow: column;
  flex-wrap: wrap;

  @include media-tablet-up {
    flex-flow: row;
    flex-wrap: wrap;
    padding: 40px 0px;
    border-top: 1px solid $color-white;
  }
  @include media-desktop-up {
    padding: 40px 60px;
  }
}

.bodyLower__column {
  flex: 1;

  &:nth-child(3) {
    padding-top: 24px;

    @include media-tablet-up {
      padding-top: 0px;
      padding-left: 25px;
    }

    @include media-desktop-up {
      padding-left: 60px;
    }
  }
}

.pdp__bodyLowerEyebrow {
  padding-bottom: 32px;
  text-align: center;
}
</style>
