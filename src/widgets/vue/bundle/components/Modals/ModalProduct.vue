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
        <c-select-tabs :pdpinfo="product.info" class="modal__product--data-pills" />
        <div class="modal__product--add-to-cart" @click="addToCartModal">Add To Box</div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import cProductGallery from '@shared/components/parts/cProductGallery.vue'
import cSelectTabs from '@shared/components/parts/cSelectTabs.vue'

export default {
  components: {
    cProductGallery,
    cSelectTabs
  },
  props: {
    params: {
      type: Object
    }
  },
  computed: {
    product() {
      return this.params.product
    },
    imageUrl() {
      const imgFound = this.product.media.find(item => item.position === 1)
      const urlFinal = imgFound.src.replace('.jpg', '_800x800.jpg').replace('.png', '_800x800.png')
      return urlFinal
    },
    where() {
      const param = this.$route.params.box
      return param === 'addons' ? 'addons' : 'items'
    }
  },
  methods: {
    ...mapActions('mealcart', ['addToCart']),
    closeModal() {
      this.$emit('close')
    },
    addToCartModal() {
      this.addToCart({
        idCollection: this.product.collection.id,
        idProduct: this.product.id,
        where: this.where
      })
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

    @include media-tablet-up {
      width: 50%;
      height: 100%;
      overflow: initial;
    }
  }

  &--img {
    margin-top: -15%;

    @include media-tablet-up {
      margin-top: 0;
      position: relative;
      height: 100%;

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

      section,
      .tns-outer,
      .tns-inner,
      .tns-slider,
      .tns-item,
      .pdp__galleryImageWrapper {
        height: 100%;
        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }
    }

    &--img .pdp__galleryImageWrapper {
      width: 100%;
    }
  }

  &--data {
    padding: 1rem;
    height: 70%;
    position: relative;

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
      font-size: 5vh;

      @include media-tablet-up {
        font-size: 3rem;
      }
    }

    &-subtitle {
      color: #7b7979;
      font-size: 2.5vh;
      margin-bottom: 1.5rem;

      @include media-tablet-up {
        font-size: 1.7rem;
      }
    }

    &-pills {
      height: 65%;
      overflow-y: auto;
      padding: 0 0 1rem;

      @include media-tablet-up {
        .pdp__tabs {
          &--wrap {
            margin-bottom: 2rem;

            width: 100%;
            overflow: auto;
            &::-webkit-scrollbar {
              display: none;
            }
          }
          &--tab {
            margin-right: 10px;
            &:last-child {
              margin-right: 0;
            }
          }
        }
      }
    }
  }

  &--add-to-cart {
    @include flex($justify: center);
    background-color: $color-primary;
    cursor: pointer;
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    padding: 1rem 0;
    font-weight: 500;

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
