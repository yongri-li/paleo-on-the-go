<template>
  <header :class="_buildModifiers('c-portalHeader', modifiers)" v-if="navigation">
    <div class="c-portalHeader__main u-hideMobileDown">
      <nav class="c-portalHeader__mainNav">
        <component
          class="c-portalHeader__mainLink"
          v-for="(link, index) in navigation"
          :key="index"
          :is="link.tag"
          v-bind="link.attributes"
        >
          <span class="c-portalHeader__mainText" v-html="link.text" />
        </component>
      </nav>
    </div>
    <div
      :class="`${_buildModifiers('c-portalHeader__mobile', mobileModifiers)} 
      u-hideTabletUp`"
    >
      <div class="c-portalHeader__mobileTrigger" @click="open = !open">
        <c-svg class="c-portalHeader__mobileSvg" name="circleChevron" />
        <span class="c-portalHeader__mobileLabel" v-if="activeLink" v-html="activeLink.text" />
      </div>
      <transition name="t-mobileNav-slide">
        <nav class="c-portalHeader__mobileNav" v-if="open">
          <component
            class="c-portalHeader__mobileLink"
            v-for="(link, index) in navigation"
            :key="index"
            :is="link.tag"
            v-bind="link.attributes"
          >
            <span class="c-portalHeader__mobileText" v-html="link.text" />
          </component>
        </nav>
      </transition>
    </div>
  </header>
</template>

<script>
import cSvg from '@shared/components/core/cSvg.vue'
import { mapGetters } from 'vuex'

export default {
  props: {
    modifiers: {
      type: Array,
      default: () => []
    }
  },
  data: () => ({ open: false }),
  components: { cSvg },
  computed: {
    ...mapGetters('customer', ['customerShopify', 'customerRecharge']),
    navigation() {
      let links = this.$store.getters['customize/customizePartByKey']('navigation')
      if (links) {
        links = links.filter(link =>
          link.visibility === 'shopify_users'
            ? this.customerShopify
            : link.visibility === 'recharge_users'
            ? this.customerRecharge
            : true
        )
        return links.map(link => {
          if (link.page === 'external') {
            link = { ...link, tag: 'a', attributes: { href: link.url } }
          } else if (link.page === 'signout') {
            link = { ...link, tag: 'a', attributes: { href: '/account/logout' } }
          } else {
            link = { ...link, tag: 'router-link', attributes: { to: { name: link.page } } }
            if (link.page === 'shipment') link.attributes.exact = true
          }
          return link
        })
      }
    },
    activeLink() {
      return this.navigation.find(link => link.page === this.$route.name)
    },
    mobileModifiers() {
      let modifiers = []
      if (this.open) modifiers.push('isOpen')
      return modifiers
    }
  },
  methods: {
    // handleClick(link) {
    //   this.open = false
    //   if(!link.type === 'signout') this.authSetLogout()
    // },
    handleResize() {
      const width = window.innerWidth
      if (width >= 768) this.open = false
    }
  },
  mounted() {
    window.addEventListener('resize', this.handleResize)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.handleResize)
  }
}
</script>

<style lang="scss">
.c-portalHeader {
  width: 100%;
  height: 48px;
  z-index: $z-index-header;
  background-color: $color-white;
  user-select: none;
  position: relative;
  @include media-tablet-up {
    height: 58px;
  }
}
.c-portalHeader__main {
  width: 100%;
  height: 100%;
  padding: 0 30px;
}
.c-portalHeader__mainNav {
  width: 100%;
  height: 100%;
  @include flex($justify: flex-start, $align: stretch);
}
.c-portalHeader__mainLink {
  padding: 0 30px;
  @include flex($justify: center, $align: center);
  @include hover-fade;
  &.router-link-exact-active {
    pointer-events: none;
    opacity: 1;
  }
  @include media-down(900px) {
    padding: 0 15px;
  }
}
.c-portalHeader__mainText {
  color: $color-black;
  font-family: $font-body;
  font-size: 1rem;
  font-weight: 500;
  padding: 0.25rem 0;
  @include media-down(900px) {
    padding: 8px 10px;
    font-size: 14px;
  }
  .router-link-exact-active & {
    box-shadow: 0 4px 0px -1px $color-primary;
  }
}
.c-portalHeader__mobile {
  width: 100%;
  height: 100%;
  // @include hover-active { cursor: pointer; }
}
.c-portalHeader__mobileTrigger {
  height: 100%;
  padding: 0 15px;
  @include flex($align: center);
  @include hover-fade;
}
.c-portalHeader__mobileSvg {
  width: 24px;
  display: flex !important;
  margin-right: 20px;
  color: $color-white;
  transition: transform 0.2s ease-in-out;
  transform-origin: 50% 50%;
  .c-portalHeader__mobile--isOpen & {
    transform: rotate(180deg);
  }
}
.c-portalHeader__mobileLabel {
  color: $color-white;
  font-family: $font-heading;
  font-size: 16px;
  font-weight: 500;
}
.c-portalHeader__mobileNav {
  height: auto;
  position: relative;
  @include flex($direction: column);
  background-color: lighten($color-secondary, 15%);
  transition: max-height 0.2s ease-in-out;
  overflow: hidden;
}
.c-portalHeader__mobileLink {
  width: 100%;
  padding: 10px 20px;
  color: $color-white;
  font-family: $font-heading;
  font-size: 16px;
  font-weight: 400;
  @include hover-fade;
  &:last-child {
    margin-bottom: 30px;
  }
}
.t-mobileNav-slide-enter,
.t-mobileNav-slide-leave-to {
  max-height: 0;
}
.t-mobileNav-slide-leave,
.t-mobileNav-slide-enter-to {
  max-height: 230px;
}
</style>
