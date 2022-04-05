<template>
  <div class="c-plp o-containerFullWidth">
    <c-page-hero :content="heroContent" class="c-plp__hero" />
    <section class="c-plp__body">
      <nav class="c-plp__body--nav">
        <ul>
          <li v-for="(collection, i) in collections" @click="activeNum = i">{{ collection.title }}</li>
        </ul>
      </nav>
      <article>
        <h3>{{ collections[activeNum].title }}</h3>
        <div class="c-plp__body--grid">
          <div
            v-for="(product, index) in collections[activeNum].products"
            :key="index"
            class="c-plpGrid__item"
            v-if="product.available"
          >
            <c-product-card :product="product" />
          </div>
        </div>

        <!--         <hr />
        <h3>{{ collections[activeNum].title }}</h3>
        <div class="c-plp__body--grid">
          <div
            v-for="(product, index) in collections[activeNum].products"
            :key="index"
            class="c-plpGrid__item"
            v-if="product.available"
          >
            <c-product-card :product="product" />
          </div>
        </div> -->
      </article>
    </section>
  </div>
</template>

<script>
import { formatPrice } from '../utils'
import cProductCard from './sections/cProductCard.vue'
import cPageHero from '@shared/components/parts/cPageHero.vue'

export default {
  name: 'Plp',
  data: () => ({
    ...window.Scoutside.plp,
    activeNum: 0
  }),
  components: {
    cProductCard,
    cPageHero
  },
  computed: {
    // price() {
    //   return `Starts at ${formatPrice(this.product.price)}`
    // },
    collections() {
      return this.sub_collection_items
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
    heroContent() {
      let obj = {}
      Object.entries(this.$data).map(([key, val]) => {
        if (key.includes('hero_')) {
          const label = key.replace('hero_', '')
          obj[label] = val
        }
      })
      return obj
    }
    // ratingsCount() {
    //   return this.rating_count ? this.rating_count : 0
    // },
    // ratings() {
    //   return this.rating ? JSON.parse(this.rating) : null
    // }
  },
  methods: {
    // onResize() {
    //   this.isMobile = window.innerWidth < 768
    // },
    handleAdd() {
      this.loading = true

      ////// Add Shared Cart function here.

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
  }
  // beforeDestroy() {
  //   if (typeof window !== 'undefined') {
  //     window.removeEventListener('resize', this.onResize, { passive: true })
  //   }
  // },
  // beforeMount() {
  //   this.onResize()
  //   window.addEventListener('resize', this.onResize, { passive: true })
  // }
}
</script>

<style lang="scss">
.c-plp {
  position: relative;

  &__body {
    position: relative;
    height: 100%;
    overflow: visible;
    display: flex; /* enables flex content for its children */
    box-sizing: border-box;
    padding: 3.5rem 0;

    & > nav,
    article {
      height: 100%; /* allows both columns to span the full height of the browser window */
      display: flex;
      flex-direction: column;

      flex-grow: 1; /* ensures that the container will take up the full height of the parent container */
      overflow-y: auto;
    }

    nav {
      position: sticky;
      top: 100px;
      flex-shrink: 0; /* makes sure that content is not cut off in a smaller browser window */

      li {
        cursor: pointer;
      }
    }

    &--grid {
      display: grid;
      grid-template: auto / repeat(3, 1fr);
      grid-gap: 2rem;
    }

    @include media-desktop-up {
      width: 92vw;
      max-width: 1600px;
      margin: 0 auto;

      nav {
        width: 20%;
      }
    }
  }

  &__hero {
    .c-homeHero {
      height: auto;
    }

    .c-topHero__imgWrap {
      flex: 1;
    }

    .c-topHero__ctaWrap {
      &--inner {
        h4 {
          letter-spacing: 1px;
        }
      }

      @include media-desktop-up {
        padding: 0;

        &--inner {
          padding: 3rem 0 3rem 4vw;
          max-width: 75%;
        }
      }
    }
  }
}
</style>
