<template>
  <div class="page">
    <c-hero-ancillary
      :desk-background="topBannerContent.desk_bg"
      :mobile-background="topBannerContent.mobile_bg"
      :text="topBannerContent.text"
    />
    <section class="post-banner-container">
      <div class="post-banner-container__text">All animals are humanely raised.</div>
      <div class="post-banner-container__text">
        No antibiotics or hormones are ever used in any animal products.
      </div>
      <div class="post-banner-container__text">
        All cattle and lamb have access to pasture and grass & never fed grain.
      </div>
      <div class="post-banner-container__text">All fish must be wild-caught or organic.</div>
    </section>
    <section class="text-block-container o-container">
      <p class="text-block-container__text">
        It is our goal to be transparent and share as much information with you as possible about our
        products. To provide an autoimmune protocol (AIP) and paleo meal delivery service that we believe in,
        we source from these quality providers.
      </p>
    </section>
    <section class="grid-container">
      <c-grid-accordion
        :content="gridBlocks"
        :title="{
          first: 'Our',
          second: 'Providers'
        }"
      />
    </section>
    <c-tiles :tiles="tilesBlocks" class="tiles-container" />
    <section class="faq-container">
      <c-faq-accordion :faqs="faqBlocks" :title="['Our', 'Ingredients']" />
    </section>
  </div>
</template>

<script>
import cHeroAncillary from '@shared/components/core/cHeroAncillary.vue'
import cTiles from '@shared/components/core/cTiles.vue'
import cFaqAccordion from '@shared/components/core/cFaqAccordion.vue'
import cGridAccordion from '@shared/components/core/cGridAccordion.vue'

export default {
  components: {
    cHeroAncillary,
    cTiles,
    cFaqAccordion,
    cGridAccordion
  },
  data() {
    return {
      dataAncillary: window.Scoutside.ancillary,
      dataPage: window.Scoutside.foodsourcing
    }
  },
  computed: {
    topBannerContent() {
      return this.dataPage.topBanner.content
    },
    tilesBlocks() {
      return this.dataPage.tiles.blocks
    },
    faqBlocks() {
      return this.dataAncillary.accordions.blocks
    },
    gridBlocks() {
      return this.dataPage.grid.blocks
    }
  }
}
</script>

<style lang="scss">
.page {
  /*  ////// border: 1px solid blue;*/
  .hero-ancillary__text {
    color: $color-black;
    top: 5%;
    transform: translate(0, 0);
    width: 90%;
    font-size: clamp(2rem, 5vw, 3.25rem);

    @include media-tablet-up {
      background-color: transparent;
      left: 5vw;
      width: clamp(500px, 60vw, 900px);
    }
  }

  .post-banner-container {
    background-color: $color-secondary;
    color: $color-white;
    @include text-heading;
    padding: 1rem 3rem;
    font-weight: 500;
    margin-top: -1rem;

    @include media-tablet-up {
      padding: 1rem 6rem;
    }

    &__text {
      font-size: 1.6rem;
      margin: 4rem 0;

      @include media-tablet-up {
        font-size: 3.25rem;
        width: 80%;
      }
    }
  }

  .text-block-container {
    text-align: center;
    @include text-body;
    margin: 3rem auto;

    @include media-tablet-up {
      margin: 5rem auto;

      &__text {
        font-size: 1.8rem;
        font-weight: 500;
      }
    }
  }

  .tiles-container {
    max-width: 1600px;
  }

  .c-homeFaqs__item-question {
    @include text-heading;
    text-transform: uppercase;
    font-size: 1.5rem;
  }
}
</style>
