<template>
  <div :class="_buildModifiers('c-cart', modifiers)">
    <c-overlay class="c-cart__overlay" :show="show" @close="show = false" />
    <c-drawer class="c-cart__drawer" :show="show" @close="show = false" side="right">
      <c-cartHeader />
      <!-- <c-cartItems />
      <c-cartEmpty />
      <c-cartSummary />
      <c-cartActions /> -->
    </c-drawer>
  </div>
</template>

<script>
import cOverlay from '@shared/components/core/cOverlay.vue'
import cDrawer from '@shared/components/core/cDrawer.vue'
import cCartHeader from './cart/cCartHeader.vue'

export default {
  props: {
    modifiers: {
      type: Array,
      default: () => []
    }
  },
  components: {
    cOverlay,
    cDrawer,
    cCartHeader
  },
  data: () => ({ show: false }),
  computed: {
    state() {
      //  Testing Onlyyyyyyyyy
      return this.$store.state
    }
  },
  watch: {
    show: {
      immediate: true,
      handler(val) {
        const body = document.querySelector('[data-body]')
        if (val) body.classList.add('o-body--noScroll')
        else body.classList.remove('o-body--noScroll')
      }
    }
  },
  mounted() {
    const cartTriggers = document.querySelectorAll('[data-cart-trigger]')
    cartTriggers.forEach(trigger =>
      trigger.addEventListener('click', () => {
        this.show = !this.show
      })
    )
  }
}
</script>

<style lang="scss"></style>
