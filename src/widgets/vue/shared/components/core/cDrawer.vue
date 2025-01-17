<template>
  <transition :name="name">
    <aside :class="_buildModifiers('c-drawer', extendedModifiers)" v-if="show">
      <button class="c-drawer__close" v-if="closable" @click="$emit('close')">
        <c-svg class="c-drawer__closeIcon" name="timesThick" />
      </button>
      <slot />
    </aside>
  </transition>
</template>

<script>
import cSvg from '@shared/components/core/cSvg.vue'

export default {
  props: {
    show: {
      type: Boolean,
      default: false
    },
    side: {
      type: String,
      default: 'left'
    },
    closable: {
      type: Boolean,
      default: true
    },
    modifiers: {
      type: Array,
      default: () => []
    }
  },
  components: { cSvg },
  computed: {
    name() {
      return `t-drawer-${this.side}`
    },
    extendedModifiers() {
      let modifiers = [...this.modifiers]
      if (this.side) modifiers.push(`on${this._stringCapitalize(this.side)}`)
      return modifiers
    }
  }
}
</script>

<style lang="scss">
.c-drawer {
  position: fixed;
  top: 0;
  bottom: 0;
  width: 100%;
  max-width: 580px;
  background-color: $color-ecru;
  color: $color-black;
  overflow-y: scroll;
  transition-duration: 0.3s;
  transition-timing-function: ease-in-out;
  overflow-x: hidden;
  z-index: $z-index-drawer;
  &.c-drawer--onLeft {
    left: 0;
  }
  &.c-drawer--onRight {
    right: 0;
  }
  &.c-drawer--isFullWidth {
    width: 100vw;
  }

  @include media-tablet-down {
    padding-top: 100px;
  }
}

.c-drawer__close {
  @include button-unset;
  position: absolute;
  top: 20px;
  width: 16px;
  height: 16px;
  z-index: 1;
  @include hover-fade;
  .c-drawer--onLeft & {
    left: 20px;
  }
  .c-drawer--onRight & {
    right: 20px;
  }
  .c-drawer--hideClose & {
    display: none;
  }
}
.c-drawer__closeIcon {
  width: inherit;
  height: inherit;
  color: $color-black;
}
.t-drawer-left-enter,
.t-drawer-left-leave-to {
  transform: translateX(-100%);
}
.t-drawer-right-enter,
.t-drawer-right-leave-to {
  transform: translateX(100%);
}
.t-drawer-left-leave,
.t-drawer-left-enter-to,
.t-drawer-right-leave,
.t-drawer-right-enter-to {
  transform: translateX(0);
}
</style>
