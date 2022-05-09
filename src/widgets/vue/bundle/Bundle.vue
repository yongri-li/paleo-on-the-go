<template>
  <div id="meal-builder">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'MealBuilder',
}
</script>

<style lang="scss">

body {
  background-color: #f3f0e9;
}

#meal-builder {
  position: relative;
  background-color: #F3F0E9;
  padding-bottom: 170px;

  @include media-tablet-up {
    padding-bottom: 3rem;
  }
}

</style>