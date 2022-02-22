<template>
  <div :class="_buildModifiers('c-shipments', modifiers)">
    <c-shipmentsLoading class="c-shipments__loading" 
      v-if="!ready"
    />
    <div class="c-shipments__content" v-if="ready">
      <c-shipmentsLoyalty class="c-shipments__loyalty" 
        :content="{
          image_small: content.loyalty_image_small,
          image_large: content.loyalty_image_large,
          heading: content.loyalty_heading,
          text_points: content.loyalty_text_points,
          text_tier: content.loyalty_text_tier,
          button_rewards: content.loyalty_button_rewards,
          button_points: content.loyalty_button_points
        }"
      />
      <div class="c-shipments__flex">
        <div class="c-shipments__flexSmall">
          <c-shipmentsReferral class="c-shipments__referral" 
            :content="{
              preheading: content.referral_preheading,
              heading: content.referral_heading,
              button: content.referral_button
            }"
          />
          <c-shipmentsUpsell class="c-shipments__upsell"
            :content="{
              test: 'hey'
            }"
          />
        </div>
        <div class="c-shipments__flexLarge">
          <c-shipmentsBox class="c-shipments__box" 
            :content="{
              test: 'hey'
            }"
          />
        </div>
      </div>
    </div>  
  </div>
</template>

<script>
import cShipmentsLoading from '../shipments/cShipmentsLoading.vue'
import cShipmentsLoyalty from '../shipments/cShipmentsLoyalty.vue'
import cShipmentsEmpty from '../shipments/cShipmentsEmpty.vue'
import cShipmentsBox from '../shipments/cShipmentsBox.vue'
import cShipmentsReferral from '../shipments/cShipmentsReferral.vue'
import cShipmentsUpsell from '../shipments/cShipmentsUpsell.vue'

export default {
  props: {
    modifiers: {
      type: Array,
      default: () => ([])
    }
  },
  components: { 
    cShipmentsLoading, cShipmentsLoyalty, cShipmentsEmpty, 
    cShipmentsBox, cShipmentsReferral, cShipmentsUpsell
  },
  computed: {
    content() {
      return this.$store.getters['customize/customizeContentByKey']('shipments')
    }
  },
  async created() {
    if(this.customerRecharge) {
      const { success, error } = await this.customerSetResources({
        resources: [ 'addresses', 'charges', 'onetimes', 'subscriptions' ]
      })
      if(error) this.error = error
      this.ready = true
    }
    else this.ready = true
  }
}
</script>

<style lang="scss">
  .c-shipments__flex {
    max-width: 1240px;
    margin: 0 auto;
    padding: 30px 0 60px;
    @include flex($direction: column, $wrap: nowrap);
    @include media-desktop-up {
      padding-top: 40px;
      @include flex($justify: space-between, $align: flex-start, $wrap: nowrap);
    }
  }
  .c-shipments__flexSmall {
    width: 100%;
    @include flex($direction: column);
    @include media-tablet-only {
      margin-bottom: 30px;
      @include flex($justify: space-between, $wrap: nowrap);
    }
    @include media-desktop-up {
      width: 280px;
      margin-left: 40px;
    }
  }
  .c-shipments__flexLarge {
    width: 100%;
    @include media-desktop-up {
      width: calc(100% - 320px);
      order: -1;
    }
  }
</style>