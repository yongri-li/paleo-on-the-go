<template>
  <div :class="_buildModifiers('c-sidebarShipping', modifiers)" v-if="content">
    <c-formShipping
      class="c-sidebarShipping__form"
      :content="{
        first_label: content.billing_first_label,
        last_label: content.billing_last_label,
        address1_label: content.billing_address1_label,
        address2_label: content.billing_address2_label,
        city_label: content.billing_city_label,
        province_label: content.billing_province_label,
        button_text: content.billing_button_text,
        zip_label: content.billing_zip_label,
        country_label: content.billing_country_label,
        button_success: content.billing_button_success
      }"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import cFormShipping from '../forms/cFormShipping.vue'

export default {
  props: {
    headings: {
      type: Object,
      required: true
    },
    content: {
      type: Object,
      required: true
    },
    modifiers: {
      type: Array,
      default: () => []
    }
  },
  components: { cFormShipping }
}
</script>

<style lang="scss">
.c-sidebarShipping__form {
  background-color: $color-white;
  padding: 2rem 1.5rem;
}
</style>
