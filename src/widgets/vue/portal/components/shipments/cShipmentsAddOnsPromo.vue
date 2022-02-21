<template>
  <div class="c-lineItem c-lineItem--promo c-lineItem--addOn">
    <div class="c-lineItem__promoImage u-bgCitrusLight">
      <div class="c-lineItem__image-wrapper">
        <img class="c-lineItem__image" :src="content.addons_promo_image" />
      </div>
    </div>
    <div class="c-lineItem__promoText u-bgEvergreen u-textCenter">
      <div>
        <h4 class="c-lineItem__promoHeading c-h4">
          {{ content.addons_promo_text }}
        </h4>
        <button class="c-lineItem__button u-btnUnset" @click="$emit('toggleAddOns')">
          {{ content.addons_promo_trigger_text }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  props: {
    content: {
      type: Object,
      required: true
    }
  }
}
</script>

<style lang="scss">
  
</style>