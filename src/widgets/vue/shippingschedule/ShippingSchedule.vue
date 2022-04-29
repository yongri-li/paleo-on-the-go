<template>
  <div class="page">
    <c-hero-ancillary
      :desk-background="heroContent.desk_bg"
      :mobile-background="heroContent.mobile_bg"
      :text="heroContent.text"
    />
    <section class="richtext-container">
      <c-rich-text
        :header="descriptionContent.header"
        header-class="c-h3"
        :body="descriptionContent.body"
      />
    </section>
    <section class="map-container">
      <c-hero-ancillary
        :desk-background="mapContent.desk_bg"
        :mobile-background="mapContent.mobile_bg"
      />
    </section>
    <section class="icons-container o-containerMedium">
      <div class="c-h2 u-hideTabletUp">
        {{ iconsContent.header }}
      </div>
      <div class="c-h3 u-hideMobileDown u-showTabletUp">
        {{ iconsContent.header }}
      </div>
      <div class="icons-list">
        <c-icon-text
          v-for="(block, index) in iconsBlocks"
          :key="index"
          :img-src="block.image_icon"
          :text="block.text"
          :link="block.link"
          target-link="_blank"
          class="icons-list__item"
        />
      </div>
    </section>
    <section class="richtext-container">
      <c-rich-text
        :body="infoContent.body"
      />
    </section>
  </div>
</template>

<script>
import cHeroAncillary from '@shared/components/core/cHeroAncillary.vue'
import cRichText from '@shared/components/core/cRichText.vue'
import cIconText from '@shared/components/core/cIconText.vue'

export default {
  components: {
    cHeroAncillary,
    cRichText,
    cIconText
  },
  data() {
    return {
      dataAncillary: window.Scoutside.ancillary,
      dataPage: window.Scoutside.shippingschedule
    }
  },
  computed: {
    heroContent() {
      return this.dataAncillary.hero.content
    },
    descriptionContent() {
      return this.dataPage.description.content
    },
    mapContent() {
      return this.dataPage.map.content
    },
    iconsContent() {
      return this.dataPage.icons.content
    },
    iconsBlocks() {
      return this.dataPage.icons.blocks
    },
    infoContent() {
      return this.dataPage.info.content
    }
  }
}
</script>

<style lang="scss" scoped>

.richtext-container {
  width: 96vw;
  max-width: 840px;
  margin: 1rem auto;
  @include media-tablet-up {
    width: 50vw;
    margin: 4rem auto;
  }
}

.icons-container {
  text-align: center;
  margin: 2rem auto;
  @include media-tablet-up {
    margin: 4rem auto;

    .icons-list {
      margin-top: 3rem;
      @include flex($justify: space-between);
    }
  }

}

</style>