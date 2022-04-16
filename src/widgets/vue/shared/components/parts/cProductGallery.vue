<template>
  <div class="pdp__galleryContainer" :class="isModal && 'isModal'">
    <div v-if="loading" class="pdp__loader"></div>
    <div v-show="!loading" class="pdp__thumbnails u-hideMobileDown">
      <div v-for="(image, i) in mainImages" :key="i" class="pdp__thumbnailWrapper">
        <button class="pdp__thumbnailButton" type="button" @click="() => handleThumbnailClick(i)">
          <img :src="image" :class="{ 'pdp__thumbnail--active': i == activeIndex }" class="pdp__thumbnail" />
        </button>
      </div>
    </div>
    <section>
      <span v-if="flag" :class="`c-product__flag c-product__flag--${flagHandle}`">
        {{ flag }}
      </span>
      <div v-show="!loading" class="pdp__gallery">
        <div v-for="(image, i) in mainImages" :key="i">
          <div v-if="i < 5" class="pdp__galleryImageWrapper" :data-index="i">
            <img :src="image" class="pdp__galleryImage" />
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { tns } from 'tiny-slider/src/tiny-slider'
import { handleize } from '../../utils'

export default {
  props: {
    images: {
      required: true,
      type: Array
    },
    autoplay: {
      default: false,
      required: false,
      type: Boolean
    },
    isModal: {
      type: Boolean,
      default: false
    },
    flag: {
      type: String
    }
  },
  data: () => ({
    activeIndex: 0,
    loading: false,
    slider: false
  }),
  computed: {
    mainImages() {
      return this.images.slice(1, 6)
    },
    flagHandle() {
      return handleize(this.flag)
    }
  },
  methods: {
    buildSlider() {
      this.loading = true

      const enableThumbnails = this.images.length > 1 ? true : false
      const slider = tns({
        autoplay: this.autoplay,
        autoplayButtonOutput: false,
        center: true,
        container: '.pdp__gallery',
        controls: true,
        items: 1,
        loop: false,
        mode: 'gallery',
        mouseDrag: true,
        navAsThumbnails: enableThumbnails,
        navPosition: 'bottom'
      })

      this.slider = slider

      this.slider.events.on('indexChanged', (info, event) => {
        this.activeIndex = info.index
      })

      this.loading = false
    },
    handleThumbnailClick(index) {
      this.slider.goTo(index)
    }
  },
  mounted() {
    this.buildSlider()
  }
}
</script>

<style lang="scss">
.pdp__galleryContainer {
  display: flex;
  flex-direction: column-reverse;
  justify-content: center;

  .tns-nav {
    display: flex;
    justify-content: center;
    position: absolute;
    width: 100%;
    bottom: 1.125rem;

    @include media-tablet-up {
      display: none;
    }
  }

  @include media-desktop-up {
    position: relative;
  }

  .tns-outer {
    height: fit-content;
    position: relative;
    /*    position: sticky;
    top: 1.25rem;*/

    .tns-controls {
      position: absolute;
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      height: 100%;
      z-index: 1;
    }
  }

  &.isModal {
    .pdp__thumbnails {
      top: unset;
      bottom: 2rem;

      .pdp__thumbnailButton {
        background: none;
      }

      .pdp__thumbnail {
        border-radius: 50%;
        border: 5px solid $color-white;
      }
    }
  }
}

.pdp__thumbnails {
  position: relative;
  /*top: 6rem;*/
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 1.5rem;
  z-index: 2;
}

.pdp__galleryImageWrapper {
  @include media-mobile-down {
    width: 100%;
    margin: 0 auto;
  }
}

.pdp__thumbnailWrapper {
  cursor: pointer;
  display: block;
  height: fit-content;
  z-index: 1;
}

.pdp__thumbnail {
  box-sizing: border-box;
  cursor: pointer;
  height: 4.5rem;
  opacity: 0.3;

  &.pdp__thumbnail--active {
    opacity: 1;
  }
}

.pdp__thumbnailButton {
  -webkit-appearance: none;
  border: none;
  background-color: $color-ecru;
}

.pdp__galleryImage {
  display: block;
  margin: 0 auto;
}
</style>
