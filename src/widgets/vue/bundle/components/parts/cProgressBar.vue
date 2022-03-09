<template>
  <div class="c-progressBar">
    <span class="c-progressBar__progress" :style="`width: ${percentComplete}%`"></span>
  </div>
</template>

<script>
  export default {
    name: "cProgressBar",
    props: {
      percentComplete: {
        type: Number
      }
    }
  };
</script>

