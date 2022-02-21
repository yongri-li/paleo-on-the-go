<template>
  <div :class="_buildModifiers('c-ordersEmpty', modifiers)"
    v-if="content"
  >
    <c-h class="c-ordersEmpty__preheading u-textCenter"
      tag="h3"
      level="3"
      v-if="content.preheading"
      :text="content.preheading"
    />
    <c-h class="c-ordersEmpty__heading u-textCenter"
      tag="h1"
      level="1"
      v-if="content.heading"
      :text="content.heading"
    />
    <c-a class="c-ordersEmpty__button"
      tag="a"
      type="button"
      v-if="content.button_url && content.button_text"
      :href="content.button_url"
      :text="content.button_text"
      :modifiers="['isDefault', 'isSecondary']"
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
      default: () => ([])
    }
  },
  components: { cH, cA }
}
</script>

<style lang="scss">
  .c-ordersEmpty {
    margin-top: 40px;
    @include flex($direction: column);
  }
  .c-ordersEmpty__preheading {
    margin-bottom: 5px;
  }
  .c-ordersEmpty__button {
    min-width: 210px;
  }
</style>