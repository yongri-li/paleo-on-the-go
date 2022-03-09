<template>
  <div>
    <button v-if="!quantity" class="c-btnQty" @click="$emit('qtyIncrease');">
      + Add
    </button>
    <div v-else class="c-btnQty c-btnQty--controls">
      <button class="c-btnQty__btn" @click="$emit('qtyDecrease');">
        –
      </button>
      <div class="c-btnQty__qty">
        {{ quantity }}
      </div>
      <button class="c-btnQty__btn" @click="$emit('qtyIncrease');">
        +
      </button>
    </div>
  </div>
</template>

<script>
  import cIcon from "@shared/components/core/cIcon.vue";
  export default {
    name: "cBtnQty",
    props: {
      quantity: {
        type: Number
      },
    },
    methods: {
      handleQtyIncrease() {
        this.$emit('qtyIncrease');
      }
    },
    components: {
      cIcon,
    }
  };
</script>

<style lang="scss">
  
</style>

<docs>
  ```jsx
    <cBtnQty
      :quantity="0"
    />
  ```
  
  ```jsx
    <cBtnQty
      :quantity="1"
    />
  ```
</docs>
