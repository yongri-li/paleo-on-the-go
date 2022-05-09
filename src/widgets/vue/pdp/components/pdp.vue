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
            <!-- <a href="#shopify-product-reviews">test link</a> -->
          </div>
          <h1 class="c-h1 c-heading">{{ product.title }}</h1>
          <h5 v-if="subtitle" class="c-h5 pdp__content--wrap__subheader">{{ subtitle }}</h5>

          <cVariantTabs v-if="isSwag" :variantInfo="variants" @selectedVar="selectVariant" />

          <h5 v-if="price" class="c-h5 pdp__content--wrap__price">{{ price }}</h5>

          <div class="pdp__content--ctas">
            <cBtnQty
              v-if="isSwag"
              :quantity="quantity"
              @qtyIncrease="qtyChange('add')"
              @qtyDecrease="qtyChange('minus')"
            />
            <c-button
              class="c-cta pdp__main--atcButton"
              @click="handleCTA"
              :loading="loading"
              :text="isCustomer || isSwag ? (added ? addedTxt : labels.atc) : labels.getStarted"
              :modifiers="['isDefault', 'isPrimary', 'hideTextLoading']"
              :attributes="{ disabled: loading || added }"
              :class="added ? 'item--added' : null"
            />
          </div>

          <cSelectTabs :pdpinfo="info" :isSwag="isSwag" />
        </div>
      </section>
    </div>

    <c-related-meals :products="related_products" :labels="labels" />

    <c-button
      ref="fixedCTA"
      class="c-cta pdp__main--atcButton mobileBottom__cta u-hideTabletUp"
      @click="handleCTA"
      :loading="loading"
      :text="isCustomer ? (added ? addedTxt : labels.atc) : labels.getStarted"
      :modifiers="['isDefault', 'isPrimary', 'hideTextLoading']"
      :class="added ? 'item--added' : null"
    />
  </div>
</template>

<script>
import { mapActions, mapMutations } from 'vuex'
import { formatPrice } from '../utils'
import cProductGallery from '@shared/components/parts/cProductGallery.vue'
import cButton from '@shared/components/core/cButton.vue'
import cSelectTabs from '@shared/components/parts/cSelectTabs.vue'
import cVariantTabs from '@shared/components/parts/cVariantTabs.vue'
import cBtnQty from '@shared/components/core/cBtnQty.vue'
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
    addedTxt: 'Added',
    quantity: 1,
    selectedVar: null
  }),
  components: {
    cProductGallery,
    cButton,
    cRelatedMeals,
    cSelectTabs,
    cVariantTabs,
    cBtnQty
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
    isSwag() {
      return this.is_swag === 'true'
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
    },
    variants() {
      return this.product.variants
    },
    selectedVariant() {
      return this.variants[this.selectedVar]
    }
  },
  methods: {
    ...mapMutations('cartdrawer', ['ADD_GENERAL_TO_CART', 'CLEAR_GENERAL']),
    onResize() {
      this.isMobile = window.innerWidth < 768
    },
    qtyChange(operator) {
      operator === 'add' ? (this.quantity += 1) : this.quantity > 1 && (this.quantity -= 1)
    },
    selectVariant(val) {
      this.selectedVar = val
    },
    getStarted() {
      sessionStorage.setItem('startBtnClk', true)
      sessionStorage.setItem('boxSize', 12)
      window.location = '/pages/bundle/#/subscriptions'
    },
    addToCart() {
      const variantProduct = {
        ...this.product,
        quantity: this.quantity,
        varId: this.selectedVariant.id,
        varNum: this.selectedVar,
        varPrice: this.selectedVariant.price,
        varTitle: this.selectedVariant.title,
        order_type: 'general'
      }
      this.ADD_GENERAL_TO_CART(variantProduct)
      setTimeout(() => {
        this.loading = false
        this.added = true
      }, 625)
    },
    handleCTA() {
      this.loading = true
      this.isSwag ? this.addToCart() : this.getStarted()
    },
    scrollToReviews() {
      const reviews = document.getElementById('shopify-product-reviews')
      reviews.scrollIntoView({ behavior: 'smooth', block: 'center' })
    },
    dragToScroll() {
      const ele = document.querySelector('.pdp__thumbnails')
      ele.style.cursor = 'grab'

      let pos = { top: 0, left: 0, x: 0, y: 0 }

      const mouseDownHandler = e => {
        ele.style.cursor = 'grabbing'
        ele.style.userSelect = 'none'

        pos = {
          left: ele.scrollLeft,
          top: ele.scrollTop,
          // Get the current mouse position
          x: e.clientX,
          y: e.clientY
        }

        document.addEventListener('mousemove', mouseMoveHandler)
        document.addEventListener('mouseup', mouseUpHandler)
      }

      const mouseMoveHandler = e => {
        // How far the mouse has been moved
        const dx = e.clientX - pos.x
        const dy = e.clientY - pos.y

        // Scroll the element
        ele.scrollTop = pos.top - dy
        ele.scrollLeft = pos.left - dx
      }

      const mouseUpHandler = () => {
        ele.style.cursor = 'grab'
        ele.style.removeProperty('user-select')

        document.removeEventListener('mousemove', mouseMoveHandler)
        document.removeEventListener('mouseup', mouseUpHandler)
      }

      ele.addEventListener('mousedown', mouseDownHandler)
    },
    showCTAonScrollPast() {
      const toggleClassOnScroll = () => {
        let scrollY = window.scrollY
        const cta = this.$refs.fixedCTA.$el
        scrollY > 768 ? cta.classList.add('scrolledPast') : cta.classList.remove('scrolledPast')
      }
      document.addEventListener('scroll', toggleClassOnScroll, { passive: true })
    }
  },
  mounted() {
    window.addEventListener('load', e => {
      function setLeaves() {
        const leafIcon = `<svg width="18" height="30" viewBox="0 0 18 30" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M9.16859 -3.09007e-05L0.403564 16.3262L8.03129 23.6963L8.03129 29.0255L10.2961 29.0255L10.2961 23.6963L17.9238 16.3262L9.16859 -3.09007e-05ZM3.20759 15.891L8.03129 6.89608L8.03129 20.5626L3.20759 15.891ZM10.2961 6.89608L15.1296 15.891L10.2961 20.5626L10.2961 6.89608Z" fill="#8ECEAB"/>
        </svg>`
        const rateStars = document.querySelectorAll('.spr-icon-star')
        const unrateStars = document.querySelectorAll('.spr-icon-star-empty')
        rateStars.forEach(star => (star.innerHTML = leafIcon))
        unrateStars.forEach(star => {
          star.innerHTML = leafIcon
          star.style.opacity = '0.5'
        })
      }
      setTimeout(() => setLeaves(), 301)
    })

    this.dragToScroll()
    this.showCTAonScrollPast()
  },
  beforeDestroy() {
    if (typeof window !== 'undefined') {
      window.removeEventListener('resize', this.onResize, { passive: true })
    }
    document.removeEventListener('scroll', this.showCTAonScrollPast, { passive: true })
  },
  beforeMount() {
    this.onResize()
    window.addEventListener('resize', this.onResize, { passive: true })
  }
}
</script>

<style lang="scss">
.spr-starrating .spr-icon-star:before {
  content: '';
}

.spr-icon {
  color: green;
}

.c-pdp {
  position: relative;

  .pdp__main {
    position: relaive;
    display: flex;
    flex-flow: column;
    background-color: $color-ecru;
    overflow: hidden;

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
      overflow-x: auto;
      overflow-y: hidden;
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
        display: flex;
        gap: 2rem;
        align-items: center;
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
