<template>
  <div class="pdp__container">
    <div class="pdp__sub-nav"></div>

    <div class="pdp__main">
      <c-product-gallery class="main__column" :autoplay="gallery_autoplay" :images="product.images" />

      <section class="pdp__content">
        <div class="pdp__content--wrap">
          <h1 class="c-h1 c-heading">{{ product.title }}</h1>
          <h5 v-if="subtitle" class="c-h5 pdp__content--wrap__subHeader">{{ subtitle }}</h5>
          <h5 v-if="price" class="c-h5 pdp__content--wrap__price">{{ price }}</h5>

          <div class="pdp__content--ctas">
            <c-button
              class="c-cta pdp__main--atcButton"
              @click="isCustomer ? handleAdd : handleGetStarted"
              :loading="loading"
              :text="isCustomer ? (added ? addedTxt : labels.atc) : labels.getStarted"
              :modifiers="['isDefault', 'isPrimary', 'hideTextLoading']"
              :attributes="{ disabled: loading }"
              :class="added ? 'item--added' : ''"
            />
          </div>

          <cSelectTabs :pdpinfo="info" />
        </div>
      </section>
    </div>

    <c-related-meals :products="related_products" :labels="labels" />
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import { formatPrice, handleize } from '../utils'
import cProductGallery from './sections/cProductGallery.vue'
import cButton from '@shared/components/core/cButton.vue'
import cRelatedMeals from './sections/cRelatedMeals.vue'
import cSelectTabs from '@shared/components/parts/cSelectTabs.vue'

export default {
  name: 'Pdp',
  data: () => ({
    ...window.Scoutside.pdp,
    controllerData: [],
    isFullPage: true,
    isMobile: false,
    loading: false,
    added: false,
    addedTxt: 'Added'
  }),
  components: {
    cProductGallery,
    cButton,
    cRelatedMeals,
    cSelectTabs
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
    price() {
      return `Starts at ${formatPrice(this.product.price)}`
    },
    subNavLink() {
      const bundleLnk = sessionStorage.getItem('bundle_url')
      const lastPg = document.referrer
      return bundleLnk ? bundleLnk : lastPg
    },
    isCustomer() {
      return customer.email && customer.shopify_id ? true : false
    },
    ...mapState([])
  },
  methods: {
    onResize() {
      this.isMobile = window.innerWidth < 768
    },
    orParams() {
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
    handleAdd() {
      this.loading = true

      sessionStorage.setItem('from_pdp', 'true')

      // const item = this.product
      // const mealJson = sessionStorage.getItem('bundle_content')
      // const addonJson = sessionStorage.getItem('addon_content')
      // const meals = JSON.parse(mealJson)
      // const addons = JSON.parse(addonJson)
      // let qty

      // if (this.isFreshAddOn) {
      //   for (const itmQty in addons) {
      //     if (addons[itmQty].id === item.id) {
      //       qty = addons[itmQty].quantity
      //     }
      //   }
      // } else {
      //   for (const itmQty in meals) {
      //     if (meals[itmQty].id === item.id) {
      //       qty = meals[itmQty].quantity
      //     }
      //   }
      // }

      // item.quantity = qty + 1
      // sessionStorage.setItem('addcart_item', JSON.stringify(item))
      // if (this.isFreshAddOn) {
      //   sessionStorage.setItem('is_addOn', true)
      // } else {
      //   sessionStorage.setItem('is_addOn', false)
      // }

      // sessionStorage.setItem('from_pdp', 'true');
      setTimeout(() => {
        this.loading = false
        this.added = true
      }, 1000)
    },
    handleGetStarted() {
      this.loading = true
      this.isCustomer
        ? (window.location.href = '/account/#/details')
        : (window.location = this.url_getStarted)
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
    window.addEventListener('resize', this.onResize, { passive: true })
  }
}
</script>

<style lang="scss">
.pdp__container {
  position: relative;
  background-color: $color-ecru;
  padding: 2rem 1rem;

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
  padding: 2rem 0 5rem;

  @include media-tablet-up {
    display: flex;
    flex-flow: row;
    grid-gap: 3.5rem;
    padding-top: 0px;
  }
  .main__column {
    flex: 1.5;
    justify-self: flex-end;
  }
  .pdp__content {
    flex: 2;

    &--wrap {
      max-width: clamp(300px, 45vw, 1000px);

      .c-heading {
        margin-bottom: 0;
      }

      &__subHeader {
        color: $color-info;
        padding-top: 10px;
        font-size: 1.5rem;
        padding: 0;
        margin-bottom: 1.25rem;
      }
    }

    &--ctas {
      margin: 1.5rem 0 0.5rem;
    }
  }
}
</style>
