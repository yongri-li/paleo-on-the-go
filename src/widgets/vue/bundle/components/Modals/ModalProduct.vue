<template>
  <div class="modal__product">
    <div class="modal__close" @click="closeModal">
      x
    </div>
    <div class="modal__product--content">
      <div class="modal__product--figure">
        <img
          class="modal__product--img"
          :src="imageUrl"
          :alt="product.title"
        />
      </div>
      <div class="modal__product--data">
        <div class="modal__product--data-title">
          {{ product.title }}
        </div>
        <div class="modal__product--data-subtitle">
          this is a metafield like subtitle
        </div>
        <div class="modal__product--data-pills">
          <div class="modal__product--data-pills-item">
            Description
          </div>
          <div class="modal__product--data-pills-item">
            Ingredientes
          </div>
          <div class="modal__product--data-pills-item">
            Heating
          </div>
        </div>
        <div class="modal__product--data-pills-content">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloribus accusantium ut temporibus similique impedit ex nam rerum perferendis explicabo. Consectetur officia esse nostrum nobis. Nulla sequi eius illum quae corporis?
        </div>
        <div class="modal__product--add-to-cart" @click="addToCartModal">
          Add To Box
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
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
      const urlFinal = imgFound.src.replace('.jpg','_800x800.jpg').replace('.png','_800x800.png')
      return urlFinal
    },
    where() {
      const param = this.$route.params.box
      return param === 'addons' ? 'addons' : 'items'
    }
  },
  methods: {
    ...mapActions([
      'addToCart'
    ]),
    closeModal() {
      this.$emit('close')
    },
    addToCartModal() {
      this.addToCart({
        idCollection: this.product.collection.id,
        idProduct: this.product.id,
        where: this.where,
      })
      this.closeModal()
    }
  }
}
</script>

<style lang="scss" scoped>
.modal__product {
  background-color: #F3F0E9;
  text-align: initial;
  left: 0;
  width: 100%;
  height: 90%;
  padding: 0;
  border-top-left-radius: 15px;
  border-top-right-radius: 15px;
  overflow: hidden;

  @include media-tablet-up {
    width: 80%;
    max-width: 1400px;
    left: 10%;
    height: 70%;
    max-height: 670px;
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

  &--data {
    padding: 1rem;
    height: 70%;
    position: relative;

    @include media-tablet-up {
      height: 100%;
      width: 50%;
      padding: 5rem 3rem 1rem;
    }

    &-title {
      font-family: $font-heading;
      font-size: 2.6rem;

      @include media-tablet-up {
        font-size: 3rem;
      }
    }

    &-subtitle {
      color: #7B7979;
      font-size: 1.2rem;
      margin-bottom: 1.5rem;

      @include media-tablet-up {
        font-size: 1.7rem;
      }
    }

    &-pills {
      @include flex();

      &-item {
        font-size: 1.1rem;
        background-color: $color-white;
        padding: .4rem .6rem;
        border-radius: 15px;
        margin-right: 1rem;
        cursor: pointer;
      }

      &-content {
        padding: 1.5rem 0;
        margin-top: 1rem;
        height: 60%;
        max-height: 230px;
        overflow-y: auto;
        font-size: 1.1rem;
        line-height: 160%;

        @include media-tablet-up {
          height: 50%;
          max-height: 230px;
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
}

.modal__close {
  background-color: $color-white;
  border: none;
  z-index: 1;
}
</style>