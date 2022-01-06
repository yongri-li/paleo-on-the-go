<template>
  <div :class="_buildModifiers('c-pagination', modifiers)"
    v-if="active && count > 1"
  >
    <button class="c-pagination__dot"
      v-for="(n, index) in count"
      :key="index"
      :class="index === activeIndex 
        ? ' c-pagination__dot--is-active' : ''"
      @click="update(index)"
    >
      <span class="c-pagination__dotText"
        v-html="index + 1"
      />
    </button>
  </div>
</template>

<script>
export default {
  props: {
    active: {
      type: Number,
      default: 0
    },
    count: {
      type: Number,
      required: true
    },
    modifiers: {
      type: Array,
      default: () => ([])
    }
  },
  data:(self = this) => ({
    activeIndex: self.active - 1
  }),
  methods: {
    update(index) {
      this.activeIndex = index
      this.$emit('update', this.activeIndex + 1)
    }
  },
  watch: {
    active: {
      handler(val) {
        this.activeIndex = val - 1
      }
    }
  }
}
</script>

<style lang="scss">
  .c-pagination {
    @include flex($justify: center, $align: center, $wrap: wrap);
  }
  .c-pagination__dot {
    @include flex($justify: center, $align: center);
    width: 34px;
    height: 34px;
    margin: 0 5px;
    position: relative;
    border: none;
    border-radius: 50%;
    background-color: transparent;
    color: $color-black;
    transition-property: background-color, color;
    transition-duration: .15s;
    transition-timing-function: ease-in-out;
    &:hover {
      color: $color-secondary;
    }
  }
  .c-pagination__dotText {
    color: inherit;
    font-size: 16px;
    font-weight: 500;
  }
  .c-pagination__dot--is-active {
    pointer-events: none;
    background-color: $color-primary;
    color: $color-white;
  }
</style>