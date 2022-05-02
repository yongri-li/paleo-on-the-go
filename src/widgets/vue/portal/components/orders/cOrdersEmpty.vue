<template>
  <div :class="_buildModifiers('c-ordersEmpty', modifiers)" v-if="content">
    <c-h
      class="c-ordersEmpty__preheading u-textCenter"
      tag="h5"
      level="5"
      v-if="content.preheading"
      :text="content.preheading"
    />
    <c-h
      class="c-ordersEmpty__heading u-textCenter"
      tag="h2"
      level="2"
      v-if="content.heading"
      :text="content.heading"
    />
    <c-a
      class="c-ordersEmpty__button"
      tag="a"
      type="button"
      v-if="content.button_url && content.button_text"
      :href="content.button_url"
      :text="content.button_text"
      :modifiers="['isDefault', 'isPrimary']"
    />
  </div>
</template>

<script>
import cH from '@shared/components/core/cH.vue'
import cA from '@shared/components/core/cA.vue'

export default {
  props: {
    content: {
      type: Object,
      required: true
    },
    modifiers: {
      type: Array,
      default: () => []
    }
  },
  components: { cH, cA }
}
</script>

<style lang="scss">
.c-ordersEmpty {
  min-height: 45vh;
  margin-top: 3rem;
  @include flex($direction: column, $justify: center);

  &__preheading {
    letter-spacing: 1px;
    text-transform: uppercase;
    margin-bottom: 1rem;
  }

  &__heading {
    margin-bottom: 1rem;
  }
}
</style>
