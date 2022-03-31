<template>
  <div class="yb-body">
    <your-box-body-items />
    <your-box-body-add-ons />
  </div>
</template>

<script>
import YourBoxBodyItems from './YourBoxBodyItems.vue'
import YourBoxBodyAddOns from './YourBoxBodyAddOns.vue'

export default {
  components: {
    YourBoxBodyItems,
    YourBoxBodyAddOns
  }
}
</script>