<template>
  <div class="page">
    <c-hero-ancillary
      :desk-background="heroContent.desk_bg"
      :mobile-background="heroContent.mobile_bg"
      :text="heroContent.text"
    />
    <section class="feature-container">
      <div class="c-h5 feature-container__title">
        {{ featureContent.subtext }}
      </div>
      <div class="c-h1 feature-container__title">
        {{ featureContent.header }}
      </div>
      <c-card-block
        :img-card="featureContent.image_card"
        :header="featureContent.header_card"
        header-class="c-h2"
        :body="featureContent.body_card"
        class="feature-container__card-block"
      />
    </section>
    <section class="alternating-container">
      <c-card-block
        v-for="(block, index) in alternatingBlocks"
        :key="index"
        :img-card="block.image"
        :header="block.header"
        header-class="c-h2"
        :body="block.body"
      />
    </section>
    <section class="faq-container">
      <c-faq-accordion :content="faqBlocks" />
    </section>
    <section class="bottom-container">
      <c-bottom-hero :content="pageBottomBannerContent"/>
      <c-bottom-banner :content="ancillaryBottomContent" />
    </section>
  </div>
</template>

<script>
import cHeroAncillary from '@shared/components/core/cHeroAncillary.vue'
import cCardBlock from '@shared/components/parts/cCardBlock.vue'
import cFaqAccordion from '@shared/components/core/cFaqAccordion.vue'
import cBottomHero from '@shared/components/core/cBottomHero.vue'
import cBottomBanner from '@shared/components/core/cBottomBanner.vue'

export default {
  components: {
    cHeroAncillary,
    cCardBlock,
    cFaqAccordion,
    cBottomHero,
    cBottomBanner
  },
  data() {
    return {
      dataAncillary: window.Scoutside.ancillary,
      dataPage: window.Scoutside.realfood,
    }
  },
  computed: {
    heroContent() {
      return this.dataAncillary.hero.content
    },
    featureContent() {
      return this.dataPage.feature.content
    },
    alternatingBlocks() {
      return this.dataPage.alternating.blocks
    },
    faqBlocks() {
      return this.dataAncillary.accordions.blocks
    },
    pageBottomBannerContent() {
      return this.dataPage.bottomBanner.content
    },
    ancillaryBottomContent() {
      return this.dataAncillary.bottomBanner.content
    }
  }
}
</script>

<style lang="scss">

.feature-container {
  margin: 1rem 0;

  @include media-tablet-up {
    margin: 4rem auto;
    width: 62vw;
    max-width: 1040px;

    .card-block {
      width: 90%;
      margin: 6rem auto;

      &__img {
        width: 100%;
        height: auto;
      }
    }
  }

  &__title {
    text-align: center;
  }
}

.alternating-container {
  @include media-tablet-up {
    .card-block {
      @include flex();
      margin-bottom: 3rem;

      &__img {
        width: 49%;
      }

      &__rich-text {
        width: 51%;
        padding: 0 10rem;
      }
    }
    .card-block:nth-child(odd) {
      @include flex($direction: row-reverse);
    }
  }
}

</style>