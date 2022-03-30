<template>
  <div class="pdp__container">
    <div class="pdp__main">
      <cProductGallery class="main__column" :autoplay="gallery_autoplay" :images="product.images" />

      <section class="pdp__content">
        <div class="pdp__content--wrap">
          <h1 class="c-h1 c-heading">{{ product.title }}</h1>
          <h5 v-if="subtitle" class="c-h5 pdp__content--wrap__subheader">{{ subtitle }}</h5>
          <h5 v-if="price" class="c-h5 pdp__content--wrap__price">{{ price }}</h5>

          <div class="pdp__content--ctas">
            <c-button
              class="c-cta pdp__main--atcButton"
              @click="isCustomer ? handleAdd : handleGetStarted"
              :loading="loading"
              :text="isCustomer ? (added ? addedTxt : labels.atc) : labels.getStarted"
              :modifiers="['isDefault', 'isPrimary', 'hideTextLoading']"
              :attributes="{ disabled: loading }"
              :class="added ? 'item--added' : null"
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
import { formatPrice } from '../utils'
import cProductGallery from '@shared/components/parts/cProductGallery.vue'
import cButton from '@shared/components/core/cButton.vue'
import cSelectTabs from '@shared/components/parts/cSelectTabs.vue'
import cRelatedMeals from './sections/cRelatedMeals.vue'

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
    isCustomer() {
      return customer.email && customer.shopify_id ? true : false
    }
  },
  methods: {
    onResize() {
      this.isMobile = window.innerWidth < 768
    },
    handleAdd() {
      this.loading = true

      /// Add Shared Cart function here.

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

  @include media-desktop-up {
    padding: 0px 80px 64px;
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
  }
  .main__column {
    flex: 1.5;
    justify-self: flex-end;
  }
  .pdp__content {
    flex: 2;

    &--wrap {
      max-width: clamp(390px, 45vw, 1000px);

      .c-heading {
        margin-bottom: 0;
      }

      &__subheader {
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
