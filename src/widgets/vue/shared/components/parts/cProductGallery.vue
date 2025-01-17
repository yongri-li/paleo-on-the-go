<template>
  <div class="pdp__galleryContainer" :class="isModal && 'isModal'">
    <div v-if="loading" class="pdp__loader"></div>
    <div v-show="!loading" class="pdp__thumbnails u-hideMobileDown">
      <div v-for="(image, i) in images" v-if="i < 5" :key="i" class="pdp__thumbnailWrapper">
        <button class="pdp__thumbnailButton" type="button" @click="() => handleThumbnailClick(i)">
          <img
            :src="image"
            :class="{ 'pdp__thumbnail--active': i == activeIndex }"
            class="pdp__thumbnail"
            :alt="altTags[i]"
          />
        </button>
      </div>
    </div>
    <section>
      <span v-if="flag" :class="`c-product__flag c-product__flag--${flagHandle}`">
        {{ flag }}
      </span>
      <div v-show="!loading" class="pdp__gallery">
        <div v-for="(image, i) in images" v-if="i < 5" :key="i">
          <div class="pdp__galleryImageWrapper" :data-index="i">
            <img :src="image" class="pdp__galleryImage" :alt="altTags[i]" />
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
    alts: {
      type: [Object, Array]
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
    // mainImages() {
    //   return this.images.slice(1, 6)
    // },
    flagHandle() {
      return this.flag ? handleize(this.flag) : false
    },
    altTags() {
      return this.alts
        ? this.alts
        : ['POTG Image', 'POTG Image', 'POTG Image', 'POTG Image', 'POTG Image', 'POTG Image', 'POTG Image']
    }
  },
  methods: {
    buildSlider() {
      this.loading = true

      const enableThumbnails = this.images?.length > 1 ? true : false
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
    if (!this.loading) {
      const navArrow = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
      <path fill="currentColor" d="M34.52 239.03L228.87 44.69c9.37-9.37 24.57-9.37 33.94 0l22.67 22.67c9.36 9.36 9.37 24.52.04 33.9L131.49 256l154.02 154.75c9.34 9.38 9.32 24.54-.04 33.9l-22.67 22.67c-9.37 9.37-24.57 9.37-33.94 0L34.52 272.97c-9.37-9.37-9.37-24.57 0-33.94z">
        </path>
      </svg>`
      const navBtns = document.querySelectorAll('.tns-controls button')
      navBtns.forEach(btn => (btn.innerHTML = navArrow))
    }
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
    max-width: 100vw;
    overflow: hidden;
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
    max-height: 680px;
    position: relative;
    /*    position: sticky;
    top: 1.25rem;*/

    .tns-controls {
      position: absolute;
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 96%;
      height: 100%;
      left: 2%;
      z-index: 1;

      button {
        width: 2rem;
        height: 2rem;
        border: 1px solid $color-black;
        border-radius: 100%;
        color: $color-black;
        padding: 0;

        svg {
          height: 1rem;
          width: 1rem;
          margin-top: 0.25rem;
        }
      }

      button[data-controls='next'] svg {
        margin-left: -3px;
        margin-top: 2px;
      }

      button:last-child {
        transform: rotate(180deg);
      }
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

  @include media-mobile-down {
    .tns-outer {
      max-height: 45vh;
    }
  }
}

.pdp__thumbnails {
  position: relative;
  cursor: grab;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 0 1.5rem;
  margin: 0;
  overflow-x: scroll;
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
  max-width: 84px;
  z-index: 1;
}

.pdp__thumbnail {
  box-sizing: border-box;
  cursor: pointer;
  height: 4.5rem;
  width: 100%;
  min-width: 4.5rem;
  opacity: 0.3;

  &.pdp__thumbnail--active {
    opacity: 1;
    // outline: 1px solid $color-black;
    box-shadow: 0 0 0 1px $color-black;
  }
}

.pdp__thumbnailButton {
  -webkit-appearance: none;
  border: none;
  background-color: $color-ecru;

  img {
    transition: box-shadow 175ms;
  }

  &:hover {
    img {
      box-shadow: 0px 3px 0px 0px rgb(0 0 0 / 80%);
    }
  }
}

.pdp__galleryImage {
  display: block;
  margin: 0 auto;
}
</style>
