<template>
  <button
    :class="['c-filter', {
      'c-filter--active': active
    }]"
    @click="$emit('filtered')"
  >
    {{ title }}
  </button>
</template>

<script>
  export default {
    name: "cFilter",
    props: {
      title: {
        type: String
      },
      active: {
        type: Boolean
      }
    }
  };
</script>


