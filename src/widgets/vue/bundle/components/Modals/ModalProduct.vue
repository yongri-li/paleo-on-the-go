<template>
  <div class="modal__product">
    <div class="modal__close" @click="closeModal">&#10006;</div>
    <!-- &#10005; -->
    <div class="modal__product--content">
      <div class="modal__product--figure">
        <c-product-gallery :images="product.images" :is-modal="true" class="modal__product--img" />
      </div>
      <div class="modal__product--data">
        <div class="modal__product--data-header">
          <div class="modal__product--data-title">
            {{ product.title }}
          </div>
          <div class="modal__product--data-subtitle">
            {{ product.subtitle }}
          </div>
        </div>
        <cVariantTabs v-if="isSwag" :variantInfo="variants" @selectedVar="selectVariant" />
        <cSelectTabs :pdpinfo="product.info" :isSwag="isSwag" class="modal__product--data-pills" />
        <c-button
          class="modal__product--add-to-cart"
          @click="addToCartModal"
          text="Add To Box"
          :modifiers="['isDefault', 'isPrimary', 'hideTextLoading']"
          :attributes="{ disabled: params.outOfStock }"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapMutations } from 'vuex'
import cProductGallery from '@shared/components/parts/cProductGallery.vue'
import cSelectTabs from '@shared/components/parts/cSelectTabs.vue'
import cButton from '@shared/components/core/cButton.vue'
import cVariantTabs from '@shared/components/parts/cVariantTabs.vue'

export default {
  components: {
    cProductGallery,
    cSelectTabs,
    cVariantTabs,
    cButton
  },
  props: {
    params: {
      type: Object
    }
  },
  data: () => ({
    selectedVar: null
  }),
  computed: {
    product() {
      return this.params.product
    },
    isSwag() {
      return this.product.tags.includes('swag') || this.product.type === 'Shirts'
    },
    variants() {
      return this.product.variants
    },
    selectedVariant() {
      return this.variants[this.selectedVar]
    },
    swagVariantInfo() {
      return {
        quantity: 1,
        varId: this.selectedVariant.id,
        varNum: this.selectedVar,
        varPrice: this.selectedVariant.price,
        varTitle: this.selectedVariant.title,
        order_type: 'general'
      }
    },
    imageUrl() {
      const imgFound = this.product.media.find(item => item.position === 1)
      const urlFinal = imgFound.src.replace('.jpg', '_800x800.jpg').replace('.png', '_800x800.png')
      return urlFinal
    },
    where() {
      const param = this.$route.params.box
      if (param === 'addons' && !this.isSwag) return 'addons'
      if (this.isSwag) return 'general'
      return 'items'
    }
  },
  methods: {
    ...mapActions('babcart', ['addToCart']),
    ...mapMutations('cartdrawer', ['ADD_GENERAL_TO_CART', 'CLEAR_GENERAL']),
    selectVariant(val) {
      this.selectedVar = val
    },
    closeModal() {
      this.$emit('close')
    },
    addToCartModal() {
      this.addToCart({
        product: this.product,
        where: this.where,
        varInfo: this.swagVariantInfo
      })
      // if (this.isSwag) {
      //   const variantProduct = {
      //     ...this.product,
      //     quantity: 1,
      //     varId: this.selectedVariant.id,
      //     varNum: this.selectedVar,
      //     varPrice: this.selectedVariant.price,
      //     varTitle: this.selectedVariant.title,
      //     order_type: 'general'
      //   }
      //   this.ADD_GENERAL_TO_CART(variantProduct)
      //   this.addToCart({
      //     product: this.product,
      //     where: this.where,
      //     varInfo: this.swagVariantInfo
      //   })
      // } else {
      //   this.addToCart({
      //     product: this.product,
      //     where: this.where,
      //     varInfo: this.swagVariantInfo
      //   })
      // }
      this.closeModal()
    }
  }
}
</script>

<style lang="scss">
.modal__product {
  background-color: $color-ecru;
  text-align: initial;
  left: 0;
  width: 100%;
  height: 90%;
  padding: 0;
  border-top-left-radius: 15px;
  border-top-right-radius: 15px;
  overflow: hidden;

  @include media-tablet-up {
    width: 84%;
    max-width: 1400px;
    left: 8%;
    height: 80%;
    min-height: 500px;
    max-height: 698px;
    border-radius: 0;
  }

  &--content {
    @include flex($direction: column);
    height: 100%;

    @include media-tablet-up {
      flex-direction: row;
    }
  }

  &--figure {
    height: 30%;
    overflow: hidden;
    width: 100%;

    @include media-tablet-up {
      width: 50%;
      height: 100%;
      overflow: initial;
    }
  }

  &--img {
    margin-top: 0;
    position: relative;
    height: 100%;

    section,
    .tns-outer,
    .tns-inner,
    .tns-slider,
    .tns-item,
    .pdp__galleryImageWrapper {
      height: 100%;
      max-height: none;
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    @include media-tablet-up {
      .pdp__thumbnails {
        position: absolute;
        bottom: 3%;
        top: auto;
        width: 100%;
        overflow: auto;
      }

      .pdp__thumbnailButton:hover {
        img {
          box-shadow: none;
        }
      }

      .pdp__thumbnail {
        height: 3.5rem;
        width: 3.5rem;
        min-width: unset;
      }
    }

    &--img .pdp__galleryImageWrapper {
      width: 100%;
    }
  }

  &--data {
    padding: 1rem;
    height: 70%;
    width: 100%;
    position: relative;
    @include flex($direction: column, $wrap: nowrap, $align: flex-start);

    @include media-tablet-up {
      height: 100%;
      width: 50%;
      padding: 3.25rem 3rem 1rem;
    }

    &-header {
      height: auto;
    }

    &-title {
      font-family: $font-heading;
      font-size: 2.63rem;

      @include media-tablet-up {
        font-size: 2.5rem;
      }
      @include media-desktop-up {
        font-size: 3rem;
      }
    }

    &-subtitle {
      color: #7b7979;
      font-size: 1rem;
      margin-bottom: 1.5rem;

      @include media-desktop-up {
        font-size: 1.7rem;
      }
    }

    &-pills {
      @include flex($direction: column, $wrap: nowrap);
      flex-grow: 1;
      height: auto;
      overflow: hidden;
      width: 100%;

      padding: 0 0 1rem;

      .pdp__tabs {
        &--wrap {
          overflow: auto;
          flex-shrink: 0;
          width: 100%;
          &::-webkit-scrollbar {
            display: none;
          }
        }
        &--tab {
          padding: 0.5rem 1rem;
          font-size: 0.88rem;
        }
        &--info {
          flex-grow: 1;
          overflow-y: auto;
          max-height: none;
          margin: 1rem 0 2.25rem;
          font-size: 0.88rem;
        }
      }

      @include media-tablet-up {
        .pdp__tabs {
          &--wrap {
            margin-bottom: 2rem;
            width: 100%;
            overflow: auto;
          }
          &--tab {
            margin-right: 10px;
            font-size: 1rem;
            &:last-child {
              margin-right: 0;
            }
          }
          &--info {
            font-size: 1.13rem;
          }
        }
      }
    }
  }

  &--add-to-cart {
    position: absolute;
    bottom: 0.25rem;
    left: 0;
    min-height: 53px;
    min-width: 100%;
    width: 100%;

    @include media-tablet-up {
      position: relative;
    }
  }

  .modal__close {
    background-color: $color-white;
    border: none;
    z-index: 5;

    @include media-tablet-up {
      background-color: $color-black;
      color: $color-white;
    }
  }

  @include media-mobile-down {
    height: 96%;

    &.modal__content {
      top: 4%;

      .tns-controls {
        display: none;
      }
    }
  }
}
</style>
