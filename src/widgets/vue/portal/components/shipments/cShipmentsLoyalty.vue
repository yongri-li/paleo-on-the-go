<template>
  <div :class="`${_buildModifiers('c-shipmentsLoyalty', modifiers)} u-fullScreenWidth`"
    v-if="content && loyaltyLion && customerShopify"
  >
    <div class="c-shipmentsLoyalty__main o-container">
      <div class="c-shipmentsLoyalty__left"
        :style="!imageStyles ? 'opacity: 0;' : ''"
      >
        <c-h class="c-shipmentsLoyalty__heading"
          tag="h3"
          level="3"
          :modifiers="['isBolder']"
          v-if="heading"
          :text="heading"
        />
        <c-h class="c-shipmentsLoyalty__text"
          tag="h6"
          level="6"
          v-if="textTier"
          v-html="textTier"
        />
        <c-h class="c-shipmentsLoyalty__text"
          tag="h6"
          level="6"
          v-if="textPoints"
          v-html="textPoints"
        />
        <div class="c-shipmentsLoyalty__buttons u-hideMobileDown">
          <c-button class="c-shipmentsLoyalty__button"
            data-lion-account-link
            v-if="content.button_view"
            :text="content.button_view"
            :modifiers="['isDefault', 'isWhite']"
          />
          <c-button class="c-shipmentsLoyalty__button"
            data-lion-account-links
            v-if="content.button_earn"
            :text="content.button_earn"
            :modifiers="['isDefault', 'isWhite']"
          />
        </div>
      </div>
      <div class="c-shipmentsLoyalty__right u-hideMobileDown"
        :style="!imageStyles ? 'opacity: 0;' : ''"
        ref="loyaltyRight"
      >
        <div class="c-shipmentsLoyalty__image"
          v-if="imageStyles"
          :style="`background-image: url(${content.image}); ${imageStyles}`"
        />
        <c-svg class="c-shipmentsLoyalty__diagonal"
          name="diagonal"
        />
        <div class="c-shipmentsLoyalty__refer">
          <span class="c-shipmentsLoyalty__referLabel"
            v-if="content.text_refer"
            v-html="content.text_refer"
          />
          <span class="c-shipmentsLoyalty__referLink"
            v-if="content.link_refer"
            v-html="content.link_refer"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import cH from '@shared/components/core/cH.vue'
import cButton from '@shared/components/core/cButton.vue'
import cSvg from '@shared/components/core/cSvg.vue'

export default {
  props: {
    content: {
      type: Object,
      required: true
    },
    modifiers: {
      type: Array,
      default: () => ([])
    }
  },
  components: { cH, cButton, cSvg },
  data: () => ({
    loyaltyLion: false,
    loyaltyCustomer: false,
    imageStyles: false
  }),
  computed: {
    ...mapGetters('customer', ['customerShopify']),
    heading() {
      const { content, customerShopify } = this
      return content.heading.replace('{{ customer_name }}', customerShopify.firstName)
    },
    date() {
      return this._formatDate(this.customerShopify.createdAt, 'MMM, YYYY')
    },
    tier() {
      return ''
    //   const { loyaltyTierMembership } = this.loyaltyCustomer
    //   const { program } = this.loyaltyLion
    //   const loyaltyTiers = program ? program.loyaltyTiers : false
    //   if(loyaltyTiers && loyaltyTierMembership) {
    //     const { loyaltyTierId } = loyaltyTierMembership
    //     const tierMatch = loyaltyTiers.find(tier => tier.id == loyaltyTierId)
    //     if(tierMatch) return tierMatch.name
    //   }
    },
    points() {
      return false
    //   return this.loyaltyCustomer.pointsApproved
    },
    textTier() {
      return ''
      const { label_tier, label_no_tier, text_tier } = this.content
      let label = this.tier ? label_tier : label_no_tier
      let text = text_tier
      label = label.replace('{{ tier }}', this.tier)
      text = text.replace('{{ date }}', this.date)
      return `<strong>${label}</strong> ${text}`
    },
    textPoints() {
      return ''
      const { label_points, text_points } = this.content
      let label = label_points
      let text = text_points
      text = text.replace('{{ points }}', this.points)
      return `${label} <strong>${text}</strong>`
    }
  },
  methods: {
    setImageStyles() {
      const { loyaltyRight } = this.$refs
      if(loyaltyRight) {
        const windowWidth = window.innerWidth
        const offsetLeft = loyaltyRight.offsetLeft
        const imageWidth = windowWidth - offsetLeft + 1
        this.imageStyles = `width: ${imageWidth}px;`  
      }
    }
  },
  mounted() {
    const { loyaltylion } = window
    if(loyaltylion) {
      this.loyaltyLion = loyaltylion
      this.loyaltyCustomer = loyaltylion.customer
    }
    const refsInterval = setInterval(() => {
      const { loyaltyRight } = this.$refs
      if(loyaltyRight) {
        this.setImageStyles()
        clearInterval(refsInterval)
      }
    }, 150)
    window.addEventListener('resize', this.setImageStyles)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.setImageStyles)
  }
}
</script>

<style lang="scss">
  .c-shipmentsLoyalty {
    @include flex($align: stretch, $wrap: nowrap);
    background-color: $color-primary;
    position: relative;
  }
  .c-shipmentsLoyalty__main {
    @include flex($wrap: nowrap, $align: stretch);
  }
  .c-shipmentsLoyalty__left {
    padding: 70px 60px 70px 0;
    @include media-tablet-down { padding: 70px 10px 70px 0; }
    @include media-mobile-down { 
      padding: 30px 0; 
      text-align: center;
    }
  }
  .c-shipmentsLoyalty__heading {
    color: $color-white;
    margin-bottom: 0 !important;
    @include media-tablet-down {
      font-size: 26px;
    }
  }
  .c-shipmentsLoyalty__text {
    color: $color-white;
    font-weight: 400;
    font-size: 24px;
    @include media-tablet-down {
      font-size: 20px;
    }
    @include media-mobile-down {
      font-size: 16px;
    }
  }
  .c-shipmentsLoyalty__buttons {
    @include flex($wrap: wrap);
    margin-top: 24px;
    margin: 0 -15px;
    z-index: -1;
    opacity: 0;
    pointer-events: none;
  }
  .c-shipmentsLoyalty__button {
    padding: 18px 30px;
    font-size: 16px;
    margin: 24px 15px 0;
    @include media-tablet-down {
      padding: 16px 24px;
      font-size: 14px;
    }
  }
  .c-shipmentsLoyalty__right {
    position: relative;
    @include flex($direction: column, $justify: flex-end);
  }
  .c-shipmentsLoyalty__image {
    position: absolute;
    left: 0;
    background-size: cover;
    background-position: center;
    height: 100%;
    min-width: 100%;
    // &:before {
    //   content: '';
    //   display: block;
    //   width: 100%;
    //   height: 70px;
    //   background-color: $color-white;
    //   position: absolute;
    //   bottom: 0;
    // }
  }
  .c-shipmentsLoyalty__refer {
    width: 100%;
    @include flex($justify: flex-end, $wrap: nowrap);
    height: 70px;
    padding-left: 60px;
    z-index: 1;
    @include media-tablet-down {
      padding-left: 40px;
    }
    z-index: -1;
    opacity: 0;
    pointer-events: none;
  }
  .c-shipmentsLoyalty__referLabel,
  .c-shipmentsLoyalty__referLink {
    color: $color-black;
    font-family: $font-heading;
    font-size: 24px;
    font-weight: 900;
    text-transform: capitalize;
    white-space: nowrap;
    @include media-tablet-down {
      font-size: 20px;
    }
  }
  .c-shipmentsLoyalty__referLink {
    margin-left: 40px;
    font-size: 15px;
    font-weight: 700;
    text-transform: uppercase;
    border-bottom: 2px solid $color-black;
    &:hover { 
      cursor: pointer;
      border-color: transparent; 
    }
    @include media-tablet-down {
      margin-left: 30px;
      font-size: 13px;
    }
  }
  .c-shipmentsLoyalty__diagonal {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 90px;
    transform: rotate(180deg);
    color: $color-primary;
    z-index: 2;
  }
</style>