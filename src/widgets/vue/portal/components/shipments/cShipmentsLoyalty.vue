<template>
  <div :class="`${_buildModifiers('c-shipmentsLoyalty', modifiers)} u-fullScreenWidth`"
    v-if="content && loyaltyLion && loyaltyCustomer && customerShopify"
  >
    <div class="c-shipmentsLoyalty__background u-hideTabletUp" 
      :style="backgroundSmall"
    />
    <div class="c-shipmentsLoyalty__background u-hideMobileDown" 
      :style="backgroundLarge"
    />
    <div class="c-shipmentsLoyalty__content o-container">
      <c-h class="c-shipmentsLoyalty__heading u-textCenter"
        v-if="heading"
        tag="h1"
        level="1"
        :text="heading"
      />
      <span class="c-shipmentsLoyalty__text u-block u-textCenter"
        v-if="text"
        v-html="text"
      />
      <div class="c-shipmentsLoyalty__buttons">
        <c-button class="c-shipmentsLoyalty__button"
          data-lion-account-link
          v-if="content.button_rewards"
          :text="content.button_rewards"
          :modifiers="['isDefault', 'isSecondary']"
        />
        <c-button class="c-shipmentsLoyalty__button"
          data-lion-account-link
          v-if="content.button_points"
          :text="content.button_points"
          :modifiers="['isDefault', 'isSecondary']"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import cH from '@shared/components/core/cH.vue'
import cButton from '@shared/components/core/cButton.vue'

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
  components: { cH, cButton },
  data: () => ({
    loyaltyLion: false,
    loyaltyCustomer: false
  }),
  computed: {
    ...mapGetters('customer', ['customerShopify']),
    backgroundSmall() {
      const { image_small, image_large } = this.content
      if(image_large && !image_small) return `background-image: url(${image_large});`
      else if(image_small) return `background-image: url(${image_small});`
      else return ''
    },
    backgroundLarge() {
      const { image_large } = this.content
      if(image_large) return `background-image: url(${image_large});`
      else return ''
    },
    heading() {
      const { content, customerShopify } = this
      return content.heading.replace('{{ customer_name }}', customerShopify.firstName)
    },
    points() {
      return this.loyaltyCustomer.pointsApproved
    },
    tier() {
      return this.loyaltyCustomer.loyaltyTierMembership
    },
    text() {
      const { content, tier, points } = this
      if(tier) {
        return content.text_tier
          .replace('{{ points }}', `<strong>${points}</strong>`)
          .replace('{{ tier }}', `<strong>${tier}</strong>`)
      } else {
        return content.text_points
          .replace('{{ points }}', `<strong>${points}</strong>`)
      }
    }
  },
  mounted() {
    const { loyaltylion } = window
    if(loyaltylion) {
      this.loyaltyLion = loyaltylion
      this.loyaltyCustomer = loyaltylion.customer
    }
  }
  // 
  // data-lion-refer
}
</script>

<style lang="scss">
  .c-shipmentsLoyalty {
    position: relative;
    border-bottom: 1px solid $color-hr;
  }
  .c-shipmentsLoyalty__background {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    background-size: cover;
    background-position: 50% 50%;
    background-repeat: none;
  }
  .c-shipmentsLoyalty__content {
    min-height: 210px;
    position: relative;
    padding-top: 20px;
    padding-bottom: 30px;
  }
  .c-shipmentsLoyalty__heading {
    margin-bottom: 10px;
    @include media-tablet-up {
      font-size: 40px;
    }
  }
  .c-shipmentsLoyalty__text {
    font-size: 22px;
    font-weight: 500;
  }
  .c-shipmentsLoyalty__buttons {
    margin-top: 20px;
    @include flex($justify: center);
  }
  .c-shipmentsLoyalty__button {
    margin: 0 10px;
  }
</style>