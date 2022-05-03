<template>
  <div :class="_buildModifiers('c-modalDelay', modifiers)" v-if="content">
    <section class="c-modalDelay__inner">
      <c-h
        class="c-modalDelay__heading c-modal__heading"
        tag="h3"
        level="3"
        :text="content.heading"
        :modifiers="['isBolder']"
      />
      <c-p class="c-modalDelay__text" tag="p" level="2" v-html="content.text" />
      <hr />
      <c-button
        class="c-modalDelay__cta"
        :text="content.button"
        :loading="loading"
        :modifiers="['isDefault', 'isPrimary', 'hideTextLoading', 'isSubmit']"
        @click="confirmDelay"
      />
      <span @click="closeModalandSidebar" class="c-modalDelay__cancel">{{ content.cancel }}</span>
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
    loading: false
  }),
  computed: {
    //
  },
  methods: {
    ...mapMutations('ui', ['UI_CLOSE_MODAL', 'UI_CLOSE_SIDEBAR']),
    confirmDelay() {
      this.loading = true
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
      this.loading = false
      this.UI_CLOSE_MODAL()
      this.UI_CLOSE_SIDEBAR()
    }
  }
}
</script>

<style lang="scss">
.c-modalDelay {
  @include flex($direction: column);
  text-align: center;

  &__inner {
    padding: 2rem 3rem;
  }

  &__confirm {
    margin-top: 1.25rem;
  }
  &__text {
    margin-bottom: 2rem;

    span {
      color: $color-secondary;
      font-weight: 500;
    }
  }
  &__cta {
    margin: 1.5rem auto;
  }
  &__cancel {
    cursor: pointer;
    text-decoration: underline;
  }
}
</style>
