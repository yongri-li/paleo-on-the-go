<template>
  <div :class="_buildModifiers('c-radio', extendedModifiers)" ref="radio" @click="update">
    <span class="c-radio__square" />
    <input class="c-radio__input" :checked="isActive" ref="input" type="radio" v-bind="attributes" />
    <span class="c-radio__text" v-if="radioText" v-html="radioText" />
  </div>
</template>

<script>
export default {
  props: {
    error: {
      type: Boolean,
      default: false
    },
    text: {
      type: [String, Boolean],
      required: false
    },
    active: {
      type: [String, Number, Boolean],
      required: false
    },
    uncheck: {
      type: Boolean,
      default: false
    },
    attributes: {
      type: Object,
      default: () => ({})
    },
    modifiers: {
      type: Array,
      default: () => []
    }
  },
  data: (self = this) => ({
    checked: self.attributes.checked
  }),
  computed: {
    extendedModifiers() {
      let modifiers = [...this.modifiers]
      if (this.error) modifiers.push('hasError')
      if (this.isActive) modifiers.push('isActive')
      if (this.icon) modifiers.push('hasIcon')
      return modifiers
    },
    isActive() {
      const { active, attributes, checked } = this
      return active !== undefined && attributes.value !== undefined
        ? active.toString() === attributes.value.toString()
        : checked
    },
    radioText() {
      return this.text ? this.text : this.attributes.value
    }
  },
  methods: {
    update() {
      if (this.uncheck && this.isActive) {
        this.checked = false
        this.$emit('input', false)
        if (this.$parent.update) this.$parent.update(false)
      } else {
        this.checked = true
        this.$root.$emit('setHeightFromRadio', true)
        this.$emit('input', this.$refs.input.value)
        if (this.$parent.update) this.$parent.update(this.$refs.input.value)
      }
    }
  }
}
</script>

<style lang="scss">
.c-radio {
  width: 100%;
  @include flex($justify: flex-start, $align: center);
  position: relative;
}
.c-radio__input {
  appearance: none;
  position: absolute;
  width: 100%;
  height: 100%;
  padding: 0;
  margin: 0;
  opacity: 0;
  z-index: 2;
  &:hover {
    cursor: pointer;
  }
}
.c-radio__square {
  @include flex($justify: center, $align: center);
  position: absolute;
  left: 0;
  width: 18px;
  min-width: 18px;
  height: 18px;
  border-width: 1.5px;
  border-style: solid;
  border-radius: 3px;
  &:hover {
    cursor: pointer;
  }
  &:after {
    content: '';
    width: calc(100% - 4px);
    height: calc(100% - 4px);
    border-radius: inherit;
    z-index: 1;
    opacity: 0;
    .c-radio--isActive & {
      opacity: 1;
    }
  }
  .c-radio--isSmaller & {
    width: 1rem;
    min-width: 1rem;
    height: 1rem;
  }
  .c-radio--isLarger & {
    width: 22px;
    min-width: 22px;
    height: 22px;
  }
  .c-radio--isBlack & {
    border-color: rgba($color-black, 0.25);
    &:after {
      background-color: $color-black;
    }
  }
  .c-radio--isBlack.c-radio--isActive & {
    border-color: $color-black;
  }
  .c-radio--isPrimary & {
    border-color: $color-primary;
    &:after {
      background-color: $color-primary;
    }
  }
  .c-radio--isSecondary {
    border-color: $color-secondary;
    &:after {
      background-color: $color-secondary;
    }
  }
}
.c-radio__text {
  margin-left: 1rem;
  position: relative;
  top: 2px;
  @include text-body;
  .c-radio--hideText & {
    display: none;
  }
}
</style>
