<template>
  <div :class="_buildModifiers('c-sidebar', sidebar.modifiers)">
    <c-overlay class="c-sidebar__overlay" :show="show" @click="UI_CLOSE_SIDEBAR" />
    <c-drawer
      class="c-sidebar__drawer"
      :show="show"
      :side="sidebar.side"
      :closable="false"
      :modifiers="[...sidebar.modifiers]"
      @close="UI_CLOSE_SIDEBAR"
    >
      <!-- 'isFullWidth',  -->
      <div class="c-sidebar__container o-container">
        <button
          class="c-sidebar__back"
          v-if="!sidebar.settings.hideBack || backText"
          @click="UI_CLOSE_SIDEBAR"
        >
          <c-svg class="c-sidebar__backIcon" name="chevron" />
          <span class="c-sidebar__backText" v-html="backText" />
        </button>
        <c-h class="c-sidebar__heading" v-if="heading" tag="h3" level="3" :text="heading" />
        <component
          class="c-sidebar__content"
          :is="sidebarComponent"
          :content="sidebar.content"
          :settings="sidebar.settings"
          :addressNum="sidebar.addressNum"
          :charge="sidebar.charge"
        />
      </div>
    </c-drawer>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
import cOverlay from '@shared/components/core/cOverlay.vue'
import cDrawer from '@shared/components/core/cDrawer.vue'
import cSvg from '@shared/components/core/cSvg.vue'
import cH from '@shared/components/core/cH.vue'

export default {
  data: () => ({
    sidebarComponent: false
  }),
  components: {
    cOverlay,
    cDrawer,
    cSvg,
    cH
  },
  computed: {
    show() {
      return this.sidebarComponent ? true : false
    },
    sidebar() {
      return this.$store.getters['ui/uiByKey']('sidebar')
    },
    backText() {
      const { content } = this.sidebar
      const backKey = Object.keys(content).find(key => key.endsWith('_back'))
      return backKey ? content[backKey] : 'Back'
    },
    heading() {
      const { content } = this.sidebar
      const headingKey = Object.keys(content).find(key => key.endsWith('_heading'))
      return headingKey ? content[headingKey] : false
    }
  },
  methods: {
    ...mapMutations('ui', ['UI_CLOSE_SIDEBAR'])
  },
  watch: {
    'sidebar.component': {
      immediate: true,
      handler(val) {
        this.sidebarComponent = val ? require(`../sidebars/${val}.vue`).default : false
      }
    },
    $route: {
      handler(val) {
        this.UI_CLOSE_SIDEBAR()
      }
    }
  }
}
</script>

<style lang="scss">
.c-sidebar__drawer {
  background-color: #fafafb;
  width: 100vw;

  &.c-drawer {
    @include media-tablet-up {
      top: 84px;
      padding-top: 2rem;
    }
  }
}
.c-sidebar__container {
  padding: 40px 0 60px;

  .c-sidebar__content {
    @include media-tablet-down {
      max-width: calc(100vw - 2rem);
    }
  }
}
.c-sidebar__back {
  @include flex;
  @include button-unset;
  margin-bottom: 15px;
  color: $color-black;
  @include hover-fade;
}
.c-sidebar__backIcon {
  width: 12px;
  margin-right: 8px;
}
.c-sidebar__backText {
  font-size: 1rem;
  font-weight: 400;
  letter-spacing: 0.025rem;
  text-transform: capitalize;
}
.c-sidebar__heading {
  color: $color-black;
  margin-top: 1.5rem;
}
</style>
