<template>
  <div :class="_buildModifiers('c-sidebarPayment', modifiers)" v-if="customerRecharge">
    <div class="c-sidebar__container">
      <iframe class="c-sidebar__iframe" :src="src" frameborder="0" />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  props: {
    modifiers: {
      type: Array,
      default: () => []
    }
  },
  components: {},
  computed: {
    ...mapGetters('customer', ['customerRecharge']),
    src() {
      const { customerRecharge } = this
      if (customerRecharge) {
        return `https://shopifysubscriptions.com/customer_portal_payment_source_form/${customerRecharge.hash}/payment_source`
        // return `https://shopifysubscriptions.com/customer_portal_forms/${customerRecharge.hash}/customer_card/`
      }
    }
  }
}
</script>

<style lang="scss">
.c-sidebarPayment {
  .c-sidebar__iframe {
    width: 100%;
    min-height: 390px;
    height: 100%;

    @include media-mobile-down {
      min-height: 450px;
    }
  }

  .c-sidebar__container {
    padding: 2rem 0;
  }

  c-accordionItem__trigger {
    position: relative;
    z-index: 10;
  }
}
</style>
