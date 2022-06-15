<template>
  <div :class="_buildModifiers('c-accordionItem', extendedModifiers)" ref="accordionItem">
    <div
      :class="_buildModifiers('c-accordionItem__trigger', triggerModifiers)"
      ref="trigger"
      @click="toggleContent"
    >
      <slot name="trigger" />
    </div>
    <div class="c-accordionItem__content" ref="content" :style="contentStyle">
      <slot name="content" />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    modifiers: {
      type: Array,
      default: () => []
    },
    open: {
      type: Boolean,
      default: false
    },
    duration: {
      type: Number,
      default: 275
    },
    boxNum: {
      type: Number
    },
    setBoxHeight: {
      type: Boolean
    },
    closeAccCancelBox: {
      type: Array
    },
    mountToggle: {
      type: Boolean
    },
    fromPortalShipments: {
      type: Boolean
    }
  },
  data: () => ({
    maxHeight: '0px',
    active: false,
    transition: false
  }),
  computed: {
    multipleOpen() {
      return this.$parent.multipleOpen
    },
    extendedModifiers() {
      let modifiers = [...this.modifiers]
      if (this.transition && !this.fromPortalShipments) modifiers.push('hasTransition')
      if (this.transition && this.fromPortalShipments) setTimeout(() => modifiers.push('hasTransition'), 1250)
      return modifiers
    },
    triggerModifiers() {
      let modifiers = []
      if (this.active) modifiers.push('isOpen')
      return modifiers
    },
    contentStyle() {
      const transition = this.transition ? `max-height ${this.duration}ms ease-in-out` : ''
      return {
        transition: transition,
        maxHeight: this.maxHeight
      }
    }
  },
  methods: {
    changeHeight() {
      const content = this.$refs.content
      if (content && this.maxHeight !== '0px') {
        this.maxHeight = `${content.scrollHeight}px`
      }
    },
    toggleContent(e) {
      let ignoreClass
      if (e) ignoreClass = e.srcElement.classList.value
      if (ignoreClass?.includes('js--ignoreAccOpen')) return
      if (!this.multipleOpen && this.$parent.closeAllItems) this.$parent.closeAllItems(this.$el)
      let maxHeight = this.$refs.content.scrollHeight
      if (this.maxHeight == '0px') this.maxHeight = `${maxHeight}px`
      else this.maxHeight = `0px`
      this.active = !this.active
      if (this.active) {
        this.evtListenSetHeight()
      } else {
        this.removeEvtListen()
        this.$root.$emit('accClosed', this.boxNum)
      }
    },
    evtListenSetHeight() {
      this.$root.$on('setHeightFromRadio', () => {
        this.setBoxHeightFunc()
      })
    },
    evtListenClickToggle() {
      this.$root.$on('closeAccActivate', e => {
        if (e[0] === this.boxNum && e[1] === 'Reactivate') this.toggleContent()
      })
    },
    removeEvtListen() {
      this.$root.$off('setHeightFromRadio')
    },
    setBoxHeightFunc() {
      const content = this.$refs.content
      content.style.maxHeight = 'fit-content'
    },
    clickToggle(val) {
      if (val[0] === this.boxNum) {
        this.toggleContent()
      }
    }
  },
  watch: {
    setBoxHeight() {
      const content = this.$refs.content
      if (this.setBoxHeight) this.setBoxHeightFunc()
    },
    closeAccCancelBox: {
      handler(val) {
        this.clickToggle(val)
      }
    }
  },
  created() {
    this.evtListenClickToggle()
  },
  async mounted() {
    window.addEventListener('resize', this.changeHeight)
    if (this.open) this.toggleContent()
    setTimeout(() => (this.transition = true), this.duration)

    // if (this.mountToggle) {
    //   const asd = this.$refs.content
    //   asd.style.maxHeight = '862px'
    //   setTimeout(() => (asd.style.maxHeight = '0'), 150)
    // }
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.changeHeight)
    this.removeEvtListen()
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
  &:hover {
    cursor: pointer;
    /*asdas*/
  }
}
</style>
