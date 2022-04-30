<template>
  <div
    class="pitem"
    :class="{ 'u-hide': product.hide }"
  >
    <div class="pitem__colum product">
      <div class="pitem__figure">
        <img
          class="pitem__figure--img"
          :src="imageUrl"
          :alt="product.title"
        />
      </div>
      <div class="pitem__info">
        <div class="pitem__info--title">
          {{ product.title }}
        </div>
        <!-- <div class="pitem__info--subtitle">
          with dasljdal adsajdla
        </div> -->
        <div class="pitem__price u-hideTabletUp">
          {{ finalPrice }}
        </div>
        <div class="pitem__qt-remove u-hideTabletUp">
          <div class="pitem__qt">
            QTY: {{ product.quantity }}
          </div>
          <div class="pitem__remove">
            Remove
          </div>
        </div>
      </div>
    </div>
    <div class="pitem__qt u-hideMobileDown">
      {{ product.quantity }}
    </div>
    <div class="pitem__price u-hideMobileDown">
      {{ finalPrice }}
    </div>
    <div @click="removeItem(product.id)" class="pitem__remove u-hideMobileDown">
      Remove
    </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
import { formatPrice } from '@shared/utils'

export default {
  props: {
    product: {
      type: Object,
      required: true
    },
  },
  computed: {
    imageUrl() {
      const imgFound = this.product.media.find(item => item.position === 1)
      const urlFinal = imgFound.src.replace('.jpg','_150x150.jpg').replace('.png','_150x150.png')
      return urlFinal
    },
    finalPrice() {
      return formatPrice(this.product.price * this.product.quantity)
    }
  },
  methods: {
    ...mapMutations('cartdrawer', ['REMOVE_ITEM_FROM_CART']),
    removeItem(id) {
      this.REMOVE_ITEM_FROM_CART(id)
    }
  },
}
</script>

<style lang="scss" scoped>
.pitem {

  @include media-tablet-up {
    @include flex($align: center);
  }

  &__colum.product {
    @include flex($align: flex-start);

    @include media-tablet-up {
      width: 55%;
      align-items: center;
    }
  }

  &__figure {
    width: 30%;
    margin-right: 5%;

    @include media-tablet-up {
      width: 20%;
    }
  }

  &__info {
    width: 65%;

    &--title {
      font-family: Knockout,sans-serif;
      font-size: 1.5rem;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      text-transform: capitalize;
    }

    &--subtitle {
      color: #7b7979;
      font-size: .9rem;
    }
  }

  &__price {
    font-size: 1.2rem;
    margin: .5rem 0;

    @include media-tablet-up {
      width: 23%;
      text-align: right;
      margin: 0;
    }
  }

  &__qt-remove {
    font-size: .9rem;
    @include flex($justify: space-between);
  }

  &__qt {
    @include media-tablet-up {
      width: 10%;
      font-size: 1rem;
      text-align: center;
    }
  }

  &__remove {
    color: $color-info;
    text-decoration: underline;
    cursor: pointer;
    @include media-tablet-up {
      width: 12%;
      font-size: 1rem;
      text-align: right;
    }
  }
}
</style>