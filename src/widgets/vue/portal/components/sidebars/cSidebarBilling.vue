<template>
  <div :class="_buildModifiers('c-sidebarBilling', modifiers)"
    v-if="content"
  >
      <c-formBilling class="c-sidebarBilling__form"        
        :content="{
          address1_label: content.billing_address1_label,
          address2_label: content.billing_address2_label,
          city_label: content.billing_city_label,
          province_label: content.billing_province_label,
          button_text: content.billing_button_text,
          zip_label: content.billing_zip_label,
          button_success: content.billing_button_success
        }"
      />
  </div> <!-- :hideAlert="true" -->
</template>

<script>
import { mapGetters } from 'vuex'
import cFormBilling from '../forms/cFormBilling.vue'

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
  components: { cFormBilling },
}
</script>

<style lang="scss">
  .c-sidebarBilling__form {
    max-width: 800px;
  }
</style>