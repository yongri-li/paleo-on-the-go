<template>
  <div :class="_buildModifiers('c-modalDeliverychange', modifiers)" v-if="content">
    <section class="c-modalZipChange">
      <c-h
        class="c-modalDeliverychange__heading c-modal__heading"
        tag="h2"
        level="2"
        text="H2 test here"
        :modifiers="['isBolder']"
      />
      <c-p
        class="c-modalDeliverychange__text"
        tag="p"
        level="2"
        :text="content.one"
        :modifiers="['isBolder']"
      />
      <c-p
        class="c-modalLink"
        tag="a"
        level="2"
        :text="content.one"
        href="testUrl"
        :modifiers="['isBolder']"
      />
      <c-button
        class="c-modalDeliverychange__cancel"
        :text="content.one"
        :modifiers="['isUnderline', 'isPrimary']"
        @click="confirmDelay"
      />
      <span @click="closeModalandSidebar">Nevermind</span>
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
      type: Object
    },
    modifiers: {
      type: Array,
      default: () => []
    }
  },
  components: {
    cH,
    cP,
    cButton
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
    ...mapMutations('ui', ['UI_CLOSE_MODAL', 'UI_CLOSE_SIDEBAR']),
    confirmDelay() {
      const evt = new CustomEvent(
        'delayConfirmed',
        {
          detail: {
            delayed: true
          }
        },
        false
      )
      document.dispatchEvent(evt)
    },
    closeModalandSidebar() {
      this.UI_CLOSE_MODAL()
      this.UI_CLOSE_SIDEBAR()
    }
  }
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
.c-modalZipChange {
  .c-modalLink {
    color: $color-secondary;
  }

  .c-button__text {
    font-size: 1rem;
  }
}
</style>
