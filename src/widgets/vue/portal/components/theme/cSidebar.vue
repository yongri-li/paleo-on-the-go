<template>
  <div :class="_buildModifiers('c-sidebar', sidebar.modifiers)">
    <c-overlay class="c-sidebar__overlay" :show="show" @click.native="UI_CLOSE_SIDEBAR" />
    <!-- test -->
    <!-- v-if="nextUpcomingCharge" -->
    <c-drawer
      class="c-sidebar__drawer"
      v-if="nextUpcomingCharge"
      :show="show"
      :side="sidebar.side"
      :closable="false"
      :shipment="nextUpcomingCharge[0]"
      :component="sidebar.component"
      @close="UI_CLOSE_SIDEBAR"
    >
      <div class="c-sidebar__container o-container">
        <button
          class="c-sidebar__back"
          v-if="!sidebar.settings.hideBack || backText"
          @click="UI_CLOSE_SIDEBAR"
        >
          <c-svg class="c-sidebar__backIcon" name="chevron" />
          <span class="c-sidebar__backText" v-html="backText" />
        </button>
        <c-h
          class="c-sidebar__heading"
          v-if="heading && !isCancelSidebar"
          tag="h1"
          level="1"
          :text="heading"
        />
        <component
          class="c-sidebar__content"
          :is="sidebarComponent"
          :content="sidebar.content"
          :settings="sidebar.settings"
          :nextscheduledat="sidebar.nextscheduledat"
        /><!-- :nextscheduledat="sidebar.nextcutoff" -->
      </div>
    </c-drawer>
    <c-sidebarPayment
      class="c-pageDetails__payment"
      v-if="showPayment"
      :settings="sidebar.settings"
    />
  </div>
</template>

<script>
import { mapMutations, mapGetters } from 'vuex'
import cOverlay from '@shared/components/core/cOverlay.vue'
import cDrawer from '@shared/components/core/cDrawer.vue'
import cSvg from '@shared/components/core/cSvg.vue'
import cH from '@shared/components/core/cH.vue'
import cSidebarPayment from '../sidebars/cSidebarPayment.vue'

export default {
  data: () => ({
    sidebarComponent: false
  }),
  components: {
    cOverlay,
    cDrawer,
    cSvg,
    cH,
    cSidebarPayment
  },
  computed: {
    ...mapGetters('customer', ['customerUpcomingCharges']),
    show() {
      if (this.sidebar.component === 'cSidebarPayment') return false
      else return this.sidebarComponent ? true : false
    },
    sidebar() {
      return this.$store.getters['ui/uiByKey']('sidebar')
    },
    isCancelSidebar() {
      const cancelSidebarNames = [
        'cSideBarCancel',
        'cSidebarCancelS1',
        'cSidebarCancelS2',
        'cSidebarCancelS3',
        'cSidebarCancelS4',
        'cSidebarActivate'
      ]
      const hasSome = cancelSidebarNames.some(element => {
        return element === this.sidebar.component
      })
      return hasSome
    },
    backText() {
      const { content } = this.sidebar
      const backKey = Object.keys(content).find(key => key.endsWith('_back'))
      return backKey ? content[backKey] : false
    },
    heading() {
      const { content } = this.sidebar
      const headingKey = Object.keys(content).find(key => key.endsWith('_heading'))
      return headingKey ? content[headingKey] : false
    },
    nextUpcomingCharge() {
      return this.customerUpcomingCharges?.filter(
        chrg => chrg.status !== ('REFUNDED' || 'CANCELLED')
      )
    },
    showPayment() {
      return this.$route.name === 'profile'
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
  background-color: $color-spring-wood;
  color: $color-off-black;
}
.c-sidebar__container {
  padding: 35px 0;
  width: calc(100% - 40px);
  @include media-desktop-up {
    padding: 50px 0;
    width: calc(100% - 128px);
  }
}
.c-sidebar__back {
  @include flex;
  @include button-unset;
  margin-bottom: 38px;
  color: $color-black;
  @include hover-fade;
}
.c-sidebar__backIcon {
  transform: rotate(90deg);
  width: 12px;
  margin-right: 8px;
}
.c-sidebar__backText {
  font-size: 15px;
  font-weight: 700;
  text-transform: uppercase;
  @include media-desktop-up {
    font-size: 17px;
  }
}
.c-sidebar__heading {
  color: $color-off-black;
  font-size: 24px;
  margin-bottom: 1rem;
  @include media-desktop-up {
    font-size: 28px;
  }
}
</style>
