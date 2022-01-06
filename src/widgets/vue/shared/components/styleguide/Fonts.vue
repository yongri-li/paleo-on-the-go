<template>
  <div>
    <p
      v-for="(font, key) in fonts"
      :key="key"
      :style="{ 'font-family': font.value[0].value }"
      :title="font.value[0].value"
    >
      {{ font.value[0].value }}: The wren earns his living noiselessly
    </p>
  </div>
</template>

<script>
  const fonts = require('./constants').default.fonts.global;

  export default {
    name: 'Fonts',
    props: {
      fonts: {
        type: Object,
        default: function() {
          return fonts;
        }
      }
    }
  }
</script>

<docs>
  ```js noeditor
  <Fonts />
  ```
</docs>
