<template>
  <div class="c-menu-wrapper">
    <div v-if="open" class="c-menu-overlay u-hideDesktop"></div>
    <div
      :class="[
        'c-menu',
        {
          'c-menu--open': open
        }
      ]"
    >
      <div class="c-menu__selection" @click.stop="$emit('toggle')">
        {{ title }}:&nbsp;<span v-if="!open">
          <template>test here</template><template>Show Things I Like</template
          ><template>Remove Things I Dislike asas</template><template>one moreeee</template>
        </span>
        <!--         <div class="c-menu__carat">
          <c-icon icon="chevron" />
        </div> -->
      </div>
      <slot></slot>
    </div>
  </div>
</template>

<script>
import cIcon from '@shared/components/core/cIcon.vue'
export default {
  name: 'cMenu',
  props: {
    open: {
      type: Boolean
    }
    // selectedOptions: {
    //   type: Array
    // },
    // showLikes: {
    //   type: Boolean
    // },
    // removeDislikes: {
    //   type: Boolean
    // },
    // title: {
    //   type: String
    // },
    // selection: {
    //   type: [Number, String]
    // }
  },
  data() {
    return {
      title: 'tets title'
    }
  },
  methods: {
    close() {
      this.$emit('close')
    }
  },
  mounted() {
    document.body.addEventListener('click', this.close)
  },
  beforeDestroy() {
    document.body.removeEventListener('click', this.close)
  },
  components: {
    cIcon
  },
  computed: {
    outputSelectedOptions() {
      if (!this.selectedOptions?.length) return

      if (this.selectedOptions[0].title) {
        return this.selectedOptions
          ? this.selectedOptions
              .map(option => option.title)
              .join(' ')
              .trim()
          : null
      } else {
        return this.selectedOptions.join(' ').trim()
      }
    }
  }
}
</script>
