<template>
  <div
    :class="['c-radio', { 'c-radio--selected': selected }]"
    @click="update"
  >
    <slot></slot>
  </div>
</template>

<script>
  /**
   * Radio button used for selection within UI.
   */
  export default {
    name: 'cStyleguideDemo',
    props: {
      /**
      * Sets selected state
      */
      selected: {
        type: Boolean,
        default: false
      }
    },
    methods: {
      /** Triggered when button is clicked
			* @event radioChanged
			* @type {Event}
			*/
      update() {
        this.$emit('radioChanged', !this.selected)
      }
    }
  }
</script>

<docs>
### Examples

Unselected:

```jsx
<cStyleguideDemo>Lorem ipsum dolor sit amet</cStyleguideDemo>
```

HTML

```html
<div class="c-radio" data-radio>Lorem ipsum dolor sit amet</div>
```

Selected:

```jsx
<cStyleguideDemo selected>Lorem ipsum dolor sit amet</cStyleguideDemo>
```

HTML

```html
<div class="c-radio c-radio--selected" data-radio>Lorem ipsum dolor sit amet</div>
```

### Demo

```js
new Vue({
  data() {
    return {
      selected: false
    }
  },
  methods: {
    handleChange() {
      this.selected = !this.selected
    }
  },
  template: `
    <div>
      <span v-if="selected">
        🍒
      </span>
      <cStyleguideDemo
        @radioChanged="handleChange"
        :selected="selected"
      >
        Cherry on top
      </cStyleguideDemo>
    </div>
  `
})
```
</docs>
