<template>
  <div class="c-pdp">
    <div class="pdp__main o-containerFullWidth">
      <cProductGallery
        class="main__column"
        :autoplay="gallery_autoplay"
        :images="product.images"
        :flag="flag"
      />

      <section class="pdp__content">
        <div class="pdp__content--wrap">
          <div class="rating__leaf--warp">
            <span
              v-html="ratingLeaf"
              v-for="(leaf, i) in 5"
              :data="i"
              :class="i + 1 > ratings ? 'unrated' : null"
            ></span>
            <button @click="scrollToReviews">{{ ratingsCount }} Reviews</button>
          </div>
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
    },
    ratingLeaf() {
      return `<svg width="18" height="30" viewBox="0 0 18 30" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M9.16859 -3.09007e-05L0.403564 16.3262L8.03129 23.6963L8.03129 29.0255L10.2961 29.0255L10.2961 23.6963L17.9238 16.3262L9.16859 -3.09007e-05ZM3.20759 15.891L8.03129 6.89608L8.03129 20.5626L3.20759 15.891ZM10.2961 6.89608L15.1296 15.891L10.2961 20.5626L10.2961 6.89608Z" fill="#8ECEAB"/>
      </svg>
      `
    },
    ratingsCount() {
      return this.rating_count ? this.rating_count : 0
    },
    ratings() {
      const rate = this.rating ? JSON.parse(this.rating) : null
      return rate ? Math.round(rate.value * 1) : 0
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
    },
    scrollToReviews() {
      const reviews = document.getElementById('shopify-product-reviews')
      reviews.scrollIntoView({ behavior: 'smooth', block: 'center' })
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
.c-pdp {
  position: relative;

  .pdp__main {
    position: relaive;
    display: flex;
    flex-flow: column;
    background-color: $color-ecru;

    @include media-tablet-up {
      display: flex;
      flex-flow: row;
      grid-gap: 3.5rem;
      /*   flex-flow: column-reverse;*/
    }

    @include media-desktop-up {
      padding: 3rem 4vw 5rem;
    }

    @include media-mobile-down {
      .pdp__gallery {
        width: 100vw;
      }
    }

    .main__column {
      flex: 1.5;
      justify-self: flex-end;
      height: 100%;
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

      @include media-mobile-down {
        padding: 1rem;
      }
    }
  }

  .rating__leaf--warp {
    display: inline-flex;
    grid-gap: 0.25rem;

    .unrated {
      opacity: 0.5;
    }

    button {
      border: none;
      background: none;
      font-family: Roboto;
      font-size: 1rem;
      text-decoration: underline;
    }
  }
}
</style>
