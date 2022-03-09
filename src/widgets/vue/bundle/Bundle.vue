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

<style lang="scss" scoped>

#meal-builder {
  position: relative;
  background-color: #F3F0E9;
  padding: .8rem;
}

</style>