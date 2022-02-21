<template>
  <div :class="_buildModifiers('c-modalDeliverychange', modifiers)"
    v-if="content"
  >
    <section class="c-modalZipChange">
      <c-h class="c-modalDeliverychange__heading c-modal__heading"
        tag="h2"
        level="2"
        :text="content.deliveryzip_heading"
        :modifiers="['isBolder']"
      />
      <c-p class="c-modalDeliverychange__text"
        tag="p"
        level="2"
        :text="content.deliveryzip_text"
        :modifiers="['isBolder']"
      />
      <c-p class="c-modalLink"
        tag="a"
        level="2"
        :text="content.deliveryzip_email"
        :href="`mailto:${content.deliveryzip_email}`"
        :modifiers="['isBolder']"
      />      
      <c-button class="c-modalDeliverychange__cancel"
        v-if="content.deliveryzip_button_close"
        :text="content.deliveryzip_button_close"
        :modifiers="[ 'isUnderline', 'isPrimary' ]"
        @click="closeModalandSidebar"
      />
    </section>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'

import cH from '@shared/components/core/cH.vue'
import cP from '@shared/components/core/cP.vue'
import cButton from '@shared/components/core/cButton.vue'

export default {
  props: {
    content: {
      type: Object,
      required: true
    },
    settings: {
      type: Object,
      required: true
    },
    modifiers: {
      type: Array,
      default: () => ([])
    }
  },
  components: {
    cH, cP, cButton
  },
  data: () => ({
    loading: {
      delay: false
    }
  }),
  computed: {
    //
  },
  methods: {
    ...mapMutations('ui', ['UI_CLOSE_MODAL','UI_CLOSE_SIDEBAR']),
    closeModalandSidebar() {
      this.UI_CLOSE_MODAL();
      this.UI_CLOSE_SIDEBAR();           
    }
  },
}
</script>

<style lang="scss">
  .c-modalDeliverychange {
    @include flex($direction: column);
    text-align: center;
  }
  .c-modalDeliverychange__confirm {
    margin-top: 20px;
  }
  .c-modalDeliverychange__text {
    margin-bottom: 32px;
  }
  .c-modalDeliverychange__cta {
    width: 100%;
    max-width: 340px;
    margin: 0 auto;
  }
  .c-modalDeliverychange__cancel {
    margin-top: 22px;
    padding: 0 0 1px;
    border-bottom: 2px solid $color-primary;
    color: $color-primary;
    font-size: 14px;
    font-weight: 700;
    text-transform: uppercase;
    &:hover {
      border-color: transparent;
      cursor: pointer;
    }
  }

  .c-modalZipChange {
    .c-modalLink {
      color: $color-evergreen;
    }

    .c-button__text {
      font-size: 1rem;
    }
  }
</style>
