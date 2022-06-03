<template>
  <div :class="_buildModifiers('c-modalPopup', modifiers)" v-if="content">
    <section class="c-modalPopup__wrap">
      <c-h
        class="c-modalPopup__heading c-modal__heading"
        tag="h2"
        level="2"
        :text="content.heading"
        :modifiers="['isBolder']"
      />
      <c-p class="c-modalPopup__text" tag="p" level="2" :text="content.text" :modifiers="['isBolder']" />
      <c-p
        class="c-modalLink"
        tag="a"
        level="2"
        :text="content.one"
        href="testUrl"
        :modifiers="['isBolder']"
      />
      <c-button
        class="c-button"
        :text="content.button"
        :modifiers="['isDefault', 'isPrimary']"
        @click="buildBox"
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
    ...mapMutations('ui', ['UI_CLOSE_MODAL']),
    buildBox() {
      location = '/pages/bundle'
    }
  }
}
</script>

<style lang="scss" scoped>
.c-modalPopup {
  @include flex($direction: column, $justify: center);
  text-align: center;
}
.c-modalPopup__confirm {
  margin-top: 20px;
}
.c-modalPopup__text {
  margin-bottom: 32px;
}
.c-modalPopup__cta {
  width: 100%;
  max-width: 340px;
  margin: 0 auto;
}
.c-modalPopup__wrap {
  padding: 3rem 4rem;

  .c-modalLink {
    color: $color-secondary;
  }

  .c-button__text {
    font-size: 1rem;
  }

  .c-button {
    margin: 0 auto;
  }
}
</style>
