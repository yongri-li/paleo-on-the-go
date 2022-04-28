<template>
  <div class="c-plp o-containerFullWidth">
    <c-FilterNav
      v-if="isMobile"
      :items="filterItems"
      :isOpen="isFilterOpen"
      :collections="collections"
      @getFilters="addFilterTag"
      @trigger="triggerFilters"
      @collection="updateCollection"
    />
    <c-page-hero :content="content[0]" class="c-plp__hero" />
    <section class="c-plp__body">
      <c-FilterNav
        v-if="!isMobile"
        :items="filterItems"
        :totalItems="asd"
        :isOpen="isFilterOpen"
        :collections="collections"
        @getFilters="addFilterTag"
        @trigger="triggerFilters"
        @collection="updateCollection"
      />
      <article>
        <section
          class="c-plp__body--collection"
          v-for="(collection, index) in collections"
          :data-anchor="collection.title"
          ref="cols"
        >
          <h2 class="c-h2">{{ collection.title }}</h2>
          <span v-html="collection.short_description"></span>
          <div class="c-plp__body--grid">
            <div
              v-for="(product, index) in filterProducts(index)"
              :key="index"
              class="c-plpGrid__item"
              v-if="product.available"
            >
              <c-product-card :product="product" title="Filter" />
            </div>
          </div>
        </section>
      </article>
    </section>
  </div>
</template>

<script>
import { formatPrice } from '../utils'
import cProductCard from '@shared/components/parts/cProductCard.vue'
import cPageHero from '@shared/components/parts/cPageHero.vue'
import cFilterNav from '@shared/components/core/cFilterNav.vue'
import cSvg from '@shared/components/core/cSvg.vue'

export default {
  name: 'Plp',
  data: () => ({
    ...window.Scoutside.plp,
    isMobile: false,
    filterTags: [],
    isFilterOpen: false,
    asd: 0
  }),
  components: {
    cPageHero,
    cProductCard,
    cFilterNav,
    cSvg
  },
  computed: {
    // totalItems() {
    //   const arrs = this.$refs.cols.map(el => el.children[2].children.length)
    //   return arrs.reduce((acc, cur) => acc + cur)
    // },
    filterItems() {
      return [
        { icon: 'noGMO', name: 'Coconut Free' },
        { icon: 'noGMO', name: 'Seafood Free' },
        { icon: 'noGMO', name: 'Pork Free' },
        { icon: 'noGMO', name: 'Cassava Free' }
      ]
    },
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
    content() {
      const getContent = label => {
        let obj = {}
        Object.entries(this.$data).map(([key, val]) => {
          if (key.startsWith(label)) {
            const name = key.replace(label, '')
            obj[name] = val
          }
        })
        return obj
      }
      const hero = getContent('hero_')
      const banner = getContent('banner_')
      return [hero, banner]
    }
    // filteredProducts() {
    //   return this.collections[this.activeNum].products.filter(prd => {
    //     if (prd.tags.some(tag => this.filterTags.includes(tag))) return prd
    //   })
    // },
    // filteredCollection() {
    //   return !this.filterTags.length ? this.collections[this.activeNum].products : this.filteredProducts
    // }
  },
  methods: {
    triggerFilters(trigger) {
      this.isFilterOpen = trigger
    },
    updateCollection(num) {
      const selectedCollection = this.$refs.cols[num]
      selectedCollection.scrollIntoView({ behavior: 'smooth', block: 'start' })
      // this.totalItems()
    },
    addFilterTag(filters) {
      this.filterTags = filters
      this.totalItems()
    },
    clearFilters() {
      this.filterTags = []
    },
    filterProducts(index) {
      let results = []
      if (!this.filterTags.length) return this.collections[index].products
      this.collections[index].products.filter(prd => {
        if (prd.tags.some(tag => this.filterTags.includes(tag))) results.push(prd)
      })
      return results
    },
    handleGetStarted() {
      this.loading = true
      this.isCustomer
        ? (window.location.href = '/account/#/details')
        : (window.location = this.url_getStarted)
    },
    onResize() {
      this.isMobile = window.innerWidth < 768 ? true : false
    },
    totalItems() {
      this.$nextTick(() => {
        setTimeout(() => {
          const arrs = this.$refs.cols.map(el => el.children[2].children.length)
          this.asd = arrs.reduce((acc, cur) => acc + cur)
        }, 25)
      })
    }
  },
  created() {
    if (window.innerWidth < 768) this.isMobile = true
    window.addEventListener('resize', this.onResize)
    // this.$nextTick(() => {
    //   setTimeout(() => this.totalItems(), 300)
    // })
  },
  beforeDestroy() {
    if (typeof window !== 'undefined') {
      window.removeEventListener('resize', this.onResize, { passive: true })
    }
  }
}
</script>

<style lang="scss">
.c-plp {
  position: relative;

  .c-topHero {
    height: auto;
  }

  &__body {
    position: relative;
    height: 100%;
    overflow: visible;
    display: flex;
    box-sizing: border-box;
    padding: 3.5rem 0;

    &--collection:not(:first-child) {
      /*margin-bottom: 2.5rem;*/
      margin-top: -1rem;
      padding-top: 6rem;
    }

    &--nav,
    article {
      height: 100%;
      display: flex;
      flex-direction: column;

      flex-grow: 1;
      overflow-y: auto;
    }

    article {
      .c-h2 {
        margin-bottom: 10px;
      }
    }

    &--nav {
      position: sticky;
      top: 129px;
      flex-shrink: 0;
      z-index: $z-index-top;

      li {
        cursor: pointer;
        margin: 1rem 0;
        transition: all 115ms;

        &.selected {
          font-weight: 600;
          text-decoration: underline;
        }
      }

      .trigger-filters {
        cursor: pointer;
        font-weight: 700;
        display: flex;
        align-items: center;
        grid-gap: 0.75rem;
        margin-bottom: 1.75rem;

        &__icon {
          opacity: 0.6;
        }

        &__copy {
          text-decoration: underline;
        }
      }
    }

    &--grid {
      display: grid;
      grid-template: auto / repeat(3, 1fr);
      grid-gap: 3rem;
    }

    @include media-desktop-up {
      width: 92vw;
      max-width: 1600px;
      margin: 0 auto;

      &--nav {
        width: 20%;
      }
    }

    @include media-mobile-down {
      &--nav {
        flex-direction: column-reverse;
        overflow: hidden;
        top: 105px;

        .c-plp__collectionList {
          overflow-y: scroll;
          background-color: $color-black;
          color: $color-white;

          ul {
            display: flex;
            width: fit-content;
            min-width: 100vw;

            li {
              width: 100%;
              white-space: nowrap;
              margin: 1rem;
            }
          }
        }
      }

      article {
        padding: 1rem;
      }

      &--grid {
        grid-gap: 1rem;
        grid-template: auto / 1fr;
      }

      .c-product {
        &__inner {
          display: flex;
          align-items: center;
          grid-gap: 0.75rem;
        }

        &__title {
          font-size: 1.125rem;
          margin: 0 0 0.25rem;
        }

        &__title-wrapper {
          font-size: 1rem;
        }

        &__image-side {
          flex: 1;
        }

        &__info {
          flex: 1.5;
        }

        &__flag {
          display: none;
        }
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
          margin-top: 0;
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
