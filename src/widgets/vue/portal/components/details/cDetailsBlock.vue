<template>
  <div :class="_buildModifiers('c-detailsBlock', modifiers)">
    <c-h
      class="c-detailsBlock__heading"
      v-if="heading"
      tag="h5"
      level="5"
      :modifiers="['isLabel']"
      :text="heading"
    />
    <div class="c-detailsBlock__inner">
      <slot />
    </div>
  </div>
</template>

<script>
import cH from '@shared/components/core/cH.vue'

export default {
  props: {
    heading: {
      type: [String, Boolean],
      default: false
    },
    modifiers: {
      type: Array,
      default: () => []
    }
  },
  components: { cH }
}
</script>

<style lang="scss">
.c-detailsBlock {
  height: 100%;
  width: 100%;
  @include flex($direction: column, $justify: stretch, $align: stretch, $wrap: nowrap);
}
.c-detailsBlock__inner {
  min-height: 100px;
  padding: 1rem 1.25rem;
  @include flex($justify: space-between, $wrap: nowrap);
  background-color: $color-white;
  @include media-tablet-up {
    padding: 20px 30px;
  }
}

.withAccordion {
  .c-detailsBlock__inner {
    min-height: 10px;

    .c-accordion {
      flex: 1;

      .c-details__boxButton {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }

      .c-accordionItem__trigger .c-details__boxButton section {
        transition: opacity 200ms;
      }

      .c-accordionItem__trigger--isOpen .c-details__boxButton section {
        opacity: 0;
        pointer-events: none;
      }

      .c-accordionItem__content {
        transition: max-height 170ms, margin-top 285ms !important;
      }

      .c-accordionItem__trigger--isOpen + .c-accordionItem__content {
        margin-top: -38px;
      }
    }
  }
}
</style>
