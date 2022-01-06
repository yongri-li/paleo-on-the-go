<template>
  <div class="c-colorSwatchGrid">
    <span
      v-for="(color, key) in colors"
      title="Click for details"
      :class="['c-colorSwatch', { 'c-colorSwatch--active': activeColor === key }]"
      :key="key"
      :style="{ 'background-color': color.value.hex }"
      @click="(e) => setActiveColor(e, key)"
    >
      <div class="c-colorSwatch__bubble">
        <div class="c-bubble nowrap">
          {{ key }}
          <br>
          {{ color.value.hex }}
          <br>
          {{ getRgb(color) }}
        </div>
      </div>
    </span>
  </div>
</template>

<script>
  const colors = require('./constants').default.colors.global;

  export default {
    name: 'Colors',
    data() {
      return {
        activeColor: ''
      }
    },
    props: {
      /**
      * Colors
      */
      colors: {
        type: Object,
        default: function() {
          return colors
        }
      }
    },
    methods: {
      setActiveColor(e, color) {
        e.stopPropagation();
        this.activeColor = color;
      },
      resetActiveColor() {
        this.activeColor = '';
      },
      getRgb(color) {
        const rgbReadable = `rgb(${color.value.r}, ${color.value.g}, ${color.value.b})`;
        return rgbReadable;
      }
    },
    mounted() {
      document.body.addEventListener('click', this.resetActiveColor);
    }
  }
</script>

<docs>
  ```js noeditor
  <Colors />
  ```
</docs>
