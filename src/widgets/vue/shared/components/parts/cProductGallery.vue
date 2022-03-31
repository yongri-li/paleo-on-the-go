<template>
  <div class="pdp__galleryContainer" :class="isModal && 'isModal'">
    <div v-if="loading" class="pdp__loader"></div>
    <div v-show="!loading" class="pdp__thumbnails u-hideMobileDown">
      <div v-for="(image, i) in images" :key="i" class="pdp__thumbnailWrapper">
        <button class="pdp__thumbnailButton" type="button" @click="() => handleThumbnailClick(i)">
          <img :src="image" :class="{ 'pdp__thumbnail--active': i == activeIndex }" class="pdp__thumbnail" />
        </button>
      </div>
    </div>
    <div v-show="!loading" class="pdp__gallery">
      <div v-for="(image, i) in images" :key="i">
        <div class="pdp__galleryImageWrapper" :data-index="i">
          <img :src="image" class="pdp__galleryImage" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { tns } from 'tiny-slider/src/tiny-slider'

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
    }
  },
  data: () => ({
    activeIndex: 0,
    loading: false,
    slider: false
  }),
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

  @include media-desktop-up {
  }

  .tns-nav {
    display: flex;
    justify-content: center;
    padding-top: 1.5rem;

    @include media-tablet-up {
      display: none;
    }
  }

  .tns-outer {
    height: fit-content;
    position: sticky;
    top: 1.25rem;

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
        border: 2px solid $color-black;
      }
    }
  }
}

.pdp__thumbnails {
  position: relative;
  top: 6rem;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
}

.pdp__galleryImageWrapper {
  @include media-mobile-down {
    width: 90%;
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
