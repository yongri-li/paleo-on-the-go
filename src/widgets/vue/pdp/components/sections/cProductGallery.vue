<template>
  <div class="pdp__galleryContainer">
    <div v-if="loading" class="pdp__loader"></div>
    <div v-show="!loading" class="pdp__thumbnails u-hideMobileDown">
      <div
        v-for="(image, index) in images"
        :key="index"
        class="pdp__thumbnailWrapper"
      >
        <button
          class="pdp__thumbnailButton"
          type="button"
          @click="() => handleThumbnailClick(index)"
        >
          <img
            :src="image"
            :class="{ 'pdp__thumbnail--active': index == activeIndex }"
            class="pdp__thumbnail"
          />
        </button>
      </div>
    </div>
    <div v-show="!loading" class="pdp__gallery">
      <div v-for="(image, index) in images" :key="index">
        <div class="pdp__galleryImageWrapper" :data-index="index">
          <img :src="image" class="pdp__galleryImage" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { tns } from "tiny-slider/src/tiny-slider";

export default {
  props: {
    images: {
      required: true,
      type: Array,
    },
    autoplay: {
      default: false,
      required: false,
      type: Boolean,
    },
  },
  data: () => ({
    activeIndex: 0,
    loading: false,
    slider: false,
  }),
  methods: {
    buildSlider() {
      this.loading = true;

      const enableThumbnails = this.images.length > 1 ? true : false;
      const controlsContainer =
        this.images.length > 1 ? ".pdp__thumbnails" : false;

      const slider = tns({
        autoplay: this.autoplay,
        autoplayButtonOutput: false,
        center: true,
        container: ".pdp__gallery",
        // controlsContainer: controlsContainer,
        controls: false,
        items: 1,
        loop: false,
        mode: "gallery",
        mouseDrag: true,
        navAsThumbnails: enableThumbnails,
        navPosition: "bottom",
      });

      this.slider = slider;

      this.slider.events.on("indexChanged", (info, event) => {
        this.activeIndex = info.index;
      });

      this.loading = false;
    },
    handleThumbnailClick(index) {
      this.slider.goTo(index);
    }    
  },
  mounted() {
    this.buildSlider();
  },
};
</script>

<style lang="scss">
.pdp__galleryContainer {
  display: grid;
  grid-template-columns: 1fr;

  @include media-tablet-up {
    grid-column-gap: 10px;
    grid-template-columns: 80px 1fr;
  }

  @include media-desktop-up {
    grid-column-gap: 40px;
    grid-template-columns: 80px 1fr;
  }

  .tns-nav {
    display: flex;
    justify-content: center;
    padding-top: 25px;

    @include media-tablet-up {
      display: none;
    }
  }

  .tns-outer {
    height: fit-content;
    position: sticky;
    top: 20px;
  }
}

.pdp__thumbnails {
  display: grid;
  grid-template-rows: 70px;
  grid-row-gap: 20px;
  height: fit-content;
  position: sticky;
  top: 20px;
  z-index: 2;
}

.pdp__galleryImageWrapper {
  border-radius: 50%;
  /*box-shadow: 8px 8px 10px rgba(16, 31, 45, 0.3);*/
  width: 80%;
  &[data-index="0"] {
    box-shadow: 8px 8px 10px rgba(16, 31, 45, 0.3);
  }
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
  border-radius: 12px;
  border: 1px solid #e2dfd7;
  box-sizing: border-box;
  cursor: pointer;
  height: 70px;
  opacity: 0.3;

  &.pdp__thumbnail--active {
    opacity: 1;
  }
}

.pdp__thumbnailButton {
  -webkit-appearance: none;
  border: none;
}

.pdp__galleryImage {
  border-radius: 25px;
  margin: 0 auto;
  display: block;
}
</style>
