<template>
  <div :class="_buildModifiers('c-accordionItem', extendedModifiers)"
    ref="accordionItem"
  >
    <div :class="_buildModifiers('c-accordionItem__trigger', triggerModifiers)"
      ref="trigger"
      @click="toggleContent"
    >
      <slot name="trigger" />
    </div>
    <div class="c-accordionItem__content"
      ref="content"
      :style="contentStyle"
    >
      <slot name="content" />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    modifiers: {
      type: Array,
      default: () => ([])
    },
    open: {
      type: Boolean,
      default: false
    },
    duration: {
      type: Number,
      default: 350
    }
  },
  data: () => ({
    maxHeight: '0px', 
    active: false,
    transition: false
  }),
  computed:{
    multipleOpen() {
      return this.$parent.multipleOpen
    },
    extendedModifiers() {
      let modifiers = [ ...this.modifiers]
      if(this.transition) modifiers.push('hasTransition')
      return modifiers
    },
    triggerModifiers() {
      let modifiers = []
      if(this.active) modifiers.push('isOpen')
      return modifiers
    },
    contentStyle() {
      const transition = this.transition 
        ? `max-height ${this.duration}ms ease-in-out`
        : ''
      return { 
        transition: transition,
        maxHeight: this.maxHeight 
      }
    }
  },
  methods:{
    changeHeight () {
      const content = this.$refs.content
      if(content && this.maxHeight !== '0px') {
        this.maxHeight = `${content.scrollHeight}px`
      }
    },
    toggleContent() {
      if(!this.multipleOpen && this.$parent.closeAllItems) this.$parent.closeAllItems(this.$el)
      let maxHeight = this.$refs.content.scrollHeight
      if(this.maxHeight == '0px') this.maxHeight = `${maxHeight}px`
      else this.maxHeight = `0px`
      this.active = !this.active
    }
  },
  mounted() {
    window.addEventListener('resize', this.changeHeight)
    if(this.open) setTimeout(() => this.toggleContent())
    setTimeout(() => this.transition = true, this.duration)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.changeHeight)
  }
}
</script>

<style lang="scss">
  .c-accordionItem {
    overflow: hidden;
    &:not(.c-accordionItem--hasTransition) * {
      transition: none !important;
    }
  }
  .c-accordionItem__trigger {
    width: 100%;
    &:hover { cursor: pointer; }
  }
</style>