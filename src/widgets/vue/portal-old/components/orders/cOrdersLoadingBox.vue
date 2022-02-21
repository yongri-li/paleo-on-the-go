<template>
  <div :class="_buildModifiers('c-ordersLoadingBox', modifiers)">
    <div class="c-ordersLoadingBox__box">
      <div class="c-ordersLoadingBox__trigger">
        <div class="c-ordersLoadingBox__triggerTop">
          <div class="c-ordersLoadingBox__triggerDetails">
            <div class="c-ordersLoadingBox__detailsDate c-ordersLoadingBox__blockBase" />
            <div class="c-ordersLoadingBox__detailsInfo c-ordersLoadingBox__blockBase" />
          </div>
          <div class="c-ordersLoadingBox__triggerInfo">
            <div class="c-ordersLoadingBox__infoStatus c-ordersLoadingBox__blockBase" />
            <div class="c-ordersLoadingBox__infoTrack c-ordersLoadingBox__blockBase" />
          </div>
        </div>
        <div class="c-ordersLoadingBox__triggerBottom">
          <div class="c-ordersLoadingBox__triggerAddress c-ordersLoadingBox__blockBase" />
          <c-svg class="c-ordersLoadingBox__triggerIcon"
            name="circleChevron"
          />
        </div>
      </div>
      <div class="c-ordersLoadingBox__content">
      </div>
    </div>
  </div>
</template>

<script>
import cSvg from '@shared/components/core/cSvg.vue'
export default {
  props: {
    modifiers: {
      type: Array,
      default: () => ([])
    }
  },
  components: { cSvg }
}
</script>

<style lang="scss">
  .c-ordersLoadingBox__blockBase {
    @include gradient-shimmer;
  }
  .c-ordersLoadingBox__heading {
    width: 420px;
    max-width: 100%;
    height: 44px;
    margin-bottom: 40px;
    border-radius: 3px;
  }
  .c-ordersLoadingBox__subheading {
    width: 140px;
    max-width: 100%;
    height: 20px;
    margin-bottom: 10px;
    border-radius: 3px;
  }
  .c-ordersLoadingBox__box {
    width: 100%;
    padding: 30px;
    background-color: $color-white;
    border-radius: 3px;
    border: 1px solid #E5E5E5;
  }
  .c-ordersLoadingBox__trigger {
    @include media-tablet-up {
      @include flex($justify: flex-start, $wrap: nowrap);
    }
  }
  .c-ordersLoadingBox__triggerTop,
  .c-ordersLoadingBox__triggerBottom {
    @include flex($justify: space-between, $align: flex-start, $wrap: nowrap);
    width: 100%;
    @include media-tablet-up {
      width: auto;
      align-items: center;
    }
  }
  .c-ordersLoadingBox__triggerBottom {
    flex-grow: 1;
  }
  .c-ordersLoadingBox__detailsDate,
  .c-ordersLoadingBox__infoStatus {
    width: 140px;
    max-width: 100%;
    height: 20px;
    margin-bottom: 5px;
    @include media-tablet-up {
      margin-bottom: 10px;
    }
  }
  .c-ordersLoadingBox__detailsInfo,
  .c-ordersLoadingBox__infoTrack {
    width: 145px;
    max-width: 100%;
    height: 16px;
    margin-bottom: 30px;
    @include media-tablet-up {
      margin-bottom: 0;
    }
  }
  .c-ordersLoadingBox__triggerInfo {
    margin-left: 20px;
    @include media-tablet-up {
      margin-left: 50px;
    }
    @include media-desktop-up {
      margin-left: 70px;
    }
  }
  .c-ordersLoadingBox__triggerAddress {
    width: 340px;
    max-width: calc(100% - 100px);
    height: 20px;
    @include media-tablet-up {
      margin-left: 50px;
    }
    @include media-up(900px) {
      margin-left: 70px;
    }
  }
  .c-ordersLoadingBox__triggerIcon {
    color: #E5E5E5;
    width: 24px;
    height: 24px;
    transform-origin: 50%;
    margin-left: 20px;
    .c-ordersLoadingBox--isOpen & {
      transform: rotate(180deg);
    }
  }
</style>