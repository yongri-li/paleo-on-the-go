<template>
  <div class="sp">
    <div class="sp__item">
      <div class="sp__item--back" @click="backRouter(step)">
        <svg width="8" height="14" viewBox="0 0 8 14" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M6.85355 1.15976C6.65829 0.946747 6.34171 0.946747 6.14645 1.15976L1.14645 6.61431C0.951185 6.82732 0.951185 7.17268 1.14645 7.38569L6.14645 12.8402C6.34171 13.0533 6.65829 13.0533 6.85355 12.8402C7.04881 12.6272 7.04881 12.2819 6.85355 12.0689L2.20711 7L6.85355 1.93115C7.04882 1.71814 7.04882 1.37277 6.85355 1.15976Z" fill="#231F20" stroke="#231F20" stroke-width="0.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
      {{ step.name }}
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { changeRouter } from '../../utils'

export default {
  computed: {
    ...mapGetters([
      'getSizeSelected'
    ]),
    step() {
      const param = this.$route.params.box
      if(param === 'subscription') {
        return {
          name: `Choose ${this.getSizeSelected.number_size} Items To Continue`,
          url: '/'
        }
      }
      if(param === 'onetime') {
        return {
          name: '8 Item Minimu',
          url: '/'
        }
      }
      if(param === 'addons') {
        return {
          name: 'One Time Add Ons',
          param: 'subscription'
        }
      }
      return 'Review'
    }
  },
  methods: {
    backRouter(step) {
      if(step.url) {
        window.location = '/'
      }
      if(step.param) {
        changeRouter(step.param)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.sp {
  background-color: #FBFAF4;
  margin: 0 -10px .7rem;

  &__item {
    text-align: center;
    font-weight: 500;
    padding: 0.8rem 0;

    &--back {
      position: absolute;
      left: .5rem;
      padding: 0 .5rem;
    }
  }

}
</style>